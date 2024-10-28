import { seleccionarClientes, insertarClientes, actualizarClientes, eliminarClientes } from "../modelos/clientes.js";
/* Objetos del DOM */

// Listado de clientes
const listado = document.querySelector("#listado");

// Alerta
const alerta = document.querySelector('#alerta');

// Formulario
const formulario = document.querySelector('#formulario');
const formularioModal = new bootstrap.Modal(document.querySelector('#formularioModal'));
const btnNuevo = document.querySelector('#btnNuevo');

// Inputs
const inputTipoPersona = document.querySelector('#tipoPersona');//
const inputTipoDni = document.querySelector('#tipoDni');//
const inputApellidoRsocial = document.querySelector('#apellidoRsocial');//
const inputNombres = document.querySelector('#nombres');//
const inputDomicilio = document.querySelector('#domicilio');//
const inputTelefono = document.querySelector('#telefono');//
const inputEmail = document.querySelector('#email');//
const inputUsuario = document.querySelector('#usuario');
const inputPassword = document.querySelector('#password');
const inputLocalidad = document.querySelector('#localidad');//
const inputCpostal = document.querySelector('#cpostal');//
const inputFNacimiento = document.querySelector('#fNacimiento');//
const inputFAlta = document.querySelector('#fAlta');//
const inputFBaja = document.querySelector('#fBaja');


// Imagen del formulario
const frmImagen = document.querySelector('#frmImagen');

// Variables
let buscar = '';
let opcion = '';
let id; 
let mensajeAlerta;

let clientes = [];
let clientesFiltrados = [];
let cliente = {};

// Control de usuario
let usuario = '';
let logueado = false;


/**
 * Esta función se ejecuta cuando
 * todo el contenido está cargado
 */

document.addEventListener('DOMContentLoaded', async () => {
    controlUsuario();
    clientes = await obtenerClientes();
    clientesFiltrados = filtrarPorTipoPersona('');
    mostrarClientes();
});

/**
 * Controla si el usuario está logueado
 */
const controlUsuario = () => {
    if (sessionStorage.getItem('usuario')) {
        usuario = sessionStorage.getItem('usuario');
        logueado = true;
    } else {
        logueado = false;
    }
    if (logueado) {
        btnNuevo.style.display = 'inline';
    } else {
        btnNuevo.style.display = 'none';
    }
};

/**
 * Obtiene los clientes
 */
async function obtenerClientes() {
    clientes = await seleccionarClientes();
    return clientes;
}

/**
 * Filtra los clientes por tipo de persona
 * @param n el tipo de persona
 * @return clientes filtrados
 */

function filtrarPorTipoPersona(n) {
    clientesFiltrados = clientes.filter(items => items.tipoPersona.includes(n));
    return clientesFiltrados;
}


/**
 * Muestra los artículos  *
 */
function mostrarClientes() {
    listado.innerHTML = '';
    clientesFiltrados.map(cliente =>
    (listado.innerHTML += `

          <div class="col-md-6 text-center">
            <div class="card mb-3" style="max-width: 620px;">
              <div class="row g-0 ">
                <div class="col-md-4">
                  <img src="./imagenes/${cliente.imagen??''}" class="img-fluid rounded-start" alt=".">
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">${cliente.nombres} ${cliente.apellidoRsocial} - ${cliente.tipoPersona}</h5>
                    <p class="card-text"> <span name="span-domicilio"> ${cliente.domicilio}</span> - <span name="span-localidad"> ${cliente.localidad}</span> - <span name="span-cpostal"> ${cliente.cpostal}</span></p>
                    <p class="card-text"> <span name="span-tipoDni"> ${cliente.tipoDni}</span> - <span name="span-telefono"> ${cliente.telefono}</span> - <span name="span-email"> ${cliente.email}</span></p>
                    <p class="card-text"> <span name="span-fNacimiento"> Fecha de Naci. ${cliente.fNacimiento}</span> - <span name="span-fAlta"> Fecha de alta ${cliente.fAlta}</span></p>
                    <a href="./expedientes.html" class="stretched-link sin-subrrayado"><p class="card-text"><small class="text-body-secondary">Expedientes</small></p> </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
    `)
    );
}

/**
 * Filtro de los artículos
 */

const botonesFiltros = document.querySelectorAll('#filtros button');
botonesFiltros.forEach(boton => {
    boton.addEventListener('click', e => {
        boton.classList.add('active');
        boton.setAttribute('aria-current', 'page');

        botonesFiltros.forEach(otroBoton => {
            if (otroBoton !== boton) {
                otroBoton.classList.remove('active');
                otroBoton.removeAttribute('aria-current');
            }
        });

        buscar = boton.innerHTML;
        if (buscar == 'Todos') {
            buscar = '';
        }
        filtrarPorTipoPersona(buscar);
        mostrarClientes();
    })
})


