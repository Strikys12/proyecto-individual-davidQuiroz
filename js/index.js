const taskManager = new TaskManager();




const formularioTarea = document.getElementById('formularioTarea');
const tituloTarea = document.getElementById('titulo-tarea');
const descripcionTarea = document.getElementById('descripcion-tarea');
const fechaEntrega = document.getElementById('fecha-entrega');
const prioridadTarea = document.getElementById('prioridad');

formularioTarea.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
        titulo: tituloTarea.value.trim(),
        descripcion: descripcionTarea.value.trim(),
        fechaEntrega: fechaEntrega.value,
        prioridad: prioridadTarea.value

    }

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
            formData.titulo,
            formData.descripcion,
            formData.fechaEntrega,
            'PORHACER'
        );

        Swal.fire({
            icon: 'success',
            title: 'Tarea agregada',
            text: 'La tarea se ha agregado correctamente.',
            confirmButtonText: 'Aceptar'
        })
        formularioTarea.reset();

        console.log(taskManager.tasks);
    }

})

function validFormFieldInput(data) {
    const datosFaltantes = []

    if (!data.titulo) datosFaltantes.push('titulo');
    if (!data.descripcion) datosFaltantes.push('descripcion');
    if (!data.fechaEntrega) datosFaltantes.push('fecha de entrega');
    if (!data.prioridad) datosFaltantes.push('prioridad');

    return datosFaltantes;
};

document.addEventListener('DOMContentLoaded', () => {
    const botonCompletar = document.querySelectorAll('.boton-completar');

    botonCompletar.forEach((button) => {
        button.addEventListener('click', (event) => {
            const item = event.target.closest('.list-group-item');
            const badge = item.querySelector('.status-badge');


            item.classList.toggle('completed-task');

            if (item.classList.contains('completed-task')) {
                button.textContent = 'Desmarcar';
                button.classList.replace('btn-outline-success', 'btn-secondary');
                if (badge) {
                    badge.textContent = 'Completada';
                    badge.className = 'badge bg-success status-badge';
                }
            } else {
                button.textContent = 'Completar';
                button.classList.replace('btn-secondary', 'btn-outline-success');
                if (badge) {
                    badge.textContent = 'Pendiente';
                    badge.className = 'badge bg-warning text-dark status-badge';
                }
            }
        });
    });
});
