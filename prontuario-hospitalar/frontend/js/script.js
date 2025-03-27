// Adicione estas constantes no início do arquivo
const API_BASE_URL = 'http://localhost/prontuario-hospitalar/backend/api';
const PATIENTS_API_URL = `${API_BASE_URL}/patients`;
const MEDICAL_HISTORY_API_URL = `${API_BASE_URL}/medical_history`;

// Substitua a função getFormData() por esta versão atualizada
function getFormData() {
    const formData = {
        patient_id: document.getElementById('patientId').value,
        full_name: document.getElementById('fullName').value,
        birth_date: document.getElementById('birthDate').value,
        gender: document.getElementById('gender').value,
        ethnicity: document.getElementById('ethnicity').value,
        cpf: document.getElementById('cpf').value.replace(/\D/g, ''),
        rg: document.getElementById('rg').value,
        father_name: document.getElementById('fatherName').value,
        mother_name: document.getElementById('motherName').value,
        phone: document.getElementById('phone').value.replace(/\D/g, ''),
        profession: document.getElementById('profession').value,
        education: document.getElementById('education').value,
        emergency_contact: document.getElementById('emergencyContact').value.replace(/\D/g, ''),
        nationality: document.getElementById('nationality').value,
        naturality: document.getElementById('naturality').value,
        guardians: [],
        preexisting_conditions: Array.from(
            document.querySelectorAll('input[name="preexistingConditions"]:checked')
        ).map(el => el.value).join(','),
        allergies: Array.from(
            document.querySelectorAll('input[name="allergies"]:checked')
        ).map(el => el.value).join(','),
        current_medications: document.getElementById('currentMedications').value,
        additional_history: document.getElementById('medicalHistory').value
    };

    // Adiciona condições especificadas se marcado
    if (otherConditionsCheckbox.checked && otherConditionsInput.value) {
        formData.preexisting_conditions += (formData.preexisting_conditions ? ',' : '') + otherConditionsInput.value;
    }

    // Adiciona alergias especificadas se marcado
    if (otherAllergiesCheckbox.checked && otherAllergiesInput.value) {
        formData.allergies += (formData.allergies ? ',' : '') + otherAllergiesInput.value;
    }

    // Coleta responsáveis
    document.querySelectorAll('.guardian-input').forEach(guardian => {
        const name = guardian.querySelector('input[name="guardianName"]').value;
        const relationship = guardian.querySelector('input[name="guardianRelationship"]').value;
        const phone = guardian.querySelector('input[name="guardianPhone"]').value.replace(/\D/g, '');

        if (name || relationship || phone) {
            formData.guardians.push({
                name,
                relationship,
                phone
            });
        }
    });

    return formData;
}

// Substitua o event listener do formulário por este
patientForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        showToast('Preencha os campos obrigatórios corretamente', 'error');
        return;
    }

    showLoading(true);
    
    try {
        const formData = getFormData();
        const response = await fetch(`${PATIENTS_API_URL}/create.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (response.ok) {
            showToast('Prontuário salvo com sucesso!', 'success');
            // Atualiza ID para novo possível cadastro
            document.getElementById('patientId').value = generatePatientId();
        } else {
            showToast(data.message || 'Erro ao salvar prontuário', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Erro na comunicação com o servidor', 'error');
    } finally {
        showLoading(false);
    }
});

// Atualize a função searchPatient() para esta versão
async function searchPatient() {
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        showToast('Digite um nome para pesquisa', 'error');
        searchInput.focus();
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch(`${PATIENTS_API_URL}/read.php?name=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        
        if (response.ok && data.data && data.data.length > 0) {
            // Preenche o formulário com o primeiro paciente encontrado
            fillPatientData(data.data[0]);
            showToast('Paciente encontrado', 'success');
        } else {
            showToast('Paciente não encontrado', 'warning');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Erro na comunicação com o servidor', 'error');
    } finally {
        showLoading(false);
    }
}

// Adicione esta nova função para preencher os dados do paciente
async function fillPatientData(patient) {
    // Preenche informações básicas
    document.getElementById('fullName').value = patient.full_name;
    document.getElementById('patientId').value = patient.patient_id;
    document.getElementById('birthDate').value = patient.birth_date;
    document.getElementById('age').value = calculateAge(patient.birth_date);
    document.getElementById('gender').value = patient.gender;
    document.getElementById('ethnicity').value = patient.ethnicity || '';
    document.getElementById('cpf').value = patient.cpf || '';
    document.getElementById('rg').value = patient.rg || '';
    document.getElementById('fatherName').value = patient.father_name || '';
    document.getElementById('motherName').value = patient.mother_name || '';
    document.getElementById('phone').value = patient.phone || '';
    document.getElementById('profession').value = patient.profession || '';
    document.getElementById('education').value = patient.education || '';
    document.getElementById('emergencyContact').value = patient.emergency_contact || '';
    document.getElementById('nationality').value = patient.nationality || 'Brasileira';
    document.getElementById('naturality').value = patient.naturality || '';

    // Limpa responsáveis existentes
    const guardians = document.querySelectorAll('.guardian-input');
    guardians.forEach((guardian, index) => {
        if (index > 0) guardian.remove();
    });

    // Preenche responsáveis se houver
    if (patient.guardians && patient.guardians.length > 0) {
        patient.guardians.forEach((guardian, index) => {
            if (index > 0) addGuardian();
            
            const guardians = document.querySelectorAll('.guardian-input');
            const currentGuardian = guardians[index];
            
            currentGuardian.querySelector('input[name="guardianName"]').value = guardian.name || '';
            currentGuardian.querySelector('input[name="guardianRelationship"]').value = guardian.relationship || '';
            currentGuardian.querySelector('input[name="guardianPhone"]').value = guardian.phone || '';
        });
    }

    // Busca histórico médico
    try {
        const response = await fetch(`${MEDICAL_HISTORY_API_URL}/read.php?patient_id=${patient.id}`);
        const medicalData = await response.json();
        
        if (response.ok && medicalData.data) {
            const history = medicalData.data;
            
            // Marca checkboxes de condições pré-existentes
            if (history.preexisting_conditions) {
                const conditions = history.preexisting_conditions.split(',');
                conditions.forEach(condition => {
                    const checkbox = document.querySelector(`input[name="preexistingConditions"][value="${condition}"]`);
                    if (checkbox) checkbox.checked = true;
                    else if (condition) {
                        otherConditionsCheckbox.checked = true;
                        otherConditionsInput.style.display = 'block';
                        otherConditionsInput.value = condition;
                    }
                });
            }
            
            // Marca checkboxes de alergias
            if (history.allergies) {
                const allergies = history.allergies.split(',');
                allergies.forEach(allergy => {
                    const checkbox = document.querySelector(`input[name="allergies"][value="${allergy}"]`);
                    if (checkbox) checkbox.checked = true;
                    else if (allergy) {
                        otherAllergiesCheckbox.checked = true;
                        otherAllergiesInput.style.display = 'block';
                        otherAllergiesInput.value = allergy;
                    }
                });
            }
            
            // Preenche campos de texto
            document.getElementById('currentMedications').value = history.current_medications || '';
            document.getElementById('medicalHistory').value = history.additional_history || '';
        }
    } catch (error) {
        console.error('Error fetching medical history:', error);
    }
}