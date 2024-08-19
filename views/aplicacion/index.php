<div class="container mt-5">
    <h1 class="text-center">Formulario para Ingresar Aplicaciones</h1>
    <div class="row justify-content-center mb-4">
        <form id="formAplicacion" class="border shadow p-4 col-lg-4 bg-dark bg-gradient text-white text-center rounded mt-5">
            <input type="hidden" name="app_id" id="app_id">

            <div class="row mb-3">
                <div class="col">
                    <label for="app_nombre">Nombre</label>
                    <input type="text" name="app_nombre" id="app_nombre" class="form-control">
                </div>
            </div>

            <div class="row mb-3">
                <div class="col">
                    <button type="submit" id="btnGuardar" class="btn btn-primary w-100"><i class="bi bi-floppy-fill"></i> Guardar</button>
                </div>
                <div class="col">
                    <button type="button" id="btnModificar" class="btn btn-warning w-100"><i class="bi bi-pencil-square"></i> Modificar</button>
                </div>
                <div class="col">
                    <button type="button" id="btnCancelar" class="btn btn-danger w-100"><i class="bi bi-x-circle-fill"></i> Cancelar</button>
                </div>
                <div class="col">
                    <button type="button" id="btnBuscar" class="btn btn-success w-100"><i class="bi bi-binoculars-fill"></i> Buscar</button>
                </div>
            </div>
        </form>

        <div class="row">
            <div class="col table-responsive p-5" id="aplicacionesContainer">
                <h1 class="text-center mt-5">Listado de Aplicaciones</h1>
                <table class="table table-bordered table-hover table-sm shadow text-center" id="tablaAplicaciones">
                    <thead class="text-center table-secondary">
                        <tr>
                            <th>NO.</th>
                            <th>Nombre</th>
                            <th>Modificar</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<script src="<?= asset('./build/js/aplicacion/index.js') ?>"></script>