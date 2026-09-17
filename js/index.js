const taskManager = new TaskManager();

const newTaskForm = document.querySelector('#formularioTarea');
const tituloTarea = document.querySelector('#titulo-tarea');
const descripcionTarea = document.querySelector('#descripcion-tarea');
const fechaEntrega = document.querySelector('#fecha-entrega');
const prioridadTarea = document.querySelector('#prioridad');
const searchInput = document.querySelector('#searchInput');
const searchBtn = document.querySelector('#searchBtn');

let currentStatusFilter = 'TODAS';

// Inicializar vista al cargar la página con efecto de loading
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.querySelector('#loading-screen');

    // Renderizamos las tareas
    taskManager.render('', currentStatusFilter);

    // Ocultamos la pantalla de carga suavemente después de medio segundo
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.remove();
            }, 400); // Tiempo de la transición CSS
        }, 500);
    }
});

// Manejador del formulario para crear tarea
newTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = tituloTarea.value.trim();
    const description = descripcionTarea.value.trim();
    const dueDate = fechaEntrega.value;
    const prioridad = prioridadTarea.value;

    if (!name || !description || !dueDate) {
        Swal.fire({
            icon: 'error',
            title: 'Campos incompletos',
            text: 'Por favor llena todos los campos del formulario.',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    taskManager.addTask(name, description, dueDate, prioridad, 'PORHACER');
    taskManager.render(searchInput.value, currentStatusFilter);

    Swal.fire({
        icon: 'success',
        title: '¡Tarea agregada!',
        text: 'Se ha guardado exitosamente en el LocalStorage.',
        timer: 1500,
        showConfirmButton: false
    });

    newTaskForm.reset();
});

// Botones de filtro superior (TODAS / Completadas)
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('btn-dark', 'active');
            b.classList.add('btn-outline-dark');
        });
        e.target.classList.remove('btn-outline-dark');
        e.target.classList.add('btn-dark', 'active');

        currentStatusFilter = e.target.getAttribute('data-filter');
        taskManager.render(searchInput.value, currentStatusFilter);
    });
});

// Botón de búsqueda / Filtrar por texto
searchBtn.addEventListener('click', () => {
    taskManager.render(searchInput.value, currentStatusFilter);
});

searchInput.addEventListener('keyup', () => {
    taskManager.render(searchInput.value, currentStatusFilter);
});

// Delegación de eventos para las tarjetas (Cambiar estado, Editar, Eliminar)
document.addEventListener('change', (e) => {
    if (e.target.classList.contains('status-select')) {
        const parentTask = e.target.closest('.list-group-item');
        const taskId = Number(parentTask.dataset.taskId);
        const newStatus = e.target.value;

        taskManager.updateTask(taskId, { status: newStatus });
        taskManager.render(searchInput.value, currentStatusFilter);
    }
});

document.addEventListener('click', async (e) => {
    // Eliminar tarea
    if (e.target.classList.contains('delete-button')) {
        const parentTask = e.target.closest('.list-group-item');
        const taskId = Number(parentTask.dataset.taskId);

        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            taskManager.deleteTask(taskId);
            taskManager.render(searchInput.value, currentStatusFilter);
            Swal.fire('¡Eliminado!', 'La tarea ha sido borrada.', 'success');
        }
    }

    // Editar tarea
    if (e.target.classList.contains('edit-button')) {
        const parentTask = e.target.closest('.list-group-item');
        const taskId = Number(parentTask.dataset.taskId);
        const task = taskManager.getTaskById(taskId);

        if (task) {
            const { value: formValues } = await Swal.fire({
                title: 'Editar Tarea',
                html: `
                    <div class="text-start mb-3">
                        <label class="form-label fw-bold small">Título</label>
                        <input id="swal-input-name" class="form-control" value="${task.name}">
                    </div>
                    <div class="text-start mb-3">
                        <label class="form-label fw-bold small">Descripción</label>
                        <textarea id="swal-input-desc" class="form-control" rows="3">${task.description}</textarea>
                    </div>
                    <div class="text-start mb-3">
                        <label class="form-label fw-bold small">Fecha de entrega</label>
                        <input id="swal-input-date" type="date" class="form-control" value="${task.dueDate}">
                    </div>
                    <div class="text-start mb-2">
                        <label class="form-label fw-bold small">Prioridad</label>
                        <select id="swal-input-prio" class="form-select">
                            <option value="Alta" ${task.prioridad === 'Alta' ? 'selected' : ''}>Alta</option>
                            <option value="Media" ${task.prioridad === 'Media' ? 'selected' : ''}>Media</option>
                            <option value="Baja" ${task.prioridad === 'Baja' ? 'selected' : ''}>Baja</option>
                        </select>
                    </div>
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Guardar cambios',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    const name = document.getElementById('swal-input-name').value.trim();
                    const description = document.getElementById('swal-input-desc').value.trim();
                    const dueDate = document.getElementById('swal-input-date').value;
                    const prioridad = document.getElementById('swal-input-prio').value;

                    if (!name || !description || !dueDate) {
                        Swal.showValidationMessage('Por favor completa todos los campos');
                        return false;
                    }
                    return { name, description, dueDate, prioridad };
                }
            });

            if (formValues) {
                taskManager.updateTask(taskId, formValues);
                taskManager.render(searchInput.value, currentStatusFilter);
                Swal.fire('¡Actualizado!', 'Los cambios se guardaron correctamente.', 'success');
            }
        }
    }
});