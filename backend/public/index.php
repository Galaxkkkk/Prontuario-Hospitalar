<?php
// Roteamento inteligente
$request = $_SERVER['REQUEST_URI'];
if (str_starts_with($request, '/api')) {
    require __DIR__.'/../'.ltrim($request, '/');
} else {
    header('Content-Type: text/html');
    readfile(__DIR__.'/index.html');
}