<?php
require_once('config.php'); // Requerimos el archivo config.php

/* definimos clase pricipal */
class Modelo {
    //Definimos Propiedad db
    protected $db;
    //Creamos el Constructor con la conexion a la BD
    public function __construct() {
        $this->db = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
        // Si se produce un error de conexion, muestra el error
        if($this->db->connect_errno){
            echo 'Fallo al conectar a MySQL: '.$this->db->connect_error;
            return; 
        }
        // Establecemos el conjunto de caracteres utf8
        $this->db->set_charset(DB_CHARSET);
        $this->db->query('SET NAMES "utf8"');

    }
}
/* Fin de la clase principal */

/* Clase ModeloABM basada en la clase modelo */
class ModeloABM  extends Modelo {
    // Propiedades
    private $tabla;     // Nombre de la Tabla
    private $id = 0;   // id del registro
    private $criterio = '';     // Criterio para las consultas
    private $campos = '*';     // Lista de campos
    private $orden = 'id';    // Campo de ordenamiento
    private $limit = '0';    // Cantidad de registro

    // Metedo constructor
    public function __construct($t) {
        parent::__construct(); // Ejecutamos el constructor de la clase padre
        $this->tabla = $t;    // Asignamos a $tabla el parametro $t
    }

    /* GETTER */
    public function get_tabla() {
        return $this->tabla;
    }
    public function get_id() {
        return $this->id;
    }
    public function get_criterio() {
        return $this->criterio;
    }
    public function get_campos() {
        return $this->tabla;
    }
    public function get_orden() {
        return $this->orden;
    }
    public function get_limit() {
        return $this->limit;
    }

    /* SETTER */
    public function set_tabla($tabla) {
        $this->tabla = $tabla;
    }
    public function set_id($id) {
        $this->id = $id;
    }
    public function set_criterio($criterio) {
        $this->criterio = $criterio;
    }
    public function set_campos($campos) {
        $this->campos = $campos;
    }
    public function set_orden($orden) {
        $this->orden = $orden;
    }
    public function set_limit($limit) {
        $this->limit = $limit;
    }
    
    /*
    * Selecciona datos de una tabla
    */
    public function seleccionar() {
        // SELECT * FROM productos WHERE id=3 ORDER BY id LIMIT 10

        // Guardamos en el $sql la instruccion SELECT
        $sql = "SELECT $this->campos FROM $this->tabla";
        // Si el criterio NO es igual a NADA
        if($this->criterio != '') {
            // Agregamos el criterio
            $sql .= " WHERE $this->criterio";
        }
        // Agregamos el orden
        $sql .= " ORDER BY $this->orden";
        // Si el limite es mayor a cero
        if($this->limit > 0) {
            $sql .= " LIMIT $this->limit";          
        }
        // echo $sql."<br />"; // Mostramos la instrucciones SQL
        // Ejecutamos la consulta y la guardamos en $resultado
        $resultado = $this->db->query($sql);
        // Guardamos los datos en un array asociativo 
        $datos = $resultado->fetch_all(MYSQLI_ASSOC);
        // Convertimos los datos al formato JSON
        $datos_json = json_encode($datos);
        // Retornamos los datos en formato JSON
        return $datos_json;
    }

    /* 
    * Inserta datos en una tabla 
      @param valores Los valores a insertar  
    */
    public function insertar($valores){
        // INSERT INTO productos(codigo, nombre, descripcion, precio) VALUES ('201', 'Samsung A54', 'Procesador...', '150000')
        $campos = '';
        $datos = '';
        // Para cada $valores como $key => $value
        foreach($valores as $key => $value) {
            $campos .= $key.",";// Agregamos cada $key a $campos 
            $datos .= "'".$value."',";// Agregamos cada $value a $datos
        }
        // Quitamos el ultimo caracter (,) a los campos y los datos
        $campos = substr($campos,0,strlen($campos)-1);
        $datos = substr($datos,0,strlen($datos)-1);

        // Guardamos en $sql la instruccion INSERT
        $sql = "INSERT INTO $this->tabla ($campos) VALUES ($datos)";
        echo $sql; // Mostramos la instruccion SQL resultante
        // Ejecutamos la instruccion SQL
        $this->db->query($sql);
    }
  
    /**
     * Actualiza los datos de una tabla
     * @param valores: los valores a modificar
     */
    public function actualizar($valores) {
        // UPDATE productos SET precio = '350000' WHERE id=8
        $sql = "UPDATE $this->tabla SET ";
        // Para cada $valores como $key => $value
        foreach($valores as $key => $value) {
            // Agregamosa $sql los campos ($key) y los valores ($value)
            $sql .= $key."='".$value."',";
        }
        $sql = substr($sql,0,strlen($sql)-1); // Quitamos la coma del final
        // Agregamos el criterio
        $sql .= " WHERE $this->criterio";
        echo $sql.'<br>'; // Mostramos la instruccion SQL resultante
        $this->db->query($sql); // Ejecutamos la instruccion
    }

    /**
     * Elimina registros de una tabla
     */
    public function eliminar() {
        // DELETE FROM productos WHERE id='8'
        $sql = "DELETE FROM $this->tabla WHERE $this->criterio";
        $this->db->query($sql); //Ejecutamos la instruccion
    }
}

