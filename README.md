# TaskIt 📝

A sleek, responsive, and modern task management web application built with Vanilla JavaScript, HTML5, and CSS3. Plan your day, organize your workflow, and stay productive with an intuitive interface featuring dark mode, drag-and-drop reordering, dynamic statistics, and instant local storage persistence.

---

## ✨ Features

- **⚡ Full Task Lifecycle (CRUD)**
  - Add tasks with input validation and duplicate/empty-state checks.
  - Inline editing with real-time save on blur or <kbd>Enter</kbd>.
  - Mark tasks complete with custom animated checkboxes and strikethrough styling.
  - Delete individual tasks with an accessible confirmation modal.
  - One-click **Clear Completed** bulk cleanup.

- **🔄 Drag-and-Drop Reordering**
  - Native HTML5 Drag and Drop support to intuitively prioritize and reorder tasks.
  - Seamless position updates that persist directly to local storage.

- **🌓 Dark Mode & Custom Theming**
  - Instant toggle between Light and Dark themes.
  - Smooth transitions powered by CSS Custom Properties (Variables).
  - Theme preference automatically saved across browser sessions.

- **📊 Real-time Stats & Dynamic Badges**
  - Dashboard counter cards displaying **Total**, **Completed**, and **Pending** counts.
  - Live count badges dynamically synchronized across the sidebar navigation.

- **🔍 Dual Filtering System**
  - Filter by **All**, **Completed**, or **Pending** tasks.
  - Synchronized controls across both sidebar navigation links and quick-access filter pills.

- **📱 Responsive & Mobile-First Design**
  - Collapsible off-canvas sidebar with backdrop blur overlay on smaller screens.
  - Touch-friendly tap targets, custom scrollbars, and modern typography using [Inter](https://fonts.google.com/specimen/Inter) and [Outfit](https://fonts.google.com/specimen/Outfit).

- **💾 Zero-Config Local Persistence**
  - Automatically stores tasks and user settings in browser `localStorage`.
  - No external database or backend server required.

- **📅 Live Date Widget**
  - Header widget displaying today's formatted day and date.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic structure, accessibility elements, and modal dialogs |
| **CSS3** | Modern design system, HSL color tokens, dark mode, glassmorphism, responsive flex/grid |
| **JavaScript (ES6+)** | DOM manipulation, state management, HTML5 Drag & Drop API, and `localStorage` integration |
| **Font Awesome 6** | Modern UI iconography |
| **Google Fonts** | `Inter` (body copy) & `Outfit` (headings & brand typography) |

---

## 📁 Project Structure

```plaintext
TaskIt-main/
├── index.html       # Semantic HTML layout, navigation, modals, and templates
├── style.css        # CSS design system, variables, animations, and responsive breakpoints
├── script.js        # Core logic: task state, event listeners, drag-and-drop, and storage
└── README.md        # Project documentation
```

---

## 🚀 Getting Started

No build tools, bundlers, or package installations are required!

### Option 1: Direct File Launch
Double-click [`index.html`](index.html) or open it directly in any modern web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local Development Server
For the best experience (e.g. using hot reloading):

- **VS Code Live Server**: Right-click [`index.html`](index.html) and select **Open with Live Server**.
- **Python HTTP Server**:
  ```bash
  # Python 3
  python -m http.server 3000
  ```
  Then open `http://localhost:3000` in your browser.
- **Node.js (npx serve)**:
  ```bash
  npx serve .
  ```

---

## 💡 How to Use

1. **Add a Task**: Type your task into the input bar and click **Add Task** or press <kbd>Enter</kbd>.
2. **Complete a Task**: Click the circular checkbox beside any task item.
3. **Edit a Task**: Click the pencil (<i class="fa-solid fa-pen-to-square"></i>) icon. Modify the text and press <kbd>Enter</kbd> or click the save disk icon.
4. **Reorder Tasks**: Click and drag any task item up or down to set its custom priority order.
5. **Delete a Task**: Click the trash (<i class="fa-solid fa-trash-can"></i>) icon and confirm the deletion in the modal dialog.
6. **Filter Tasks**: Switch views using the sidebar tabs or the filter pills (**All**, **Completed**, **Pending**).
7. **Toggle Dark Mode**: Use the switch located at the bottom of the sidebar to toggle between dark and light themes.

---

## 🎨 Customization

Colors and theme styles are defined as CSS custom variables inside [`style.css`](style.css):

```css
:root {
    --primary: hsl(255, 65%, 60%);
    --bg-body: hsl(220, 20%, 97%);
    --bg-card: hsl(0, 0%, 100%);
    --bg-sidebar: hsl(244, 45%, 15%);
    --radius-md: 12px;
    /* ... */
}
```
You can modify `--primary` to customize the accent color scheme throughout the entire application.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
