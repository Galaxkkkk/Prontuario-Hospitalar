<?php
class Database {
    private $host = 'localhost';
    private $db_name = 'hospital_db';
    private $username = 'root';
    private $password = '';
    private $conn;

    public function connect() {
        $options = [
            PDO::MYSQL_ATTR_SSL_CA => '/etc/ssl/cert.pem',
            PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false
        ];
        $this->conn = new PDO(
            "mysql:host={$this->host};dbname={$this->db_name}", 
            $this->username, 
            $this->password,
            $options
        );
    }
}
?>