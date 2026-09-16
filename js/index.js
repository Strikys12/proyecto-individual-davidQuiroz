const taskManager = new TaskManager();

const newTaskForm = document.querySelector('#formularioTarea');
const tituloTarea = document.querySelector('#titulo-tarea');
const descripcionTarea = document.querySelector('#descripcion-tarea');
const fechaEntrega = document.querySelector('#fecha-entrega');
const prioridadTarea = document.querySelector('#prioridad');
const tasksList = document.querySelector('#taskList');

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
            formData.prioridad,
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
});

if (tasksList) {
    tasksList.addEventListener('click', (event) => {
        if (event.target.classList.contains('done-button')) {
            const parentTask = event.target.closest('.list-group-item');

            if (parentTask) {
                const taskId = Number(parentTask.dataset.taskId);
                const task = taskManager.getTaskById(taskId);

                if (task) {
                    task.status = 'DONE';
                    taskManager.save();
                    taskManager.render();
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
}