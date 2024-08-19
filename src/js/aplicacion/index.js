import { Dropdown } from "bootstrap";
import { Toast, validarFormulario } from "../funciones";
import Swal from "sweetalert2";

const formulario = document.getElementById('formAplicacion')
const tabla = document.getElementById('tablaAplicaciones')
const btnGuardar = document.getElementById('btnGuardar')
const btnModificar = document.getElementById('btnModificar')
const btnCancelar = document.getElementById('btnCancelar')
const btnBuscar = document.getElementById('btnBuscar')
const aplicacionesContainer = document.getElementById('aplicacionesContainer')

btnModificar.parentElement.style.display = 'none'
btnModificar.disabled = true
btnCancelar.parentElement.style.display = 'none'
btnCancelar.disabled = true
aplicacionesContainer.style.display = 'none';

const guardar = async (e) => {
    e.preventDefault()

    if (!validarFormulario(formulario, ['app_id'])) {
        Swal.fire({
            title: "Campos vacíos",
            text: "Debe llenar todos los campos",
            icon: "warning"
        })
        return
    }

    try {
        const body = new FormData(formulario)
        const url = "/tienda/API/aplicacion/guardar"
        const config = {
            method: 'POST',
            body
        }

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();
        console.log(data)
        const { codigo, mensaje, detalle } = data;

        if (codigo == 1) {
            Swal.fire({
                title: "Guardado",
                text: "Aplicación guardada exitosamente!",
                icon: "success"
            })

            formulario.reset();
            buscar();
        } else {
            Swal.fire({
                title: "Error!",
                text: "La Aplicación no se pudo guardar",
                icon: "error"
            })
            console.log(detalle);
        }

        Toast.fire({
            icon: icon,
            title: mensaje
        })

    } catch (error) {
        console.log(error);
    }
}

const buscar = async () => {
    try {
        const url = "/tienda/API/aplicacion/buscar"
        const config = {
            method: 'GET',
        }

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();
        const { codigo, mensaje, detalle, datos } = data;
        tabla.tBodies[0].innerHTML = ''
        const fragment = document.createDocumentFragment();
        console.log(datos);
        if (codigo == 1) {
            let counter = 1;
            datos.forEach(aplicacion => {
                const tr = document.createElement('tr');
                const td1 = document.createElement('td');
                const td2 = document.createElement('td');
                const td3 = document.createElement('td');
                const td4 = document.createElement('td');
                const buttonModificar = document.createElement('button');
                const buttonEliminar = document.createElement('button');
                td1.innerText = counter
                td2.innerText = aplicacion.app_nombre

                buttonModificar.classList.add('btn', 'btn-warning')
                buttonEliminar.classList.add('btn', 'btn-danger')
                buttonModificar.innerHTML = '<i class="bi bi-pencil-square"></i>';
                buttonEliminar.innerHTML = '<i class="bi bi-trash-fill"></i>';

                buttonModificar.addEventListener('click', () => traerDatos(aplicacion))
                buttonEliminar.addEventListener('click', () => eliminar(aplicacion))

                td3.appendChild(buttonModificar)
                td4.appendChild(buttonEliminar)

                counter++

                tr.appendChild(td1)
                tr.appendChild(td2)
                tr.appendChild(td3)
                tr.appendChild(td4)
                fragment.appendChild(tr)
            })
        } else {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.innerText = "No hay Aplicaciones"
            td.colSpan = 4

            tr.appendChild(td)
            fragment.appendChild(tr)
        }

        tabla.tBodies[0].appendChild(fragment)

    } catch (error) {
        console.log(error);
    }
}

const traerDatos = (aplicacion) => {
    console.log(aplicacion);
    formulario.app_id.value = aplicacion.app_id
    formulario.app_nombre.value = aplicacion.app_nombre
    aplicacionesContainer.style.display = 'none';

    btnGuardar.parentElement.style.display = 'none'
    btnGuardar.disabled = true
    btnBuscar.parentElement.style.display = 'none'
    btnBuscar.disabled = true
    btnModificar.parentElement.style.display = ''
    btnModificar.disabled = false
    btnCancelar.parentElement.style.display = ''
    btnCancelar.disabled = false
}

const cancelar = () => {
    aplicacionesContainer.style.display = '';
    formulario.reset();
    btnGuardar.parentElement.style.display = ''
    btnGuardar.disabled = false
    btnModificar.parentElement.style.display = 'none'
    btnModificar.disabled = true
    btnCancelar.parentElement.style.display = 'none'
    btnCancelar.disabled = true
}

const modificar = async (e) => {

    e.preventDefault()

    if (!validarFormulario(formulario)) {
        Swal.fire({
            title: "Campos vacíos",
            text: "Debe llenar todos los campos",
            icon: "warning"
        })
        return
    }

    try {
        const body = new FormData(formulario)
        const url = "/tienda/API/aplicacion/modificar"
        const config = {
            method: 'POST',
            body
        }

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();
        const { codigo, mensaje, detalle } = data;
        console.log(data);
        if (codigo == 1) {
            Swal.fire({
                title: "Modificado",
                text: "La Aplicación ha sido modificada exitosamente",
                icon: "success"
            })
            formulario.reset();
            buscar();
            cancelar();
        } else {
            Swal.fire({
                title: "Error!",
                text: "La Aplicación no pudo ser modificada",
                icon: "error"
            })
            console.log(detalle);
        }

        Toast.fire({
            icon: icon,
            title: mensaje
        })

    } catch (error) {
        console.log(error);
    }
}

const eliminar = async (aplicacion) => {
    let confirmacion = await
        Swal.fire({
            icon: 'question',
            title: 'Confirmacion',
            text: '¿Esta seguro que desea eliminar estaplicación?',
            showCancelButton: true,
            confirmButtonText: '<i class="bi bi-check-circle-fill"></i>',
            cancelButtonText: '<i class="bi bi-x-circle-fill"></i>',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        });

    console.log(confirmacion);
    if (confirmacion.isConfirmed) {
        try {
            const body = new FormData()
            body.append('app_id', aplicacion.app_id)
            const url = "/tienda/API/aplicacion/eliminar"
            const config = {
                method: 'POST',
                body
            }

            const respuesta = await fetch(url, config);
            const data = await respuesta.json();
            const { codigo, mensaje, detalle } = data;
            let icon = 'info'
            if (codigo == 1) {
                icon = 'success'
                formulario.reset();
                buscar();
            } else {
                icon = 'error'
                console.log(detalle);
            }

            Toast.fire({
                icon: icon,
                title: mensaje
            })
        } catch (error) {
            console.log(error);
        }
    }

}

btnBuscar.addEventListener('click', () => {
    aplicacionesContainer.style.display = '';
    buscar();
})

formulario.addEventListener('submit', guardar)
btnCancelar.addEventListener('click', cancelar)
btnModificar.addEventListener('click', modificar)
