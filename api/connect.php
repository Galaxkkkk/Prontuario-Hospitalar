<?php
  $host = getenv("MYSQLHOST");    // Nome do host
  $user = getenv("MYSQLUSER");    // Usuário
  $password = getenv("MYSQLPASSWORD"); // Senha
  $database = getenv("MYSQLDATABASE"); // Nome do banco

  $conn = new mysqli($host, $user, $password, $database);

  if ($conn->connect_error) {
      die("Erro na conexão: " . $conn->connect_error);
  }
  // Conexão bem-sucedida!
?>