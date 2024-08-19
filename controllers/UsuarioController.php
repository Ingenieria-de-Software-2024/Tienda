<?php

namespace Controllers;

use Exception;
use Model\Usuario;
use MVC\Router;
use Model\ActiveRecord;

class UsuarioController
{
    public static function index(Router $router)
    {
        $router->render('usuarios/index', []);
    }
    public static function guardarAPI()
    {
        $nombre = htmlspecialchars($_POST['usu_nombre']);
        $catalogo = filter_var($_POST['usu_catalogo'], FILTER_VALIDATE_INT);
        $password = htmlspecialchars($_POST['usu_password']);
        $confirm_password = htmlspecialchars($_POST['usu_confirm_password']);


        try {

            $sql = "SELECT  COUNT(*) as count FROM usuario WHERE usu_catalogo = $catalogo AND usu_situacion = 1";
            $resultado =  Usuario::fetchArray($sql);

            if ($resultado[0]['count'] == 0) {

                if ($password === $confirm_password) {

                    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

                    $usuario = new Usuario([
                        'usu_nombre' => $nombre,
                        'usu_catalogo' => $catalogo,
                        'usu_password' => $hashed_password,
                    ]);

                    $resultado = $usuario->crear();

                    http_response_code(200);
                    echo json_encode([
                        'codigo' => 1,
                        'mensaje' => 'Usuario Guardado Correctamente'
                    ]);
                } else {
                    echo json_encode([

                        'mensaje' => 'Las contraseñas no coinciden.',
                        'codigo' => 0
                    ]);
                }
            } else {
                echo json_encode([
                    'mensaje' => 'Este Usuario con este catalogo ya existe',
                    'codigo' => 0
                ]);
            }
        } catch (Exception $error) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al Guardar Registro',
                'detalle' => $error->getMessage()
            ]);
        }
    }


    public static function BuscarAPI()
    {
        try {

            $sql = "SELECT * FROM usuario where usu_situacion = 1";
            $resultado = Usuario::fetchArray($sql);
            http_response_code(200);
            echo json_encode($resultado);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al buscar obtener usuarios',
                'detalle' => $e->getMessage(),
            ]);
        }
    }

    public static function modificarAPI()
    {
        // Sanitiza y valida los datos recibidos
        $_POST['usu_nombre'] = htmlspecialchars($_POST['usu_nombre']);
        $_POST['usu_catalogo'] = filter_var($_POST['usu_catalogo'], FILTER_SANITIZE_NUMBER_INT);
        $_POST['usu_password'] = htmlspecialchars($_POST['usu_password']);
        $_POST['usu_confirm_password'] = htmlspecialchars($_POST['usu_confirm_password']);
        $id = filter_var($_POST['usu_id'], FILTER_SANITIZE_NUMBER_INT);
    
        try {
     
            if ($_POST['usu_password'] === $_POST['usu_confirm_password']) {
     
                $hashed_password = password_hash($_POST['usu_password'], PASSWORD_DEFAULT);
             
                $usuario = Usuario::find($id);
                if ($usuario) {
                    $_POST['usu_password'] = $hashed_password; 
                    $usuario->sincronizar($_POST);
                    $usuario->actualizar();
    
                    http_response_code(200);
                    echo json_encode([
                        'codigo' => 3,
                        'mensaje' => 'Usuario modificado exitosamente',
                    ]);
                } else {
                    echo json_encode([
                        'mensaje' => 'Usuario no encontrado.',
                        'codigo' => 0
                    ]);
                }
            } else {
                echo json_encode([
                    'mensaje' => 'Las contraseñas no coinciden.',
                    'codigo' => 0
                ]);
            }
        } catch (Exception $error) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al modificar el registro',
                'detalle' => $error->getMessage()
            ]);
        }
    }

    public static function eliminarAPI()
    {
        
        $id = filter_var($_POST['id'], FILTER_SANITIZE_NUMBER_INT);
        try {
            
            $usuario = Usuario::find($id);
            $usuario->sincronizar([
                'usu_situacion' => 0
            ]);
            // echo json_encode($usuario);
            $usuario->actualizar();
            // exit;
            http_response_code(200);
            echo json_encode([
                'codigo' => 4,
                'mensaje' => 'Usuario eliminado exitosamente',
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'codigo' => 0,
                'mensaje' => 'Error al Eliminar el Usuario',
                'detalle' => $e->getMessage(),
            ]);
        }
    }
    
}
