class TaskManager {
    constructor() {
        this.tasks = [];
        this.apiUrl = 'http://localhost:8080/api/tasks';
    }

    async fetchTasks() {
        try {
            const response = await fetch(this.apiUrl);
            if (response.ok) {
                this.tasks = await response.json();
            }
        } catch (error) {
            console.error('Error al obtener las tareas:', error);
        }
    }

    async addTask(name, description, dueDate, prioridad, status = 'PORHACER') {
        const newTask = { name, description, dueDate, prioridad, status };
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask)
            });
            if (response.ok) {
                const createdTask = await response.json();
                this.tasks.push(createdTask);
            }
        } catch (error) {
            console.error('Error al guardar la tarea:', error);
        }
    }

    async updateTask(id, updatedData) {
        try {
            const response = await fetch(`${this.apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            if (response.ok) {
                const updatedTask = await response.json();
                const index = this.tasks.findIndex(t => t.id === id);
                if (index !== -1) {
                    this.tasks[index] = updatedTask;
                }
            }
        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
        }
    }

    async deleteTask(taskId) {
        try {
            const response = await fetch(`${this.apiUrl}/${taskId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                this.tasks = this.tasks.filter(task => task.id !== taskId);
            }
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
        }
    }

    getTaskById(taskId) {
        return this.tasks.find(task => task.id === taskId);
    }

    createTaskHtml(id, name, description, dueDate, prioridad, status) {
        let borderColor = 'border-warning';
        if (prioridad === 'Alta') borderColor = 'border-danger';
        if (prioridad === 'Media') borderColor = 'border-info';
        if (prioridad === 'Baja') borderColor = 'border-success';

        const isDone = status === 'DONE' || status === 'Completada' || status === 'Terminada';

        return `
            <div class="list-group-item list-group-item-action rounded shadow-sm border-start ${borderColor} border-4 p-3 mb-3 ${isDone ? 'completed-task' : ''}" data-task-id="${id}">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h5 class="mb-0 fw-bold h6">${name}</h5>
                    <span class="badge ${isDone ? 'bg-success' : 'bg-warning text-dark'} status-badge">${isDone ? 'Terminada' : 'Pendiente'}</span>
                </div>
                <p class="mb-2 text-secondary small">
                    ${description}
                </p>
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div class="d-flex align-items-center gap-2">
                        <small class="text-muted"><strong>Fecha:</strong> ${dueDate}</small>
                        <span class="badge ${prioridad === 'Alta' ? 'bg-danger' : prioridad === 'Media' ? 'bg-secondary' : 'bg-success'}">${prioridad}</span>
                    </div>
                   
                    <div class="d-flex gap-2">
                        <button class="done-button btn ${isDone ? 'btn-secondary' : 'btn-success'} btn-sm rounded">
                            ${isDone ? 'Terminada' : 'Completar'}
                        </button>
                        <button class="edit-button btn btn-outline-primary btn-sm rounded">
                            Editar
                        </button>
                        <button class="delete-button btn btn-outline-danger btn-sm rounded">
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    render(filterStatus = 'TODAS') {
        const tasksHtmlList = [];

        for (let i = 0; i < this.tasks.length; i++) {
            const task = this.tasks[i];
            const isDone = task.status === 'DONE' || task.status === 'Completada' || task.status === 'Terminada';

            if (filterStatus === 'Completadas' && !isDone) {
                continue;
            }

            const taskHtml = this.createTaskHtml(
                task.id,
                task.name,
                task.description,
                task.dueDate,
                task.prioridad,
                task.status
            );
            tasksHtmlList.push(taskHtml);
        }

        const tasksList = document.querySelector('#taskList');
        if (tasksList) {
            tasksList.innerHTML = tasksHtmlList.join('\n');
        }
    }
}