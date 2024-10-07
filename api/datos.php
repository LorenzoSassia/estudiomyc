<?php
// Requerimos el archivo de la clase Modelo
require_once('modelos.php');

$mensaje='';

if(isset($_GET['tabla'])) {
    $tabla = new ModeloABM($_GET['tabla']);

    if(isset($_GET['id'])){
        $tabla->set_criterio("id=".$_GET['id']);
    }

    if(isset($_GET['accion'])) {
        if($_GET['accion'] == 'insertar' || $_GET['accion'] == 'actualizar') {
            $valores = $_POST;
        }

        // ------------- SUBIDA DE IMAGENES -------------
        if(
            isset($_FILES) && // Si esta seteado el array $_FILES
            isset($_FILES['imagen']) && // Si esta seteado el parametro $_FILES['imagen']
            !empty($_FILES['imagen']['name']) && // NO esta vacio $_FILES['imagen']['name'] y 
            !empty($_FILES['imagen']['tmp_name']) // NO está vacio $_FILES['imagen']['tmp_name']
        ) {
            if(is_uploaded_file($_FILES['imagen']['tmp_name'])) { // Si esta subido el archivo temporal
                $tmp_nombre = $_FILES['imagen']['tmp_name'];
                $nombre = $_FILES['imagen']['name'];
                $destino = '../imagenes/productos/'.$nombre;
                if(move_uploaded_file($tmp_nombre, $destino)){ // Si se puede mover el archivo temporal a destino
                    $mensaje = 'Archivo subido correctamente';
                    $valores['imagen'] = $nombre; // Agregamos el array $valores el nombre de la imagen
                } else {
                    $mensaje = 'No se a podido subir el archivo';
                    unlink(ini_get('upload_tmp_dir').$tmp_nombre); // Eliminamos el archivo temporal
                }
                } else {
                    $mensaje = 'Error: El archivo no fue procesado correctamente';
                }
            }
             
        switch($_GET['accion']) {
            case 'seleccionar':
                $datos = $tabla->seleccionar();
                print_r($datos);
                break;

            case 'insertar':    
                $tabla->insertar($valores);
                $mensaje = 'Datos Guardados';
                echo json_encode($mensaje);
                break;

            case 'actualizar':
                $tabla->actualizar($valores);
                $mensaje = 'Datos actualizados';
                echo json_encode($mensaje);
                break;
            
            case 'eliminar':
                $tabla->eliminar();
                $mensaje = 'Datos eliminados';
                echo json_decode($mensaje);
                break;
        }
    }    
}



?>