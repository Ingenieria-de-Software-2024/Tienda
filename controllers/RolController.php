<?php

namespace Controllers;

use Exception;
use Model\Aplicacion;
use Model\Rol;
use MVC\Router;

class RolController
{
    public static function index(Router $router)
    {   
        $sql = "SELECT * FROM aplicacion where app_situacion = 1";

        $resultado = Aplicacion::fetchArray($sql);
        $router->render('rol/index', [
            'aplicaciones' => $resultado
        ]);
    }

    public static function guardarAPI()
    {
        $_POST['rol_nombre'] = htmlspecialchars($_POST['rol_nombre']);
        $_POST['rol_nombre_ct'] = htmlspecialchars($_POST['rol_nombre_ct']);
        $_POST['rol_app'] = filter_var($_POST['rol_app'], FILTER_SANITIZE_NUMBER_INT);

        try {
            $respuesta = new Rol($_POST);
            $resultado = $respuesta->crear();
            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Registro Guardado Correctamente'
            ]);
        } catch (Exception $error) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al Guardar Registro',
                'detalle' => $error->getMessage()
            ]);
        }
    }

    public static function buscarAPI()
    {
        try {

            $sql = "SELECT rol_id, rol_nombre, rol_app, rol_nombre_ct, app_nombre FROM rol INNER JOIN aplicacion ON app_id = rol_app WHERE rol_situacion = 1";

            $resultado = Rol::fetchArray($sql);
            http_response_code(200);
            echo json_encode($resultado);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al buscar productos',
                'detalle' => $e->getMessage(),
            ]);
        }
    }

    public static function modificarAPI()
    {
        $_POST['rol_nombre'] = htmlspecialchars($_POST['rol_nombre']);
        $_POST['rol_nombre_ct'] = htmlspecialchars($_POST['rol_nombre_ct']);
        $_POST['rol_app'] = filter_var($_POST['rol_app'], FILTER_SANITIZE_NUMBER_INT);
        $id = filter_var($_POST['rol_id'], FILTER_SANITIZE_NUMBER_INT);

        try {
            $resultado = Rol::find($id);
            $resultado->sincronizar($_POST);
            $resultado->actualizar();
            http_response_code(200);
            echo json_encode([
                'codigo' => 3,
                'mensaje' => 'Rol modificado exitosamente',
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al modificar rol',
                'detalle' => $e->getMessage(),
            ]);
        }
    }

    public static function eliminarAPI()
    {

        $id = filter_var($_POST['id'], FILTER_SANITIZE_NUMBER_INT);
        try {

            $resultado = Rol::find($id);
            $resultado->sincronizar([
                'rol_situacion' => 0
            ]);
            // echo json_encode($resultado);
            // exit;
            $resultado->actualizar();
            http_response_code(200);
            echo json_encode([
                'codigo' => 4,
                'mensaje' => 'Rol eliminado exitosamente',
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al eliminar Rol',
                'detalle' => $e->getMessage(),
            ]);
        }
    }
    
}