/**
 * Ejecuta el evento clic del botón Nuevo
 */
btnNuevo.addEventListener('click', () => {
    // Limpiamos los inputs
    inputTipoPersona.value = null;
    inputTipoDni.value = null;
    inputApellidoRsocial.value = null;
    inputNombres.value = null;
    inputDomicilio.value = null;
    inputTelefono.value = null;
    inputEmail.value = null;
    inputUsuario.value = null;
    inputPassword.value = null;
    inputLocalidad.value = null;
    inputCpostal.value = null;
    inputFNacimiento.value = null;
    inputFAlta.value = null;
    inputFBaja.value = null;
    frmImagen.src = './imagenes/cliente-sin-imagen.png';

    // Mostrar el formulario modal
    formularioModal.show();

    opcion = 'insertar';
})

/**
 * Ejecuta el evento submit del formulario
 */
formulario.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevenimos la acción por defecto

    const datos = new FormData(formulario); // Guardamos los datos del formulario

    switch (opcion) {
        case 'insertar':
            mensajeAlerta = 'Datos guardados';
            insertarClientes(datos);
            break;
        case 'actualizar':
            mensajeAlerta = 'Datos acualizados';
            actualizarClientes(datos, id);
            break;
    }
    insertarAlerta(mensajeAlerta, 'success');
    mostrarClientes();
})

/**
 * Define los mensajes de alerta
 * @param mensaje el mensaje a mostrar
 * @param tipo el tipo de alerta
 */
const insertarAlerta = (mensaje, tipo) => {
    const envoltorio = document.createElement('div');
    envoltorio.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible" role="alert">
            <div>${mensaje}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `;
    alerta.append(envoltorio);
}

/**
 * Determina en qué elemento se realiza un evento
 * @param elemento el elemento al que se le realiza el evento
 * @param evento el evento realizado
 * @param selector el selector seleccionado
 * @param manejador el método que maneja el evento
 */
const on = (elemento, evento, selector, manejador) => {
    elemento.addEventListener(evento, e => { // Agregamos el método para escuchar el evento
        if (e.target.closest(selector)) { // Si el objetivo del manejador es el selector
            manejador(e); // Ejecutamos el método del manejador
        }
    })
}

/**
 * Función para el botón Editar
 */
on(document, 'click', '.btn-editar', e => {
    const cardFooter = e.target.parentNode; // Guardamos el elemento padre del botón

    // Guardar los valores del card del cliente
    id = cardFooter.querySelector('.id-cliente').value;
    cliente = clientes.find(item => item.id == id);
    console.log(cliente);

    /*
    const codigo = cardFooter.parentNode.querySelector('span[name=spancodigo]').innerHTML;
    const nombre = cardFooter.parentNode.querySelector('span[name=spannombre]').innerHTML;
    const descripcion = cardFooter.parentNode.querySelector('.div-descripcion').innerHTML;
    const precio = cardFooter.parentNode.querySelector('span[name=spanprecio]').innerHTML;
    const imagen = cardFooter.querySelector('.imagen-articulo').value;
    */

    // Asignamos los valores a los input del formulario
    inputTipoPersona.value = cliente.tipoPersona;
    inputTipoDni.value = cliente.tipoDni;
    inputApellidoRsocial.value = cliente.apellidoRsocial;
    inputNombres.value = cliente.nombres;
    inputDomicilio.value = cliente.domicilio;
    inputTelefono.value = cliente.telefono;
    inputEmail.value = cliente.email;
    inputUsuario.value = cliente.usuario;
    inputPassword.value = cliente.password;
    inputLocalidad.value = cliente.localidad;
    inputCpostal.value = cliente.cpostal;
    inputFNacimiento.value = cliente.fNacimiento;
    inputFAlta.value = cliente.fAlta;
    inputFBaja.value = cliente.fBaja;
    frmImagen.src = `./imagenes/productos/${cliente.imagen}`;

    // Mostramos el formulario
    formularioModal.show();

    opcion = 'actualizar';
})

/**
 * Función para el botón borrar
 */
on(document, 'click', '.btn-borrar', e => {
    const cardFooter = e.target.parentNode;
    id = cardFooter.querySelector('.id-cliente').value;
    cliente = clientes.find(item => item.id == id);

    /*
    const nombre = cardFooter.parentNode.querySelector('span[name=spannombre]').innerHTML;
    */

    let aceptar = confirm(`¿Relamente desea eliminar a ${cliente.nombre}?`);
    if (aceptar) {
        eliminarClientes(id);
        insertarAlerta(`${articulo.nombre} borrado`, 'danger');
        mostrarClientes();
    }
})
