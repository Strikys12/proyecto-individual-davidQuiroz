const taskManager = new TaskManager();

const newTaskForm = document.querySelector('#formularioTarea');
const tituloTarea = document.querySelector('#titulo-tarea');
const descripcionTarea = document.querySelector('#descripcion-tarea');
const fechaEntrega = document.querySelector('#fecha-entrega');
const prioridadTarea = document.querySelector('#prioridad');
const tasksList = document.querySelector('#taskList');

let currentFilter = 'TODAS';

newTaskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: tituloTarea.value.trim(),
        description: descripcionTarea.value.trim(),
        dueDate: fechaEntrega.value,
        prioridad: prioridadTarea.value
    };

    const validarFormulario = validFormFieldInput(formData);

    if (validarFormulario.length > 0) {
        Swal.fire({
            icon: 'error',
            title: 'Formulario incompleto',
            html: `Te falta completar los siguientes campos: <br><br><b>${validarFormulario.join(', ')}</b>`,
            confirmButtonText: 'Aceptar'
        });
    } else {
        await taskManager.addTask(
            formData.name,
            formData.description,
            formData.dueDate,
            formData.prioridad,
            'PORHACER'
        );

        currentFilter = 'TODAS';
        taskManager.render(currentFilter);

        Swal.fire({
            icon: 'success',
            title: 'Tarea agregada',
            text: 'La tarea se ha guardado en la base de datos.',
            confirmButtonText: 'Aceptar'
        });

        newTaskForm.reset();
    }
});

function validFormFieldInput(data) {
    const datosFaltantes = [];

    if (!data.name) datosFaltantes.push('título');
    if (!data.description) datosFaltantes.push('descripción');
    if (!data.dueDate) datosFaltantes.push('fecha de entrega');
    if (!data.prioridad) datosFaltantes.push('prioridad');

    return datosFaltantes;
}

document.addEventListener('DOMContentLoaded', async () => {
    await taskManager.fetchTasks();
    taskManager.render(currentFilter);

    document.addEventListener('click', (e) => {
        const text = e.target.textContent.trim().toUpperCase();
        if (text === 'TODAS') {
            e.preventDefault();
            currentFilter = 'TODAS';
            taskManager.render('TODAS');
        } else if (text === 'COMPLETADAS') {
            e.preventDefault();
            currentFilter = 'Completadas';
            taskManager.render('Completadas');
        }
    });
});

if (tasksList) {
    tasksList.addEventListener('click', async (event) => {
        if (event.target.classList.contains('done-button')) {
            const parentTask = event.target.closest('.list-group-item');
            if (parentTask) {
                const taskId = Number(parentTask.dataset.taskId);
                const task = taskManager.getTaskById(taskId);
                if (task) {
                    const newStatus = (task.status === 'Terminada' || task.status === 'DONE' || task.status === 'Completada') ? 'PORHACER' : 'Terminada';
                    const updatedData = { ...task, status: newStatus };
                    await taskManager.updateTask(taskId, updatedData);
                    taskManager.render(currentFilter);
                }
            }
        }

        if (event.target.classList.contains('edit-button')) {
            const parentTask = event.target.closest('.list-group-item');
            if (parentTask) {
                const taskId = Number(parentTask.dataset.taskId);
                const task = taskManager.getTaskById(taskId);
                if (task) {
                    const { value: formValues } = await Swal.fire({
                        title: 'Editar Tarea',
                        html: `
                            <div class="text-start mb-3">
                                <label for="swal-input-name" class="form-label fw-bold text-secondary small">Título de la tarea</label>
                                <input id="swal-input-name" class="form-control" value="${task.name}">
                            </div>
                            <div class="text-start mb-3">
                                <label for="swal-input-desc" class="form-label fw-bold text-secondary small">Descripción</label>
                                <textarea id="swal-input-desc" class="form-control" rows="3">${task.description}</textarea>
                            </div>
                            <div class="text-start mb-3">
                                <label for="swal-input-date" class="form-label fw-bold text-secondary small">Fecha de entrega</label>
                                <input id="swal-input-date" type="date" class="form-control" value="${task.dueDate}">
                            </div>
                            <div class="text-start mb-2">
                                <label for="swal-input-prio" class="form-label fw-bold text-secondary small">Prioridad</label>
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
                        confirmButtonColor: '#0d6efd',
                        customClass: {
                            confirmButton: 'btn btn-primary px-4 me-2',
                            cancelButton: 'btn btn-secondary px-4'
                        },
                        buttonsStyling: false,
                        preConfirm: () => {
                            const name = document.getElementById('swal-input-name').value.trim();
                            const desc = document.getElementById('swal-input-desc').value.trim();
                            const date = document.getElementById('swal-input-date').value;
                            const prio = document.getElementById('swal-input-prio').value;

                            if (!name || !desc || !date) {
                                Swal.showValidationMessage('Por favor completa todos los campos');
                                return false;
                            }

                            return { name, description: desc, dueDate: date, prioridad: prio };
                        }
                    });

                    if (formValues) {
                        const updatedData = { ...task, ...formValues };
                        await taskManager.updateTask(taskId, updatedData);
                        taskManager.render(currentFilter);
                    }
                }
            }
        }

        if (event.target.classList.contains('delete-button')) {
            const parentTask = event.target.closest('.list-group-item');
            if (parentTask) {
                const taskId = Number(parentTask.dataset.taskId);
                await taskManager.deleteTask(taskId);
                taskManager.render(currentFilter);
            }
        }
    });
}