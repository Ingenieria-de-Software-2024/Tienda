import { Dropdown } from "bootstrap";
import { Toast, validarFormulario } from "../funciones";
import Swal from "sweetalert2";

const formulario = document.getElementById('formProductos')
const tabla = document.getElementById('tablaProductos')
const btnGuardar = document.getElementById('btnGuardar')
const btnModificar = document.getElementById('btnModificar')
const btnCancelar = document.getElementById('btnCancelar')
const btnBuscar = document.getElementById('btnBuscar')
const productosContainer = document.getElementById('productosContainer')

btnModificar.parentElement.style.display = 'none'
btnModificar.disabled = true
btnCancelar.parentElement.style.display = 'none'
btnCancelar.disabled = true
productosContainer.style.display = 'none';

const guardar = async (e) => {
    e.preventDefault()

    if (!validarFormulario(formulario, ['pro_id'])) {
        Swal.fire({
            title: "Campos vacios",
            text: "Debe llenar todos los campos",
            icon: "warning"
        })
        return
    }

    try {
        const body = new FormData(formulario)
        const url = "/tienda/API/producto/guardar"
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
                text: "Producto guardado exitosamente!",
                icon: "success"
            })

            formulario.reset();
            buscar();
        } else {
            Swal.fire({
                title: "Error!",
                text: "El Producto no se puedo guardar",
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
        const url = "/tienda/API/producto/buscar"
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
            datos.forEach(producto => {
                const tr = document.createElement('tr');
                const td1 = document.createElement('td');
                const td2 = document.createElement('td');
                const td3 = document.createElement('td');
                const td4 = document.createElement('td');
                const td5 = document.createElement('td');
                const buttonModificar = document.createElement('button');
                const buttonEliminar = document.createElement('button');
                td1.innerText = counter
                td2.innerText = producto.nombre
                td3.innerText = producto.precio

                buttonModificar.classList.add('btn', 'btn-warning')
                buttonEliminar.classList.add('btn', 'btn-danger')
                buttonModificar.innerHTML = '<i class="bi bi-pencil-square"></i>';
                buttonEliminar.innerHTML = '<i class="bi bi-trash-fill"></i>';

                buttonModificar.addEventListener('click', () => traerDatos(producto))
                buttonEliminar.addEventListener('click', () => eliminar(producto))

                td4.appendChild(buttonModificar)
                td5.appendChild(buttonEliminar)

                counter++

                tr.appendChild(td1)
                tr.appendChild(td2)
                tr.appendChild(td3)
                tr.appendChild(td4)
                tr.appendChild(td5)
                fragment.appendChild(tr)
            })
        } else {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.innerText = "No hay productos"
            td.colSpan = 5

            tr.appendChild(td)
            fragment.appendChild(tr)
        }

        tabla.tBodies[0].appendChild(fragment)

    } catch (error) {
        console.log(error);
    }
}

const traerDatos = (producto) => {
    console.log(producto);
    formulario.pro_id.value = producto.id
    formulario.nombre.value = producto.nombre
    formulario.precio.value = producto.precio
    productosContainer.style.display = 'none';

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
    productosContainer.style.display = '';
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
        const url = "/tienda/API/producto/modificar"
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
                text: "El Producto ha sido modificado exitosamente",
                icon: "success"
            })
            formulario.reset();
            buscar();
            cancelar();
        } else {
            Swal.fire({
                title: "Erro!",
                text: "El Producto no pudo ser modificado",
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

const eliminar = async (producto) => {
    let confirmacion = await
        Swal.fire({
            icon: 'question',
            title: 'Confirmación',
            text: '¿Esta seguro que desea eliminar este registro?',
            showCancelButton: true,
            confirmButtonText: '<i class="bi bi-check-circle-fill"></i>',
            cancelButtonText: '<i class="bi bi-x-circle-fill"></i>',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        })
    console.log(confirmacion);
    if (confirmacion.isConfirmed) {
        try {
            const body = new FormData()
            body.append('id', producto.id)
            const url = "/tienda/API/producto/eliminar"
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
                Swal.fire({
                    title: "Error!",
                    text: "El Producto no se puedo guardar",
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

}

btnBuscar.addEventListener('click', () => {
    productosContainer.style.display = '';
    buscar();
})

formulario.addEventListener('submit', guardar)
btnCancelar.addEventListener('click', cancelar)
btnModificar.addEventListener('click', modificar)
