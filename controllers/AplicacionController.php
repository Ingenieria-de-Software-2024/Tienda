<?php

namespace Controllers;

use Exception;
use Model\Aplicacion;
use MVC\Router;

class AplicacionController
{
    public static function index(Router $router)
    {
        $aplicaciones = Aplicacion::find(2);
        $router->render('aplicacion/index', [
            'aplicaciones' => $aplicaciones
        ]);
    }

    public static function guardarAPI()
    {
        $_POST['app_nombre'] = htmlspecialchars($_POST['app_nombre']);

        try {
            $Aplicacion = new Aplicacion($_POST);
            $resultado = $Aplicacion->crear();
            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Aplicación guardado exitosamente',
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al guardar la Aplicación',
                'detalle' => $e->getMessage(),
            ]);
        }
    }

    public static function buscarAPI()
    {
        try {
            $resultado = Aplicacion::obtenerAplicacionesconQuery();
            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Datos encontrados',
                'detalle' => '',
                'datos' => $resultado
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al buscar Aplicaciones',
                'detalle' => $e->getMessage(),
            ]);
        }
    }

    public static function modificarAPI()
    {
        $_POST['app_nombre'] = htmlspecialchars($_POST['app_nombre']);
        $id = filter_var($_POST['app_id'], FILTER_SANITIZE_NUMBER_INT);
        try {

            $resultado = Aplicacion::find($id);
            $resultado->sincronizar($_POST);
            $resultado->actualizar();
            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Aplicacion modificada exitosamente',
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al modificar la Aplicación',
                'detalle' => $e->getMessage(),
            ]);
        }
    }

    public static function eliminarAPI()
    {
        $id = filter_var($_POST['app_id'], FILTER_SANITIZE_NUMBER_INT);
        try {
            $aplicacion = Aplicacion::find($id);
            if ($aplicacion) {
                $aplicacion->eliminar();
                http_response_code(200);
                echo json_encode([
                    'codigo' => 1,
                    'mensaje' => 'Aplicación eliminada exitosamente',
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'codigo' => 0,
                    'mensaje' => 'Aplicación no encontrada',
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al eliminar la aplicación',
                'detalle' => $e->getMessage(),
            ]);
        }
    }
}
