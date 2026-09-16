const taskManager = new TaskManager();

const newTaskForm = document.querySelector('#formularioTarea');
const tituloTarea = document.querySelector('#titulo-tarea');
const descripcionTarea = document.querySelector('#descripcion-tarea');
const fechaEntrega = document.querySelector('#fecha-entrega');
const prioridadTarea = document.querySelector('#prioridad');

newTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
        name: tituloTarea.value.trim(),
        description: descripcionTarea.value.trim(),
        dueDate: fechaEntrega.value,
        prioridad: prioridadTarea.value
    };

    const validarFormulario = validFormFieldInput(formData);
    const totalCampos = Object.keys(formData).length;

    if (validarFormulario.length === totalCampos) {
        Swal.fire({
            icon: 'error',
            title: 'Formulario incompleto',
            text: 'Por favor, complete todos los campos del formulario.',
            confirmButtonText: 'Aceptar'
        });

    } else if (validarFormulario.length > 0) {
        Swal.fire({
            icon: 'error',
            title: 'Formulario incompleto',
            html: `Te falta completar los siguientes campos: <br><br><b>${validarFormulario.join(', ')}</b>`,
            confirmButtonText: 'Aceptar'
        });
    } else {
        taskManager.addTask(
            formData.name,
            formData.description,
            formData.dueDate,
            'PORHACER'
        );

        taskManager.save();
        taskManager.render();

        Swal.fire({
            icon: 'success',
            title: 'Tarea agregada',
            text: 'La tarea se ha agregado correctamente.',
            confirmButtonText: 'Aceptar'
        });

        newTaskForm.reset();

        console.log(taskManager.tasks);
    }
});

function validFormFieldInput(data) {
    const datosFaltantes = [];

    if (!data.name) datosFaltantes.push('titulo');
    if (!data.description) datosFaltantes.push('descripcion');
    if (!data.dueDate) datosFaltantes.push('fecha de entrega');
    if (!data.prioridad) datosFaltantes.push('prioridad');

    return datosFaltantes;
}

document.addEventListener('DOMContentLoaded', () => {
    taskManager.load();
    taskManager.render();

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('boton-completar')) {
            const item = event.target.closest('.list-group-item');
            const badge = item.querySelector('.status-badge');

            item.classList.toggle('completed-task');

            if (item.classList.contains('completed-task')) {
                event.target.textContent = 'Desmarcar';
                event.target.classList.replace('btn-outline-success', 'btn-secondary');
                if (badge) {
                    badge.textContent = 'Completada';
                    badge.className = 'badge bg-success status-badge';
                }
            } else {
                event.target.textContent = 'Completar';
                event.target.classList.replace('btn-secondary', 'btn-outline-success');
                if (badge) {
                    badge.textContent = 'Pendiente';
                    badge.className = 'badge bg-warning text-dark status-badge';
                }
            }
        }

        if (event.target.classList.contains('delete-button')) {
            const parentTask = event.target.closest('.list-group-item');

            if (parentTask) {
                const taskId = Number(parentTask.dataset.taskId);
                taskManager.deleteTask(taskId);
                taskManager.save();
                taskManager.render();
            }
        }
    });
});