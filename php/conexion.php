<?php
// Datos de conexión — ajusta si usas otro puerto o usuario
$host     = "localhost";  // Servidor MySQL
$usuario  = "root";       // Usuario (por defecto en XAMPP)
$password = "";           // Contraseña (vacía por defecto en XAMPP)
$bd       = "formulario";   // Base de datos
$puerto   = 3308;         //

// Crear la conexión con la clase mysql
$conn = new mysqli($host, $usuario, $password, $bd, $puerto);
// Verificar si la conexión falló
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}
echo "✅ Conexión exitosa a '$bd' en el puerto $puerto";

// Configurar charset UTF-8 (soporta tildes, ñ, etc.)
$conn->set_charset("utf8mb4");

// Descomenta la siguiente línea solo para verificar la conexión:
// echo "✅ Conexión exitosa a '$bd'";
?>
