import { Dropdown } from "bootstrap";
import { validarFormulario } from "../funciones";
import Swal from "sweetalert2";

const formulario = document.getElementById('formularioPermiso');
const BtnGuardar = document.getElementById('btnGuardar');
const BtnModificar = document.getElementById('btnModificar');
const BtnCancelar = document.getElementById('btnCancelar');
const PermisosIngresados  = document.getElementById('PermisosIngresados')

PermisosIngresados.parentElement.parentElement.classList.add('d-none');
BtnModificar.parentElement.classList.add('d-none');
BtnCancelar.parentElement.classList.add('d-none');


const Buscar = async () => {

    const url = '/tienda/API/permiso/buscar';

    const config = {
        method: 'GET'
    }

    const respuesta = await fetch(url, config);
    const data = await respuesta.json();
    // console.log(data)
    PermisosIngresados.tBodies[0].innerHTML = '';
    const fragment = document.createDocumentFragment();
    let contador = 1;

    if (data.length > 0) {
        PermisosIngresados.parentElement.parentElement.classList.remove('d-none');
        data.forEach(permiso => {
            const tr = document.createElement('tr');
            const celda1 = document.createElement('td');
            const celda2 = document.createElement('td');
            const celda3 = document.createElement('td');
            const celda4 = document.createElement('td');
            const celda5 = document.createElement('td');

            const BtnModificar = document.createElement('button');
            const BtnEliminar = document.createElement('button');

            BtnModificar.innerHTML = '<i class="bi bi-pencil"></i>';
            BtnModificar.classList.add('btn', 'btn-warning', 'w-100', 'text-uppercase', 'fw-bold', 'shadow', 'border-0');

            BtnEliminar.innerHTML = '<i class="bi bi-trash3"></i>';
            BtnEliminar.classList.add('btn', 'btn-danger', 'w-100', 'text-uppercase', 'fw-bold', 'shadow', 'border-0');

            BtnModificar.addEventListener('click', () => llenarDatos(permiso));
            BtnEliminar.addEventListener('click', () => Eliminar(permiso))

            celda1.innerText = contador;
            celda2.innerText = permiso.usu_nombre;
            celda3.innerText = permiso.rol_nombre;
            celda4.appendChild(BtnModificar)
            celda5.appendChild(BtnEliminar)

            tr.appendChild(celda1);
            tr.appendChild(celda2);
            tr.appendChild(celda3);
            tr.appendChild(celda4);
            tr.appendChild(celda5);

            fragment.appendChild(tr);
            contador++;

        })

    } else {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.innerText = 'No hay permiso Registrados ';
        tr.classList.add('text-center');
        td.colSpan = 5;

        tr.appendChild(td);
        fragment.appendChild(tr);
    }
    PermisosIngresados.tBodies[0].appendChild(fragment);
}

const guardar = async (e) => {
    e.preventDefault();

    BtnGuardar.disabled = true;

    if (!validarFormulario(formulario, ['permiso_id'])) {
        Swal.fire({
            title: "Campos vacios",
            text: "Debe llenar todos los campos",
            icon: "info"
        })
        BtnGuardar.disabled = false;
        return
    }

    try {
        const body = new FormData(formulario)
        const url = '/tienda/API/permiso/guardar';

        const config = {
            method: 'POST',
            body
        }

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();
        const { codigo, mensaje, detalle } = data

        if (codigo == 1) {

            Swal.fire({
                title: '¡Éxito!',
                text: mensaje,
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                background: '#e0f7fa',
                customClass: {
                    title: 'custom-title-class',
                    text: 'custom-text-class'
                }

            });
            formulario.reset();
            Buscar();
        } else {
            Swal.fire({
                title: '¡Error!',
                text: mensaje,
                icon: 'warning',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                background: '#e0f7fa',
                customClass: {
                    title: 'custom-title-class',
                    text: 'custom-text-class'
                }

            });
        }

    } catch (error) {
        console.log(error)
    }
    BtnGuardar.disabled = false;

}

const llenarDatos = (permiso) => {

    PermisosIngresados.parentElement.parentElement.classList.add('d-none');
    BtnGuardar.parentElement.classList.add('d-none');
    BtnModificar.parentElement.classList.remove('d-none');
    BtnCancelar.parentElement.classList.remove('d-none');

    formulario.permiso_id.value = permiso.permiso_id;
    formulario.permiso_usuario.value = permiso.permiso_usuario;
    formulario.permiso_rol.value = permiso.permiso_rol;

}

const Cancelar = () => {

    PermisosIngresados.parentElement.parentElement.classList.remove('d-none');
    BtnGuardar.parentElement.classList.remove('d-none');
    BtnModificar.parentElement.classList.add('d-none');
    BtnCancelar.parentElement.classList.add('d-none');

    formulario.reset();
    Buscar();
}

const Modificar = async (e) => {
    e.preventDefault()

    if (!validarFormulario(formulario)) {
        Swal.fire({
            title: "Campos vacios",
            text: "Debe llenar todos los campos",
            icon: "info"
        })
        return
    }

    try {
        const body = new FormData(formulario)
        const url = '/tienda/API/permiso/modificar';

        const config = {
            method: 'POST',
            body
        }

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();
        const { codigo, mensaje, detalle } = data

        if (codigo == 3) {

            Swal.fire({
                title: '¡Éxito!',
                text: mensaje,
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                background: '#e0f7fa',
                customClass: {
                    title: 'custom-title-class',
                    text: 'custom-text-class'
                }

            });
            formulario.reset();
            Cancelar();
            Buscar();
        } else {
            Swal.fire({
                title: '¡Error!',
                text: mensaje,
                icon: 'danger',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                background: '#e0f7fa',
                customClass: {
                    title: 'custom-title-class',
                    text: 'custom-text-class'
                }

            });
        }
    } catch (error) {
        console.log(error);
    }
}

const Eliminar = async (permiso) => {
    let confirmacion = await Swal.fire({
        title: '¿Está seguro de que desea eliminar este permiso?',
        text: "Esta acción es irreversible.",
        icon: 'warning',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Sí, eliminar',
        denyButtonText: 'No, cancelar',
        confirmButtonColor: '#3085d6',
        denyButtonColor: '#d33',
        background: '#fff3e0',
        customClass: {
            title: 'custom-title-class',
            text: 'custom-text-class',
            confirmButton: 'custom-confirm-button',
            denyButton: 'custom-deny-button'
        }
    });
    if (confirmacion.isConfirmed) {


        try {


            const body = new FormData()
            body.append('id', permiso.permiso_id)

            const url = '/tienda/API/permiso/eliminar';
            const config = {
                method: 'POST',
                body
            }

            const respuesta = await fetch(url, config);
            const data = await respuesta.json();
            const { codigo, mensaje, detalle } = data

            if (codigo == 4) {

                Swal.fire({
                    title: '¡Éxito!',
                    text: mensaje,
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                    background: '#e0f7fa',
                    customClass: {
                        title: 'custom-title-class',
                        text: 'custom-text-class'
                    }

                });
                formulario.reset();
                Buscar();
            } else {
                Swal.fire({
                    title: '¡Error!',
                    text: mensaje,
                    icon: 'danger',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                    background: '#e0f7fa',
                    customClass: {
                        title: 'custom-title-class',
                        text: 'custom-text-class'
                    }

                });
            }
        } catch (error) {
            console.log(error)
        }
    }
}


Buscar();
formulario.addEventListener('submit', guardar);
BtnCancelar.addEventListener('click', Cancelar);
BtnModificar.addEventListener('click', Modificar);
