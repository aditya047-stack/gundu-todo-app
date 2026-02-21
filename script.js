class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.initializeElements();
        this.bindEvents();
        this.render();
    }

    initializeElements() {
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.totalTodos = document.getElementById('totalTodos');
        this.completedTodos = document.getElementById('completedTodos');
    }

    bindEvents() {
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        if (text === '') return;

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.push(todo);
        this.saveToLocalStorage();
        this.render();
        this.todoInput.value = '';
        this.todoInput.focus();
    }

    toggleTodo(id) {
        this.todos = this.todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        this.saveToLocalStorage();
        this.render();
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveToLocalStorage();
        this.render();
    }

    saveToLocalStorage() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    render() {
        this.todoList.innerHTML = '';
        
        this.todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <button class="delete-btn">Delete</button>
            `;

            const checkbox = li.querySelector('input[type="checkbox"]');
            const deleteBtn = li.querySelector('.delete-btn');

            checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
            deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

            this.todoList.appendChild(li);
        });

        this.updateStats();
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;
        
        this.totalTodos.textContent = `Total: ${total}`;
        this.completedTodos.textContent = `Completed: ${completed}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});