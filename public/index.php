<?php
require_once __DIR__ . '/../includes/app.php';


use MVC\Router;
use Controllers\AppController;
use Controllers\ProductoController;
use Controllers\AplicacionController;

$router = new Router();
$router->setBaseURL('/' . $_ENV['APP_NAME']);

$router->get('/', [AppController::class, 'index']);

//PRODUCTO
$router->get('/producto', [ProductoController::class, 'index']);
$router->get('/API/producto/buscar', [ProductoController::class, 'buscarAPI']);
$router->post('/API/producto/guardar', [ProductoController::class, 'guardarAPI']);
$router->post('/API/producto/modificar', [ProductoController::class, 'modificarAPI']);
$router->post('/API/producto/eliminar', [ProductoController::class, 'eliminarAPI']);

//APLICACIÓN
$router->get('/aplicacion', [AplicacionController::class, 'index']);
$router->get('/API/aplicacion/buscar', [AplicacionController::class, 'buscarAPI']);
$router->post('/API/aplicacion/guardar', [AplicacionController::class, 'guardarAPI']);
$router->post('/API/aplicacion/modificar', [AplicacionController::class, 'modificarAPI']);
$router->post('/API/aplicacion/eliminar', [AplicacionController::class, 'eliminarAPI']);

// Comprueba y valida las rutas, que existan y les asigna las funciones del Controlador
$router->comprobarRutas();
