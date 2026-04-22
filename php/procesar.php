<?php
/*
=====================================================
ARCHIVO: php/procesar.php
DESCRIPCIÓN: Recibe los datos del formulario (POST),
             los sanitiza, valida y los inserta en
             la base de datos con Prepared Statements.

FLUJO:
  1. Verificar que la petición sea POST
  2. Incluir conexion.php
  3. Recoger y sanitizar los campos
  4. Validar que los campos obligatorios no estén vacíos
  5. Insertar con Prepared Statement (previene SQL Injection)
  6. Redirigir al formulario con ?estado=ok o ?estado=error
=====================================================
*/

// 1. Solo aceptar peticiones POST
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    die("Acceso no permitido.");
}

// 2. Incluir la conexión (da acceso a $conn)
include("conexion.php");

// 3. Recoger y sanitizar los datos
// trim()           → elimina espacios al inicio/fin
// htmlspecialchars → convierte < > & " en entidades HTML (evita XSS)
$nombre   = htmlspecialchars(trim($_POST['nombre']   ?? ''));
$correo   = htmlspecialchars(trim($_POST['correo']   ?? ''));
$telefono = htmlspecialchars(trim($_POST['telefono'] ?? ''));
$fecha    = htmlspecialchars(trim($_POST['fecha']    ?? ''));
$peticion = htmlspecialchars(trim($_POST['peticion'] ?? ''));

// 4. Validar que los campos obligatorios no estén vacíos
if (empty($nombre) || empty($correo) || empty($peticion) || empty($fecha)) {
    header("Location: ../index.php?estado=error");
    exit;
}

// 5. Insertar con Prepared Statement
// Los '?' son marcadores de posición para los valores reales.
// Esto separa el código SQL de los datos → previene SQL Injection.
$stmt = $conn->prepare(
    "INSERT INTO contactos (nombre, correo, telefono, peticion, fecha)
     VALUES (?, ?, ?, ?, ?)"
);

// Vincular parámetros: 's' = string (cadena) × 5 campos
$stmt->bind_param("sssss", $nombre, $correo, $telefono, $peticion, $fecha);

// 6. Ejecutar y redirigir según resultado
if ($stmt->execute()) {
    header("Location: ../index.php?estado=ok");
} else {
    header("Location: ../index.php?estado=error");
}

// Liberar recursos y cerrar la conexión
$stmt->close();
$conn->close();
?>
