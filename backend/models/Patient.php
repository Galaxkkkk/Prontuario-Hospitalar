<?php
require_once __DIR__ . '/../config/database.php';

class Patient {
    private $conn;
    private $table = 'patients';

    // Propriedades do paciente
    public $id;
    public $patient_id;
    public $full_name;
    public $birth_date;
    public $gender;
    public $ethnicity;
    public $cpf;
    public $rg;
    public $father_name;
    public $mother_name;
    public $phone;
    public $profession;
    public $education;
    public $emergency_contact;
    public $nationality;
    public $naturality;
    public $register_date;
    public $guardians = [];

    public function __construct() {
        $database = new Database();
        $this->conn = $database->connect();
    }

    // Criar paciente
    public function create() {
        $query = 'INSERT INTO ' . $this->table . ' SET
            patient_id = :patient_id,
            full_name = :full_name,
            birth_date = :birth_date,
            gender = :gender,
            ethnicity = :ethnicity,
            cpf = :cpf,
            rg = :rg,
            father_name = :father_name,
            mother_name = :mother_name,
            phone = :phone,
            profession = :profession,
            education = :education,
            emergency_contact = :emergency_contact,
            nationality = :nationality,
            naturality = :naturality,
            register_date = :register_date';

        $stmt = $this->conn->prepare($query);

        // Limpar e vincular dados
        $this->patient_id = htmlspecialchars(strip_tags($this->patient_id));
        $this->full_name = htmlspecialchars(strip_tags($this->full_name));
        $this->birth_date = htmlspecialchars(strip_tags($this->birth_date));
        $this->gender = htmlspecialchars(strip_tags($this->gender));
        $this->ethnicity = htmlspecialchars(strip_tags($this->ethnicity));
        $this->cpf = htmlspecialchars(strip_tags($this->cpf));
        $this->rg = htmlspecialchars(strip_tags($this->rg));
        $this->father_name = htmlspecialchars(strip_tags($this->father_name));
        $this->mother_name = htmlspecialchars(strip_tags($this->mother_name));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->profession = htmlspecialchars(strip_tags($this->profession));
        $this->education = htmlspecialchars(strip_tags($this->education));
        $this->emergency_contact = htmlspecialchars(strip_tags($this->emergency_contact));
        $this->nationality = htmlspecialchars(strip_tags($this->nationality));
        $this->naturality = htmlspecialchars(strip_tags($this->naturality));
        $this->register_date = htmlspecialchars(strip_tags($this->register_date));

        $stmt->bindParam(':patient_id', $this->patient_id);
        $stmt->bindParam(':full_name', $this->full_name);
        $stmt->bindParam(':birth_date', $this->birth_date);
        $stmt->bindParam(':gender', $this->gender);
        $stmt->bindParam(':ethnicity', $this->ethnicity);
        $stmt->bindParam(':cpf', $this->cpf);
        $stmt->bindParam(':rg', $this->rg);
        $stmt->bindParam(':father_name', $this->father_name);
        $stmt->bindParam(':mother_name', $this->mother_name);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->bindParam(':profession', $this->profession);
        $stmt->bindParam(':education', $this->education);
        $stmt->bindParam(':emergency_contact', $this->emergency_contact);
        $stmt->bindParam(':nationality', $this->nationality);
        $stmt->bindParam(':naturality', $this->naturality);
        $stmt->bindParam(':register_date', $this->register_date);

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            
            // Inserir responsáveis se houver
            if(!empty($this->guardians)) {
                $this->createGuardians();
            }
            
            return true;
        }

