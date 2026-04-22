<?php
// 1. Incluir la conexión (da acceso a $conn)
include("conexion.php");

// 2. Crear la base de datos si no existe
$sql = "CREATE DATABASE IF NOT EXISTS formulario";

if ($conn->query($sql)) {
    echo "✅ Base de datos 'formulario' lista.<br>";
} else {
    die("❌ Error al crear la base de datos: " . $conn->error);
}


// 3. Seleccionar la base de datos
$conn->select_db("formulario");


// 4. Crear la tabla usuarios con todos los campos del formulario
$sql = "CREATE TABLE IF NOT EXISTS usuarios (
    id         INT          AUTO_INCREMENT PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL,
    email      VARCHAR(100) UNIQUE NOT NULL,
    telefono   VARCHAR(20),
    fecha      DATE,
    peticion   TEXT,
    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($sql)) {
    echo "✅ Tabla 'usuarios' lista.<br>";
} else {
    die("❌ Error al crear la tabla: " . $conn->error);
}


// 5. Cerrar conexión
$conn->close();

echo "<br>✅ Todo listo. Ya puedes usar el formulario.";

?>