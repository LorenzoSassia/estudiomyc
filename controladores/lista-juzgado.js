import { seleccionarJuzgados, insertarJuzgados, actualizarJuzgados, eliminarJuzgados } from "../modelos/juzgados.js";
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
const inputNroJuzgado = document.querySelector('#nroJuzgado');//
const inputNombreJuzgado = document.querySelector('#nombreJuzgado');//
const inputJuezTram = document.querySelector('#juezTram');//
const inputSecretario = document.querySelector('#secretario');//
const inputTelefono = document.querySelector('#telefono');//

// Imagen del formulario
const frmImagen = document.querySelector('#frmImagen');

// Variables
let buscar = '';
let opcion = '';
let id;
let mensajeAlerta;

let juzgados = [];
let juzgadosFiltrados = [];
let juzgado = {};

// Control de usuario
let usuario = '';
let logueado = false;


/**
 * Esta función se ejecuta cuando
 * todo el contenido está cargado
 */

document.addEventListener('DOMContentLoaded', async () => {
    controlUsuario();
    juzgados = await obtenerJuzgados();
    juzgadosFiltrados = filtrarPorSecretario('');
    mostrarJuzgados();
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
 * Obtiene los Juzgados
 */
async function obtenerJuzgados() {
    juzgados = await seleccionarJuzgados();
    return juzgados;
}

/**
 * Filtra los juzgados por tipo de Expediente
 * @param n el tipo de Expediente
 * @return juzgados filtrados
 */

function filtrarPorSecretario(n) {
    juzgadosFiltrados = juzgados.filter(items => items.secretario.includes(n));
    return juzgadosFiltrados;
}


/**
 * Muestra los juzgados  *
 */
function mostrarJuzgados() {
    listado.innerHTML = '';
    juzgadosFiltrados.map(juzgado =>
    (listado.innerHTML += `

          <div class="col-md-6 text-center">
            <div class="card mb-3" style="max-width: 620px;">
              <div class="row g-0 ">
                <div class="col-md-2">
                  
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">${juzgado.nroJuzgado} - ${juzgado.nombreJuzgado} </h5>
                    <p class="card-text"> <span name="span-juzgado"> Juez Tram. : ${juzgado.juezTram}</span> - <span name="span-tipoJuicio">Secretario: ${juzgado.secretario}</span></p>
                    <p class="card-text"> <span name="span-caratura"> ${juzgado.telefono}</span> </p>
                    
                  </div>
                   <div class="card-footer">
                            <a class="btn-editar btn btn-primary">Editar</a>
                            <a class="btn-borrar btn btn-danger">Borrar</a> 
                            <input type="hidden" class="id-juzgado" value="${juzgado.id}">
                    </div>
                </div>
              </div>
            </div>
          </div>
    `)
    );
}

/**
 * Filtro de los Juzgados
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
        filtrarPorSecretario(buscar);
        mostrarJuzgados();
    })
})


/**
 * Ejecuta el evento clic del botón Nuevo
 */
btnNuevo.addEventListener('click', () => {
    // Limpiamos los inputs
    inputNroJuzgado.value = null;
    inputNombreJuzgado.value = null;
    inputJuezTram.value = null;
    inputSecretario.value = null;
    inputTelefono.value = null;
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
            insertarJuzgados(datos);
            break;
        case 'actualizar':
            mensajeAlerta = 'Datos acualizados';
            actualizarJuzgados(datos, id);
            break;
    }
    insertarAlerta(mensajeAlerta, 'success');
    mostrarJuzgados();
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

    // Guardar los valores del card del juzgado
    id = cardFooter.querySelector('.id-juzgado').value;
    juzgado = juzgados.find(item => item.id == id);
    console.log(juzgado);

    /*
    const codigo = cardFooter.parentNode.querySelector('span[name=spancodigo]').innerHTML;
    const nombre = cardFooter.parentNode.querySelector('span[name=spannombre]').innerHTML;
    const descripcion = cardFooter.parentNode.querySelector('.div-descripcion').innerHTML;
    const precio = cardFooter.parentNode.querySelector('span[name=spanprecio]').innerHTML;
    const imagen = cardFooter.querySelector('.imagen-articulo').value;
    */

    // Asignamos los valores a los input del formulario
    inputNroJuzgado.value = juzgado.nroJuzgado;
    inputNombreJuzgado.value = juzgado.nombreJuzgado;
    inputJuezTram.value = juzgado.juezTram;
    inputSecretario.value = juzgado.secretario;
    inputTelefono.value = juzgado.telefono;
    frmImagen.src = `./imagenes/productos/${juzgado.imagen}`;

    // Mostramos el formulario
    formularioModal.show();

    opcion = 'actualizar';
})

/**
 * Función para el botón borrar
 */
on(document, 'click', '.btn-borrar', e => {
    const cardFooter = e.target.parentNode;
    id = cardFooter.querySelector('.id-juzgado').value;
    juzgado = juzgados.find(item => item.id == id);

    /*
    const nombre = cardFooter.parentNode.querySelector('span[name=spannombre]').innerHTML;
    */

    let aceptar = confirm(`¿Relamente desea eliminar a ${juzgado.nroJuzgado}?`);
    if (aceptar) {
        eliminarJuzgados(id);
        insertarAlerta(`${juzgado.nroJuzgado} borrado`, 'danger');
        mostrarJuzgados();
    }
})
