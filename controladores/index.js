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
function login() {
// Muestra las opciones para el usuario logueado y oculta el botón de login
document.querySelectorAll('.logged-in').forEach(item => {
    item.style.display = 'block';
});
document.getElementById('login-btn').style.display = 'none';
}     

// Al cargar la página, verifica si el usuario ya está logueado
window.onload = function() {
    if (sessionStorage.getItem('usuario')) {
        document.querySelectorAll('.logged-in').forEach(item => {
            item.style.display = 'block';
        });
        document.getElementById('login-btn').style.display = 'none';
    }
}
