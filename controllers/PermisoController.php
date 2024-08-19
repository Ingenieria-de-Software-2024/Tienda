<?php

namespace Controllers;

use Exception;
use Model\Permiso;
use Model\Rol;
use Model\Usuario;
use MVC\Router;

class PermisoController
{

    public static function index(Router $router){
        $usuarios = static::buscarUsuario();
        $roles = static::buscarRol();

        $router->render('permiso/index', [
            'usuarios' => $usuarios,
            'roles' => $roles,
        ]);
    }

    public static function buscarUsuario()
    {
        $sql = "SELECT * FROM usuario where usu_situacion = 1";

        try {
            $usuarios = Usuario::fetchArray($sql);
            return $usuarios;
        } catch (Exception $e) {
            return [];
        }
    }

    public static function buscarRol()
    {
        $sql = "SELECT * FROM rol where rol_situacion = 1";

        try {
            $roles = Rol::fetchArray($sql);
            return $roles;
        } catch (Exception $e) {
            return [];
        }
    }

    public static function guardarAPI()
    {
        $_POST['permiso_usuario'] = filter_var($_POST['permiso_usuario'], FILTER_SANITIZE_NUMBER_INT);
        $_POST['permiso_rol'] = filter_var($_POST['permiso_rol'], FILTER_SANITIZE_NUMBER_INT);

        try {
            $permiso = new Permiso($_POST);
            $resultado = $permiso->crear();
            http_response_code(200);
            echo json_encode([
                'codigo' => 1,
                'mensaje' => 'Permiso Guardado Correctamente'
            ]);
        } catch (Exception $error) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al Guardar Permiso',
                'detalle' => $error->getMessage()
            ]);
        }
    }

    public static function BuscarAPI()
    {
        try {

            $sql = "SELECT permiso_id, permiso_usuario, usu_nombre, permiso_rol, rol_nombre FROM permiso INNER JOIN usuario ON usu_id = permiso_usuario INNER JOIN rol ON rol_id = permiso_rol WHERE permiso_situacion = 1";


            $resultado = Permiso::fetchArray($sql);
            http_response_code(200);
            echo json_encode($resultado);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al buscar los permisos',
                'detalle' => $e->getMessage(),
            ]);
        }
    }

    public static function modificarAPI()
    {
        $_POST['permiso_usuario'] = filter_var($_POST['permiso_usuario'], FILTER_SANITIZE_NUMBER_INT);
        $_POST['permiso_rol'] = filter_var($_POST['permiso_rol'], FILTER_SANITIZE_NUMBER_INT);
        $id = filter_var($_POST['permiso_id'], FILTER_SANITIZE_NUMBER_INT);

        try {
            $resultado = Permiso::find($id);
            $resultado->sincronizar($_POST);
            $resultado->actualizar();
            http_response_code(200);
            echo json_encode([
                'codigo' => 3,
                'mensaje' => 'Permiso modificado exitosamente',
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al modificar permiso',
                'detalle' => $e->getMessage(),
            ]);
        }
    }

    public static function eliminarAPI()
    {

        $id = filter_var($_POST['id'], FILTER_SANITIZE_NUMBER_INT);
        try {

            $resultado = Permiso::find($id);
            $resultado->sincronizar([
                'permiso_situacion' => 0
            ]);

            $resultado->actualizar();
            http_response_code(200);
            echo json_encode([
                'codigo' => 4,
                'mensaje' => 'Permiso eliminado exitosamente',
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al eliminar',
                'detalle' => $e->getMessage(),
            ]);
        }
    }
}
