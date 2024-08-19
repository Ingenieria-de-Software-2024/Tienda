<?php

namespace Model;

class Aplicacion extends ActiveRecord
{
    public static $tabla = 'aplicacion';
    public static $idTabla = 'app_id';
    public static $columnasDB = ['app_nombre', 'app_situacion'];

    public $app_id;
    public $app_nombre;
    public $app_situacion;
    
    public function __construct($args =[])
    {
        $this->app_id = $args['app_id'] ?? null;
        $this->app_nombre = $args['app_nombre'] ?? '';
        $this->app_situacion = $args['app_situacion'] ?? 1 ;
    }

}