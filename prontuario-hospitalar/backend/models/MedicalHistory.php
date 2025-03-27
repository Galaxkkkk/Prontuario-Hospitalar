<?php
require_once __DIR__ . '/../config/database.php';

class MedicalHistory {
    private $conn;
    private $table = 'medical_history';

    // Propriedades
    public $id;
    public $patient_id;
    public $preexisting_conditions;
    public $allergies;
    public $current_medications;
    public $additional_history;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->connect();
    }

    // Criar histórico médico
    public function create() {
        $query = 'INSERT INTO ' . $this->table . ' SET
            patient_id = :patient_id,
            preexisting_conditions = :preexisting_conditions,
            allergies = :allergies,
            current_medications = :current_medications,
            additional_history = :additional_history';

        $stmt = $this->conn->prepare($query);

        // Limpar e vincular dados
        $this->patient_id = htmlspecialchars(strip_tags($this->patient_id));
        $this->preexisting_conditions = htmlspecialchars(strip_tags($this->preexisting_conditions));
        $this->allergies = htmlspecialchars(strip_tags($this->allergies));
        $this->current_medications = htmlspecialchars(strip_tags($this->current_medications));
        $this->additional_history = htmlspecialchars(strip_tags($this->additional_history));

        $stmt->bindParam(':patient_id', $this->patient_id);
        $stmt->bindParam(':preexisting_conditions', $this->preexisting_conditions);
        $stmt->bindParam(':allergies', $this->allergies);
        $stmt->bindParam(':current_medications', $this->current_medications);
        $stmt->bindParam(':additional_history', $this->additional_history);

        if($stmt->execute()) {
            return true;
        }

        error_log("Error: " . $stmt->error);
        return false;
    }

    // Buscar histórico médico
    public function read() {
        $query = 'SELECT * FROM ' . $this->table . ' WHERE patient_id = ? LIMIT 1';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->patient_id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            $this->id = $row['id'];
            $this->preexisting_conditions = $row['preexisting_conditions'];
            $this->allergies = $row['allergies'];
            $this->current_medications = $row['current_medications'];
            $this->additional_history = $row['additional_history'];
            return true;
        }
        
        return false;
    }

    // Atualizar histórico médico
    public function update() {
        $query = 'UPDATE ' . $this->table . ' SET
            preexisting_conditions = :preexisting_conditions,
            allergies = :allergies,
            current_medications = :current_medications,
            additional_history = :additional_history
            WHERE patient_id = :patient_id';

        $stmt = $this->conn->prepare($query);

        // Limpar e vincular dados
        $this->preexisting_conditions = htmlspecialchars(strip_tags($this->preexisting_conditions));
        $this->allergies = htmlspecialchars(strip_tags($this->allergies));
        $this->current_medications = htmlspecialchars(strip_tags($this->current_medications));
        $this->additional_history = htmlspecialchars(strip_tags($this->additional_history));
        $this->patient_id = htmlspecialchars(strip_tags($this->patient_id));

        $stmt->bindParam(':preexisting_conditions', $this->preexisting_conditions);
        $stmt->bindParam(':allergies', $this->allergies);
        $stmt->bindParam(':current_medications', $this->current_medications);
        $stmt->bindParam(':additional_history', $this->additional_history);
        $stmt->bindParam(':patient_id', $this->patient_id);

        if($stmt->execute()) {
            return true;
        }

        error_log("Error: " . $stmt->error);
        return false;
    }
}
?>