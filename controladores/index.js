





////////////////////////////////////////////////////////////////////////////////




const navBarCompleto = document.querySelector('#navBarCompleto');

// Variables
//let buscar = '';
//let opcion = '';
//let id;
//let mensajeAlerta;

//let propiedadesFiltradas = [];
//let propiedades = [];
let navBar = {};

// Control de usuario
let usuario = '';
let logueado = false;

/**
 * Controla si el usuario está logueado
 */
const controlUsuario = () => {
    if(sessionStorage.getItem('usuario')) {
        usuario = sessionStorage.getItem('usuario');
        logueado = true;
    } else {
        logueado = false;
    }
    if(logueado) {
        btnNuevo.style.display = 'inline';
    } else {
        btnNuevo.style.display = 'none';
    }
};

function mostrarNavBar() {
    navBarCompleto.innerHTML = '';

    navBar.map(navBar =>
        navBarCompleto.innerHTML  +=`
        <nav class="navbar navbar-expand-lg bg-body-tertiary " data-bs-theme="dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="./"><img src='./iconos/balance-icono.svg' />MYC</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item ${logueado?'d-flex':'d-none'}">
                        <a class="nav-link active logged-in" aria-current="page" href="./clientes.html"
                            id="login-cliente">Clientes</a>
                    </li>
                    <li class="nav-item ${logueado?'d-flex':'d-none'}">
                        <a class="nav-link active logged-in" aria-current="page"
                            href="./expedientes.html">Expedientes</a>
                    </li>
                    <li class="nav-item ${logueado?'d-flex':'d-none'}">
                        <a class="nav-link active logged-in" aria-current="page" href="./juzgado.html">Juzgados</a>
                    </li>
                </ul>
            </div>
        </div>
        <div id="nav-login">
            <div id="div-login">
                <form class="d-flex" id="form-login">
                    <input class="form-control me-2 " id="usuario" name="usuario" type="text" placeholder="Usuario"
                        aria-label="Usuario">
                    <input class="form-control me-2 " id="password" name="password" type="password"
                        placeholder="Contraseña" aria-label="Contraseña">
                    <button class="btn btn-outline-success " type="submit">Login</button>
                </form>
            </div>
            <div id="div-logout" style="display: none;">
                <span id="texto-logueado" class="text-white"></span>
                <button id="btn-logout" class="btn btn-outline-primary">
                    Cerrar sesion
                </button>
            </div>
        </div>
    </nav>
        `

    )
}