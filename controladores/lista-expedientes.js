import { seleccionarExpedientes, insertarExpedientes, actualizarExpedientes, eliminarExpedientes } from "../modelos/expedientes.js";
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
const inputTipoExpediente = document.querySelector('#tipoExpediente');//
const inputNroExpediente = document.querySelector('#nroExpediente');//
const inputJuzgado = document.querySelector('#juzgado');//
const inputCaratura = document.querySelector('#caratura');//
const inputTipoJuicio = document.querySelector('#tipoJuicio');//
const inputACargoDe = document.querySelector('#aCargoDe');//
const inputEstado = document.querySelector('#estado');//
const inputFInicio = document.querySelector('#fInicio');
const inputFFin = document.querySelector('#fFin');
const inputFBaja = document.querySelector('#fBaja');


// Imagen del formulario
const frmImagen = document.querySelector('#frmImagen');

// Variables
let buscar = '';
let opcion = '';
let id;
let mensajeAlerta;

let expedientes = [];
let expedientesFiltrados = [];
let expediente = {};

// Control de usuario
let usuario = '';
let logueado = false;


/**
 * Esta función se ejecuta cuando
 * todo el contenido está cargado
 */

document.addEventListener('DOMContentLoaded', async () => {
    controlUsuario();
    expedientes = await obtenerExpedientes();
    expedientesFiltrados = filtrarPorTipoExpediente('');
    mostrarExpedientes();
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
 * Obtiene los expedientes
 */
async function obtenerExpedientes() {
    expedientes = await seleccionarExpedientes();
    return expedientes;
}

/**
 * Filtra los expedientes por tipo de Expediente
 * @param n el tipo de Expediente
 * @return expedientes filtrados
 */

function filtrarPorTipoExpediente(n) {
    expedientesFiltrados = expedientes.filter(items => items.tipoExpediente.includes(n));
    return expedientesFiltrados;
}


/**
 * Muestra los expedientes  *
 */
function mostrarExpedientes() {
    listado.innerHTML = '';
    expedientesFiltrados.map(expediente =>
    (listado.innerHTML += `

          <div class="col-md-6 text-center">
            <div class="card mb-3" style="max-width: 620px;">
              <div class="row g-0 ">
                <div class="col-md-4">
                  <img src="./imagenes/${expediente.imagen ?? ''}" class="img-fluid rounded-start" alt=".">
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">${expediente.tipoExpediente} - ${expediente.nroExpediente} </h5>
                    <p class="card-text"> <span name="span-juzgado"> Nro. Juzgado: ${expediente.juzgado}</span> - <span name="span-tipoJuicio">Tipo: ${expediente.tipoJuicio}</span></p>
                    <p class="card-text"> <span name="span-caratura"> ${expediente.caratura}</span> </p>
                    <p class="card-text"> <span name="span-aCargoDe"> ${expediente.aCargoDe}</span> - <span name="span-estado"> ${expediente.estado}</span> </p>
                    <p class="card-text"> <span name="span-fInicio">Fecha de Inicio: ${expediente.fInicio}</span> - <span name="span-fFin">Fecha de Fin: ${expediente.fFin}</span></p>
                    
                  </div>
                   <div class="card-footer">
                            <a class="btn-editar btn btn-primary">Editar</a>
                            <a class="btn-borrar btn btn-danger">Borrar</a> 
                            <input type="hidden" class="id-cliente" value="${expediente.id}">
                    </div>
                </div>
              </div>
            </div>
          </div>
    `)
    );
}

/**
 * Filtro de los Expedientes
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
        filtrarPorTipoExpediente(buscar);
        mostrarExpedientes();
    })
})


/**
 * Ejecuta el evento clic del botón Nuevo
 */
btnNuevo.addEventListener('click', () => {
    // Limpiamos los inputs
    inputTipoExpediente.value = null;
    inputNroExpediente.value = null;
    inputJuzgado.value = null;
    inputCaratura.value = null;
    inputTipoJuicio.value = null;
    inputACargoDe.value = null;
    inputEstado.value = null;
    inputFInicio.value = null;
    inputFFin.value = null;
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
            insertarExpedientes(datos);
            break;
        case 'actualizar':
            mensajeAlerta = 'Datos acualizados';
            actualizarExpedientes(datos, id);
            break;
    }
    insertarAlerta(mensajeAlerta, 'success');
    mostrarExpedientes();
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

    // Guardar los valores del card del expediente
    id = cardFooter.querySelector('.id-expediente').value;
    expediente = expedientes.find(item => item.id == id);
    console.log(expediente);

    /*
    const codigo = cardFooter.parentNode.querySelector('span[name=spancodigo]').innerHTML;
    const nombre = cardFooter.parentNode.querySelector('span[name=spannombre]').innerHTML;
    const descripcion = cardFooter.parentNode.querySelector('.div-descripcion').innerHTML;
    const precio = cardFooter.parentNode.querySelector('span[name=spanprecio]').innerHTML;
    const imagen = cardFooter.querySelector('.imagen-articulo').value;
    */

    // Asignamos los valores a los input del formulario
    inputTipoExpediente.value = expediente.tipoExpediente;
    inputNroExpediente.value = expediente.nroExpediente;
    inputJuzgado.value = expediente.juzgado;
    inputCaratura.value = expediente.caratura;
    inputTipoJuicio.value = expediente.tipoJuicio;
    inputACargoDe.value  = expediente.aCargoDe;
    inputEstado.value = expediente.estado;
    inputFInicio.value = expediente.fInicio;
    inputFFin.value = expediente.fFin;
    inputFBaja.value = expediente.fBaja;
    frmImagen.src = `./imagenes/productos/${expediente.imagen}`;

    // Mostramos el formulario
    formularioModal.show();

    opcion = 'actualizar';
})

/**
 * Función para el botón borrar
 */
on(document, 'click', '.btn-borrar', e => {
    const cardFooter = e.target.parentNode;
    id = cardFooter.querySelector('.id-expediente').value;
    expediente = expedientes.find(item => item.id == id);

    /*
    const nombre = cardFooter.parentNode.querySelector('span[name=spannombre]').innerHTML;
    */

    let aceptar = confirm(`¿Relamente desea eliminar a ${expediente.nroExpediente}?`);
    if (aceptar) {
        eliminarExpedientes(id);
        insertarAlerta(`${expediente.nroExpediente} borrado`, 'danger');
        mostrarExpedientes();
    }
})