        error_log("Error: " . $stmt->error);
        return false;
    }

    // Criar responsáveis
    private function createGuardians() {
        $query = 'INSERT INTO guardians SET
            patient_id = :patient_id,
            name = :name,
            relationship = :relationship,
            phone = :phone';

        foreach($this->guardians as $guardian) {
            $stmt = $this->conn->prepare($query);
            
            $stmt->bindParam(':patient_id', $this->id);
            $stmt->bindParam(':name', $guardian['name']);
            $stmt->bindParam(':relationship', $guardian['relationship']);
            $stmt->bindParam(':phone', $guardian['phone']);
            
            if(!$stmt->execute()) {
                error_log("Error creating guardian: " . $stmt->error);
            }
        }
    }

    // Buscar paciente por ID
    public function read() {
        $query = 'SELECT * FROM ' . $this->table . ' WHERE id = ? LIMIT 1';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            $this->patient_id = $row['patient_id'];
            $this->full_name = $row['full_name'];
            $this->birth_date = $row['birth_date'];
            $this->gender = $row['gender'];
            $this->ethnicity = $row['ethnicity'];
            $this->cpf = $row['cpf'];
            $this->rg = $row['rg'];
            $this->father_name = $row['father_name'];
            $this->mother_name = $row['mother_name'];
            $this->phone = $row['phone'];
            $this->profession = $row['profession'];
            $this->education = $row['education'];
            $this->emergency_contact = $row['emergency_contact'];
            $this->nationality = $row['nationality'];
            $this->naturality = $row['naturality'];
            $this->register_date = $row['register_date'];
            
            // Buscar responsáveis
            $this->readGuardians();
            
            return true;
        }
        
        return false;
    }

    // Buscar responsáveis
    private function readGuardians() {
        $query = 'SELECT * FROM guardians WHERE patient_id = ?';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        
        $this->guardians = [];
        
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $this->guardians[] = [
                'name' => $row['name'],
                'relationship' => $row['relationship'],
                'phone' => $row['phone']
            ];
        }
    }

    // Buscar paciente por nome
    public function searchByName($name) {
        $query = 'SELECT * FROM ' . $this->table . ' WHERE full_name LIKE ? ORDER BY full_name LIMIT 10';
        $stmt = $this->conn->prepare($query);
        $name = '%' . $name . '%';
        $stmt->bindParam(1, $name);
        $stmt->execute();
        
        return $stmt;
    }

    // Atualizar paciente
    public function update() {
        $query = 'UPDATE ' . $this->table . ' SET
            full_name = :full_name,
            birth_date = :birth_date,
            gender = :gender,
            ethnicity = :ethnicity,
            cpf = :cpf,
            rg = :rg,
            father_name = :father_name,
            mother_name = :mother_name,
            phone = :phone,
            profession = :profession,
            education = :education,
            emergency_contact = :emergency_contact,
            nationality = :nationality,
            naturality = :naturality
            WHERE id = :id';

        $stmt = $this->conn->prepare($query);

        // Limpar e vincular dados
        $this->full_name = htmlspecialchars(strip_tags($this->full_name));
        $this->birth_date = htmlspecialchars(strip_tags($this->birth_date));
        $this->gender = htmlspecialchars(strip_tags($this->gender));
        $this->ethnicity = htmlspecialchars(strip_tags($this->ethnicity));
        $this->cpf = htmlspecialchars(strip_tags($this->cpf));
        $this->rg = htmlspecialchars(strip_tags($this->rg));
        $this->father_name = htmlspecialchars(strip_tags($this->father_name));
        $this->mother_name = htmlspecialchars(strip_tags($this->mother_name));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->profession = htmlspecialchars(strip_tags($this->profession));
        $this->education = htmlspecialchars(strip_tags($this->education));
        $this->emergency_contact = htmlspecialchars(strip_tags($this->emergency_contact));
        $this->nationality = htmlspecialchars(strip_tags($this->nationality));
        $this->naturality = htmlspecialchars(strip_tags($this->naturality));
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(':full_name', $this->full_name);
        $stmt->bindParam(':birth_date', $this->birth_date);
        $stmt->bindParam(':gender', $this->gender);
        $stmt->bindParam(':ethnicity', $this->ethnicity);
        $stmt->bindParam(':cpf', $this->cpf);
        $stmt->bindParam(':rg', $this->rg);
        $stmt->bindParam(':father_name', $this->father_name);
        $stmt->bindParam(':mother_name', $this->mother_name);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->bindParam(':profession', $this->profession);
        $stmt->bindParam(':education', $this->education);
        $stmt->bindParam(':emergency_contact', $this->emergency_contact);
        $stmt->bindParam(':nationality', $this->nationality);
        $stmt->bindParam(':naturality', $this->naturality);
        $stmt->bindParam(':id', $this->id);

        if($stmt->execute()) {
            // Atualizar responsáveis
            $this->updateGuardians();
            return true;
        }

        error_log("Error: " . $stmt->error);
        return false;
    }

    // Atualizar responsáveis
    private function updateGuardians() {
        // Primeiro remove todos os existentes
        $query = 'DELETE FROM guardians WHERE patient_id = ?';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        
        // Depois insere os novos
        if(!empty($this->guardians)) {
            $this->createGuardians();
        }
    }

    // Deletar paciente
    public function delete() {
        $query = 'DELETE FROM ' . $this->table . ' WHERE id = ?';
        $stmt = $this->conn->prepare($query);
        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(1, $this->id);
        
        if($stmt->execute()) {
            return true;
        }
        
        error_log("Error: " . $stmt->error);
        return false;
    }
}
?>