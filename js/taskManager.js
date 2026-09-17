class TaskManager {
    constructor() {
        this.tasks = [];
        this.loadFromLocalStorage();
    }

    loadFromLocalStorage() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            this.tasks = JSON.parse(storedTasks);
        } else {
            this.tasks = [
                { id: 1, name: 'Estudiar JavaScript', description: 'Repasar funciones flecha y DOM.', dueDate: '2026-08-15', prioridad: 'Alta', status: 'PORHACER' },
                { id: 2, name: 'Diseñar maquetas en Figma', description: 'Prototipos de interfaz móvil y escritorio.', dueDate: '2026-08-18', prioridad: 'Media', status: 'ENPROGRESO' },
                { id: 3, name: 'Instalar entorno', description: 'Configurar Node.js y Git.', dueDate: '2026-08-10', prioridad: 'Baja', status: 'COMPLETADA' }
            ];
            this.saveToLocalStorage();
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    addTask(name, description, dueDate, prioridad, status = 'PORHACER') {
        const newTask = {
            id: Date.now(),
            name,
            description,
            dueDate,
            prioridad,
            status
        };
        this.tasks.push(newTask);
        this.saveToLocalStorage();
    }

    updateTask(id, updatedData) {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            this.tasks[index] = { ...this.tasks[index], ...updatedData };
            this.saveToLocalStorage();
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveToLocalStorage();
    }

    getTaskById(taskId) {
        return this.tasks.find(task => task.id === taskId);
    }

    createTaskHtml(task) {
        let borderColor = 'border-warning';
        if (task.prioridad === 'Alta') borderColor = 'border-danger';
        if (task.prioridad === 'Media') borderColor = 'border-info';
        if (task.prioridad === 'Baja') borderColor = 'border-success';

        const isDone = task.status === 'COMPLETADA';

        // Clases separadas para los badges de estado
        let badgeClass = 'badge-porhacer';
        let statusLabel = 'POR HACER';
        if (task.status === 'ENPROGRESO') {
            badgeClass = 'badge-enprogreso';
            statusLabel = 'EN PROGRESO';
        } else if (task.status === 'COMPLETADA') {
            badgeClass = 'badge-completada';
            statusLabel = 'COMPLETADA';
        }

        return `
            <div class="list-group-item rounded shadow-sm border-start ${borderColor} border-4 p-3 ${isDone ? 'completed-task' : ''}" data-task-id="${task.id}">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h5 class="mb-0 fw-bold h6 text-dark">${task.name}</h5>
                    <span class="badge ${badgeClass}">${statusLabel}</span>
                </div>
                <p class="mb-2 text-secondary small">
                    ${task.description}
                </p>
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <small class="text-muted"><strong>Fecha:</strong> ${task.dueDate}</small>
                    <span class="badge ${task.prioridad === 'Alta' ? 'bg-danger' : task.prioridad === 'Media' ? 'bg-secondary' : 'bg-success'}">${task.prioridad}</span>
                </div>
                <div class="d-flex justify-content-between gap-1 pt-2 border-top">
                    <select class="form-select form-select-sm status-select" style="font-size: 0.75rem;">
                        <option value="PORHACER" ${task.status === 'PORHACER' ? 'selected' : ''}>Por Hacer</option>
                        <option value="ENPROGRESO" ${task.status === 'ENPROGRESO' ? 'selected' : ''}>En Progreso</option>
                        <option value="COMPLETADA" ${task.status === 'COMPLETADA' ? 'selected' : ''}>Completada</option>
                    </select>
                    <button class="edit-button btn btn-outline-primary btn-sm px-2 py-0" title="Editar">✏️</button>
                    <button class="delete-button btn btn-outline-danger btn-sm px-2 py-0" title="Eliminar">🗑️</button>
                </div>
            </div>
        `;
    }

    render(filterText = '', statusFilter = 'TODAS') {
        const containerPorHacer = document.querySelector('#taskList-porHacer');
        const containerEnProgreso = document.querySelector('#taskList-enProgreso');
        const containerCompletadas = document.querySelector('#taskList-completadas');

        if (!containerPorHacer || !containerEnProgreso || !containerCompletadas) return;

        containerPorHacer.innerHTML = '';
        containerEnProgreso.innerHTML = '';
        containerCompletadas.innerHTML = '';

        this.tasks.forEach(task => {
            if (filterText && !task.name.toLowerCase().includes(filterText.toLowerCase()) && !task.description.toLowerCase().includes(filterText.toLowerCase())) {
                return;
            }

            if (statusFilter === 'Completadas' && task.status !== 'COMPLETADA') {
                return;
            }

            const html = this.createTaskHtml(task);

            if (task.status === 'PORHACER') {
                containerPorHacer.innerHTML += html;
            } else if (task.status === 'ENPROGRESO') {
                containerEnProgreso.innerHTML += html;
            } else if (task.status === 'COMPLETADA') {
                containerCompletadas.innerHTML += html;
            }
        });
    }
}