class TaskManager {
    constructor(currentId = 0) {
        this.tasks = [];
        this.currentId = currentId;
    }

    addTask(name, description, dueDate, prioridad, status = 'PORHACER') {
        this.currentId++;
        this.tasks.push({
            id: this.currentId,
            name: name,
            description: description,
            dueDate: dueDate,
            prioridad: prioridad,
            status: status
        });
    }

    deleteTask(taskId) {
        const newTasks = [];
        for (let task of this.tasks) {
            if (task.id !== taskId) {
                newTasks.push(task);
            }
        }
        this.tasks = newTasks;
    }

    getTaskById(taskId) {
        let foundTask;
        for (let task of this.tasks) {
            if (task.id === taskId) {
                foundTask = task;
            }
        }
        return foundTask;
    }

    createTaskHtml(id, name, description, dueDate, prioridad, status) {
        let borderColor = 'border-warning';
        if (prioridad === 'Alta') borderColor = 'border-danger';
        if (prioridad === 'Media') borderColor = 'border-info';
        if (prioridad === 'Baja') borderColor = 'border-success';

        const isDone = status === 'DONE' || status === 'Completada';

        return `
            <div class="list-group-item list-group-item-action rounded shadow-sm border-start ${borderColor} border-4 p-3 mb-3 ${isDone ? 'completed-task' : ''}" data-task-id="${id}">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h5 class="mb-0 fw-bold h6">${name}</h5>
                    <span class="badge ${isDone ? 'bg-success' : 'bg-warning text-dark'} status-badge">${isDone ? 'DONE' : 'Pendiente'}</span>
                </div>
                <p class="mb-2 text-secondary small">
                    ${description}
                </p>
                <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted"><strong>Fecha:</strong> ${dueDate}</small>
                    <span class="badge ${prioridad === 'Alta' ? 'bg-danger' : prioridad === 'Media' ? 'bg-secondary' : 'bg-success'}">${prioridad}</span>
                   
                    <button class="done-button btn ${isDone ? 'btn-secondary' : 'btn-success'} btn-sm">
                        ${isDone ? 'Completado' : 'Mark As Done'}
                    </button>

                    <button class="delete-button btn btn-outline-danger btn-sm">
                        Eliminar
                    </button>
                </div>
            </div>
        `;
    }

    save() {
        const tasksJson = JSON.stringify(this.tasks);
        localStorage.setItem('tasks', tasksJson);
        const currentId = String(this.currentId);
        localStorage.setItem('currentId', currentId);
    }

    load() {
        if (localStorage.getItem('tasks')) {
            const tasksJson = localStorage.getItem('tasks');
            this.tasks = JSON.parse(tasksJson);
        }
        if (localStorage.getItem('currentId')) {
            const currentId = localStorage.getItem('currentId');
            this.currentId = Number(currentId);
        }
    }

    render() {
        const tasksHtmlList = [];

        for (let i = 0; i < this.tasks.length; i++) {
            const task = this.tasks[i];
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

        const tasksHtml = tasksHtmlList.join('\n');
        const tasksList = document.querySelector('#taskList');
        if (tasksList) {
            tasksList.innerHTML = tasksHtml;
        }
    }
}