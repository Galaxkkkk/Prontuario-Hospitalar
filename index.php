<?php
  $requested_file = __DIR__.$_SERVER['REQUEST_URI'];

  // Verifica se o arquivo solicitado existe
  if (file_exists($requested_file) && is_file($requested_file)) {
      if (preg_match('/\.(css|js|png|jpg|jpeg|gif)$/', $requested_file)) {
          // Serve arquivos estáticos diretamente
          return false;
      }
      include $requested_file;
  } elseif (file_exists(__DIR__.'/index.html')) {
      // Fallback para o front-end
      include __DIR__.'/index.html';
  } else {
      http_response_code(404);
      echo "Arquivo não encontrado. Verifique os logs do servidor.";
  }
?>