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

    if (validarFormulario) {
        console.log("Formulario enviado correctamente:", formData);
        formularioTarea.reset();


    } else {
        console.log("Por favor, complete todos los campos del formulario.");
    }
})



function validFormFieldInput(data) {
    const titulo = data.titulo !== '';
    const descripcion = data.descripcion !== '';
    const fechaEntrega = data.fechaEntrega !== '';
    const prioridad = data.prioridad !== '';

    return titulo && descripcion && fechaEntrega && prioridad;
}