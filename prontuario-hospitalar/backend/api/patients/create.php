<?php
  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json; charset=UTF-8");
  header("Access-Control-Allow-Methods: POST");
  header("Access-Control-Max-Age: 3600");
  header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

  require_once __DIR__ . '/../../../config/database.php';
  require_once __DIR__ . '/../../../models/patient.php';
  require_once __DIR__ . '/../../../models/medical_history.php';

  $database = new Database();
  $db = $database->connect();

  $patient = new Patient($db);
  $medicalHistory = new MedicalHistory($db);

  $data = json_decode(file_get_contents("php://input"));

  if(
      !empty($data->full_name) &&
      !empty($data->birth_date) &&
      !empty($data->gender) &&
      !empty($data->mother_name) &&
      !empty($data->phone) &&
      !empty($data->emergency_contact)
  ) {
      // Dados básicos do paciente
      $patient->patient_id = $data->patient_id ?? uniqid('PAT-');
      $patient->full_name = $data->full_name;
      $patient->birth_date = $data->birth_date;
      $patient->gender = $data->gender;
      $patient->ethnicity = $data->ethnicity ?? null;
      $patient->cpf = $data->cpf ?? null;
      $patient->rg = $data->rg ?? null;
      $patient->father_name = $data->father_name ?? null;
      $patient->mother_name = $data->mother_name;
      $patient->phone = $data->phone;
      $patient->profession = $data->profession ?? null;
      $patient->education = $data->education ?? null;
      $patient->emergency_contact = $data->emergency_contact;
      $patient->nationality = $data->nationality ?? 'Brasileira';
      $patient->naturality = $data->naturality ?? null;
      $patient->register_date = date('Y-m-d');
      $patient->guardians = $data->guardians ?? [];

      // Criar paciente no banco de dados
      if($patient->create()) {
          // Dados do histórico médico
          $medicalHistory->patient_id = $patient->id;
          $medicalHistory->preexisting_conditions = $data->preexisting_conditions ?? null;
          $medicalHistory->allergies = $data->allergies ?? null;
          $medicalHistory->current_medications = $data->current_medications ?? null;
          $medicalHistory->additional_history = $data->additional_history ?? null;

          // Criar histórico médico
          $medicalHistory->create();

          http_response_code(201);
          echo json_encode([
              "message" => "Paciente criado com sucesso.",
              "patient_id" => $patient->patient_id,
              "id" => $patient->id
          ]);
      } else {
          http_response_code(503);
          echo json_encode(["message" => "Não foi possível criar o paciente."]);
      }
  } else {
      http_response_code(400);
      echo json_encode(["message" => "Dados incompletos. Não foi possível criar o paciente."]);
  }
?>