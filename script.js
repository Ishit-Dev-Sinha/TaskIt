document.addEventListener('DOMContentLoaded', () => {

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    let taskToDeleteId = null;

    const todoForm = document.getElementById('todo-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');
    const validationMsg = document.getElementById('validation-msg');
    const dragDropFooter = document.getElementById('drag-drop-footer');
    const currentDateText = document.getElementById('current-date-text');
    const sidebar = document.getElementById('app-side-bar');
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const clearCompletedBtn = document.getElementById('clear-completed-btn');
    const statsTotalCount = document.getElementById('stats-total-count');
    const statsCompletedCount = document.getElementById('stats-completed-count');
    const statsPendingCount = document.getElementById('stats-pending-count');
    const badgeAllNav = document.getElementById('badge-all-nav');
    const badgeCompletedNav = document.getElementById('badge-completed-nav');
    const badgePendingNav = document.getElementById('badge-pending-nav');
    const filterPills = document.querySelectorAll('.filter-pill');
    const navItems = document.querySelectorAll('.nav-item');
    const confirmModal = document.getElementById('confirm-modal');
    const modalCloseX = document.getElementById('modal-close-x');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    const modalConfirmBtn = document.getElementById('modal-confirm-btn');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');

    const displayDate = () => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDateText.textContent = new Date().toLocaleDateString('en-US', options);
    };

    const toggleSidebar = (show) => {
        if (show) {
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
        } else {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        }
    };

    menuToggleBtn.addEventListener('click', () => toggleSidebar(true));
    sidebarCloseBtn.addEventListener('click', () => toggleSidebar(false));
    sidebarOverlay.addEventListener('click', () => toggleSidebar(false));

    const initTheme = () => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }
    };

    themeToggleBtn.addEventListener('click', () => {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });

    const saveToLocalStorage = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const updateStats = () => {
        const total = tasks.length;
        let completed = 0; 
        for (let task of tasks) { 
            if (task.completed) { 
                completed++;
            }
        }
        const pending = total - completed;

        statsTotalCount.textContent = total;
        statsCompletedCount.textContent = completed;
        statsPendingCount.textContent = pending;

        badgeAllNav.textContent = total;
        badgeCompletedNav.textContent = completed;
        badgePendingNav.textContent = pending;
    };

    const renderTasks = () => {
        taskList.innerHTML = '';

        const filteredTasks = [];

        for (let task of tasks) { 
            if (currentFilter === 'completed') { 
                if (task.completed) { 
                    filteredTasks.push(task);
                }
            }
            else if (currentFilter === 'pending') {
                if (!task.completed) {
                    filteredTasks.push(task);
                }
            }
            else { 
                    filteredTasks.push(task);
            }
        }

        if (filteredTasks.length === 0) {
            emptyState.style.display = 'flex';
            dragDropFooter.style.display = 'none';
        }
        else {
            emptyState.style.display = 'none';
            dragDropFooter.style.display = 'flex';
        }

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.dataset.id = task.id;
            li.setAttribute('draggable', 'true');
            li.innerHTML = `
                <label class="checkbox-container">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="checkbox-checkmark">
                        <i class="fa-solid fa-check"></i>
                    </span>
                </label>
                <span class="task-text">${task.title}</span>
                <div class="task-actions">
                    <button class="action-btn edit-btn" aria-label="Edit Task">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="action-btn delete-btn" aria-label="Delete Task">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;

            taskList.appendChild(li);
        });

        initDragAndDrop();
    };

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();

        if (text === '') {
            validationMsg.classList.add('show');
            return;
        }

        validationMsg.classList.remove('show');

        const newTask = {
            id: Date.now().toString(),
            title: text,
            completed: false
        };

        tasks.push(newTask);
        saveToLocalStorage();
        updateStats();
        renderTasks();

        taskInput.value = '';
        taskInput.focus();
    });

    taskInput.addEventListener('input', () => {
        if (taskInput.value.trim() !== '') {
            validationMsg.classList.remove('show');
        }
    });

    taskList.addEventListener('click', (e) => {
        const itemEl = e.target.closest('.task-item');
        if (!itemEl) return;
        const taskId = itemEl.dataset.id;

        if (e.target.classList.contains('task-checkbox')) {
            let task;
            for (let t of tasks) { 
                if (t.id === taskId) {
                    task = t;
                    break;
                }
            }
            if (task) {
                task.completed = e.target.checked;
                saveToLocalStorage();
                updateStats();
                renderTasks();
            }
            return;
        }

        if (e.target.closest('.edit-btn')) {
            enableEditMode(itemEl, taskId);
            return;
        }

        if (e.target.closest('.delete-btn')) {
            openDeleteModal(taskId);
            return;
        }
    });

    const enableEditMode = (itemEl, taskId) => {
        
        if (itemEl.classList.contains('editing')) return;

        const textSpan = itemEl.querySelector('.task-text');
        const originalText = textSpan.textContent;
        const editBtn = itemEl.querySelector('.edit-btn');

        itemEl.classList.add('editing');

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'task-edit-input';
        input.value = originalText;
        input.maxLength = 150;
        itemEl.replaceChild(input, textSpan);
        input.focus();

        editBtn.className = 'action-btn save-btn';
        editBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';
        editBtn.setAttribute('aria-label', 'Save Task');

        const saveEdits = () => {
            const updatedText = input.value.trim();
            if (updatedText === '') {
                renderTasks();
                return;
            }

            let task;
            for (let t of tasks) { 
                if (t.id === taskId) {
                    task = t;
                    break;
                }
            }

            if (task) {
                task.title = updatedText;
                saveToLocalStorage();
            }
            renderTasks();
        };

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') saveEdits();
        });

        const clickSaveHandler = (e) => {
            if (e.target.closest('.save-btn')) {
                saveEdits();
                editBtn.removeEventListener('click', clickSaveHandler);
            }
        };
        editBtn.addEventListener('click', clickSaveHandler);

        input.addEventListener('blur', (e) => {
            setTimeout(() => {
                if (document.activeElement !== editBtn) {
                    saveEdits();
                }
            }, 100);
        });
    };

    const openDeleteModal = (id) => {
        taskToDeleteId = id;
        confirmModal.classList.add('active');
    };

    const closeDeleteModal = () => {
        taskToDeleteId = null;
        confirmModal.classList.remove('active');
    };

    modalCloseX.addEventListener('click', closeDeleteModal);
    modalCancelBtn.addEventListener('click', closeDeleteModal);

    modalConfirmBtn.addEventListener('click', () => {
        if (taskToDeleteId) {
            let newTasks = [];
            for (let t of tasks) { 
                if (t.id !== taskToDeleteId) {
                    newTasks.push(t);
                }
            }
            tasks = newTasks;
            saveToLocalStorage();
            updateStats();
            renderTasks();
            closeDeleteModal();
        }
    });

    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) closeDeleteModal();
    });

    const syncFilters = (filterValue) => {

        navItems.forEach(item => {
            if (item.dataset.filter === filterValue) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        filterPills.forEach(pill => {
            if (pill.dataset.filter === filterValue) {
                pill.classList.add('active');
            } else {
                pill.classList.remove('active');
            }
        });

        renderTasks();
        toggleSidebar(false);
    };

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            syncFilters(item.dataset.filter);
        });
    });

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            syncFilters(pill.dataset.filter);
        });
    });

    const initDragAndDrop = () => {
        const items = taskList.querySelectorAll('.task-item');

        items.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                if (item.classList.contains('editing')) {
                    e.preventDefault();
                    return;
                }
                item.classList.add('dragging');
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                saveNewOrder();
            });
        });
    };

    taskList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(taskList, e.clientY);
        const draggable = document.querySelector('.dragging');
        if (draggable) {
            if (afterElement == null) {
                taskList.appendChild(draggable);
            } else {
                taskList.insertBefore(draggable, afterElement);
            }
        }
    });

    const getDragAfterElement = (container, y) => {
        const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    };

    const saveNewOrder = () => {
        const taskElements = [...taskList.querySelectorAll('.task-item')];
        const reorderedIds = taskElements.map(el => el.dataset.id);
        const currentShownIds = new Set(reorderedIds);

        const visibleIndices = [];
        tasks.forEach((task, idx) => {
            if (currentShownIds.has(task.id)) {
                visibleIndices.push(idx);
            }
        });

        const updatedTasks = [...tasks];
        visibleIndices.forEach((originalIdx, index) => {
            const targetId = reorderedIds[index];
            updatedTasks[originalIdx] = tasks.find(t => t.id === targetId);
        });

        tasks = updatedTasks;
        saveToLocalStorage();
        updateStats();
    };

    displayDate();
    initTheme();
    updateStats();
    renderTasks();
});