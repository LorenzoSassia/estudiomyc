<?php 
    require_once 'modelos.php'; // Requerimos la clase Modelos

    
    $valores = $_POST; // Guardamos en $valores los datos del formulario

    $usuario = "'".$valores['usuario']."'"; // Guardamos el uruario entre ''
    $password = "'".$valores['password']."'"; // Guardamos la password entre ''

    $usuarios = new ModeloABM('clientes'); // Creamos el objeto $usuaroios basado en la tabla clientes
    $usuarios->set_criterio("usuario=$usuario AND password=$password"); // Establecemos 

    $datos = $usuarios->seleccionar(); // Ejecutamos el modelo seleccionar

    echo $datos; // Devolvemos los datos

    // SELECT * FROM clientes WHERE usuario = 'josesanmartin' password = '123456'
 ?>