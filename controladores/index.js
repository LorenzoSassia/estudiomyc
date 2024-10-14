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
 * Muestra el nav completo  *
 */
function mostrarNav() {
    mostrarNav.map(nav =>
    (listado.innerHTML += `
                  <nav class="navbar navbar-expand-lg bg-body-tertiary " data-bs-theme="dark">
                 <div class="container-fluid">
            <a class="navbar-brand" href="./"><img src='./iconos/balance-icono.svg'>MYC</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item ${logueado?'d-flex':'d-none'}">
                        <a class="nav-link active" aria-current="page" href="./clientes.html">Clientes</a>
                    </li>
                    <li class="nav-item ${logueado?'d-flex':'d-none'}">
                        <a class="nav-link active" aria-current="page" href="./expedientes.html">Expedientes</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav 
      `)
    );
}