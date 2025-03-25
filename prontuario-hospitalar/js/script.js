document.addEventListener('DOMContentLoaded', function() {
  // Elementos do formulário
  const patientForm = document.getElementById('patientForm');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const clearBtn = document.getElementById('clearBtn');
  const newPatientBtn = document.getElementById('newPatientBtn');
  const birthDateInput = document.getElementById('birthDate');
  const ageInput = document.getElementById('age');
  const registerDateInput = document.getElementById('registerDate');
  const addGuardianBtn = document.getElementById('addGuardianBtn');
  const guardiansContainer = document.getElementById('guardians-container');
  const otherConditionsCheckbox = document.querySelector('input[name="preexistingConditions"][value="outras"]');
  const otherAllergiesCheckbox = document.querySelector('input[name="allergies"][value="outras"]');
  const otherConditionsInput = document.getElementById('otherConditions');
  const otherAllergiesInput = document.getElementById('otherAllergies');

  // Definir data de cadastro como hoje
  const today = new Date().toISOString().split('T')[0];
  registerDateInput.value = today;

  // Gerar ID do paciente (simulação)
  function generatePatientId() {
      return 'PAT-' + Math.floor(100000 + Math.random() * 900000);
  }

  // Calcular idade a partir da data de nascimento
  function calculateAge(birthDate) {
      if (!birthDate) return '';
      
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          age--;
      }
      
      return age;
  }

  // Atualizar idade quando a data de nascimento muda
  birthDateInput.addEventListener('change', function() {
      ageInput.value = calculateAge(this.value);
  });

  // Adicionar novo responsável
  addGuardianBtn.addEventListener('click', function() {
      const guardianDiv = document.createElement('div');
      guardianDiv.className = 'guardian-input';
      
      guardianDiv.innerHTML = `
          <input type="text" name="guardianName" placeholder="Nome do Responsável">
          <input type="text" name="guardianRelationship" placeholder="Parentesco">
          <input type="tel" name="guardianPhone" placeholder="Telefone">
          <button type="button" class="btn-remove-guardian">-</button>
      `;
      
      guardiansContainer.insertBefore(guardianDiv, addGuardianBtn);
      
      // Adicionar evento ao botão de remover
      const removeBtn = guardianDiv.querySelector('.btn-remove-guardian');
      removeBtn.addEventListener('click', function() {
          guardianDiv.remove();
      });
  });

  // Mostrar/ocultar campo "outras condições"
  otherConditionsCheckbox.addEventListener('change', function() {
      otherConditionsInput.style.display = this.checked ? 'block' : 'none';
      if (!this.checked) otherConditionsInput.value = '';
  });

  // Mostrar/ocultar campo "outras alergias"
  otherAllergiesCheckbox.addEventListener('change', function() {
      otherAllergiesInput.style.display = this.checked ? 'block' : 'none';
      if (!this.checked) otherAllergiesInput.value = '';
  });

  // Limpar formulário
  clearBtn.addEventListener('click', function() {
      if (confirm('Tem certeza que deseja limpar o formulário? Todos os dados não salvos serão perdidos.')) {
          patientForm.reset();
          ageInput.value = '';
          registerDateInput.value = today;
          document.getElementById('patientId').value = '';
          
          // Remover todos os responsáveis adicionais
          const guardianInputs = document.querySelectorAll('.guardian-input');
          guardianInputs.forEach((input, index) => {
              if (index > 0) input.remove(); // Mantém o primeiro
          });
          
          // Resetar campos condicionais
          otherConditionsInput.style.display = 'none';
          otherConditionsInput.value = '';
          otherAllergiesInput.style.display = 'none';
          otherAllergiesInput.value = '';
      }
  });

  // Novo paciente
  newPatientBtn.addEventListener('click', function() {
      if (confirm('Iniciar um novo prontuário? Certifique-se de que salvou as alterações no paciente atual.')) {
          patientForm.reset();
          ageInput.value = '';
          registerDateInput.value = today;
          document.getElementById('patientId').value = generatePatientId();
          
          // Remover todos os responsáveis adicionais
          const guardianInputs = document.querySelectorAll('.guardian-input');
          guardianInputs.forEach((input, index) => {
              if (index > 0) input.remove(); // Mantém o primeiro
          });
          
          // Resetar campos condicionais
          otherConditionsInput.style.display = 'none';
          otherConditionsInput.value = '';
          otherAllergiesInput.style.display = 'none';
          otherAllergiesInput.value = '';
      }
  });

  // Pesquisar paciente (simulação)
  searchBtn.addEventListener('click', function() {
      const searchTerm = searchInput.value.trim();
      
      if (searchTerm === '') {
          alert('Por favor, digite um nome para pesquisa.');
          return;
      }
      
      // Simulação de busca - em um sistema real, isso seria uma requisição AJAX
      alert(`Pesquisando por: ${searchTerm}\n\nEsta funcionalidade será implementada com integração ao banco de dados.`);
      
      // Simulação de resultado (dados fictícios)
      if (searchTerm.toLowerCase() === 'exemplo') {
          document.getElementById('fullName').value = 'João da Silva Exemplo';
          document.getElementById('patientId').value = 'PAT-123456';
          document.getElementById('birthDate').value = '1980-05-15';
          document.getElementById('age').value = calculateAge('1980-05-15');
          document.getElementById('gender').value = 'masculino';
          document.getElementById('ethnicity').value = 'branca';
          document.getElementById('cpf').value = '123.456.789-00';
          document.getElementById('rg').value = '12.345.678-9';
          document.getElementById('fatherName').value = 'Carlos da Silva';
          document.getElementById('motherName').value = 'Maria da Silva';
          document.getElementById('phone').value = '(11) 98765-4321';
          document.getElementById('profession').value = 'Engenheiro';
          document.getElementById('education').value = 'superior-completo';
          document.getElementById('emergencyContact').value = '(11) 91234-5678';
          document.getElementById('nationality').value = 'Brasileira';
          document.getElementById('naturality').value = 'São Paulo/SP';
          
          // Simular histórico médico
          document.querySelector('input[name="preexistingConditions"][value="hipertensao"]').checked = true;
          document.querySelector('input[name="allergies"][value="penicilina"]').checked = true;
          document.getElementById('currentMedications').value = 'Losartana 50mg - 1x ao dia';
          document.getElementById('medicalHistory').value = 'Apêndice removido em 2010.';
          
          alert('Paciente encontrado! Dados carregados no formulário.');
      } else {
          alert('Nenhum paciente encontrado com esse nome.');
      }
  });

  // Enviar formulário (simulação)
  patientForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validação básica
      const requiredFields = ['fullName', 'birthDate', 'gender', 'motherName', 'phone', 'emergencyContact'];
      let isValid = true;
      
      requiredFields.forEach(fieldId => {
          const field = document.getElementById(fieldId);
          if (!field.value.trim()) {
              field.style.borderColor = 'red';
              isValid = false;
          } else {
              field.style.borderColor = '';
          }
      });
      
      if (!isValid) {
          alert('Por favor, preencha todos os campos obrigatórios marcados em vermelho.');
          return;
      }
      
      // Simular envio para o banco de dados
      console.log('Dados do formulário:', getFormData());
      alert('Prontuário salvo com sucesso! (Simulação)\n\nNa implementação real, os dados serão enviados para o banco de dados MySQL.');
      
      // Gerar novo ID para o próximo paciente
      document.getElementById('patientId').value = generatePatientId();
  });

  // Função para obter dados do formulário
  function getFormData() {
      const formData = {};
      const formElements = patientForm.elements;
      
      for (let element of formElements) {
          if (element.name) {
              if (element.type === 'checkbox') {
                  if (!formData[element.name]) formData[element.name] = [];
                  if (element.checked) formData[element.name].push(element.value);
              } else if (element.type !== 'button' && element.type !== 'submit') {
                  formData[element.name] = element.value;
              }
          }
      }
      
      // Coletar responsáveis
      const guardians = [];
      const guardianInputs = document.querySelectorAll('.guardian-input');
      
      guardianInputs.forEach(input => {
          const name = input.querySelector('input[name="guardianName"]').value;
          const relationship = input.querySelector('input[name="guardianRelationship"]').value;
          const phone = input.querySelector('input[name="guardianPhone"]').value;
          
          if (name || relationship || phone) {
              guardians.push({
                  name,
                  relationship,
                  phone
              });
          }
      });
      
      if (guardians.length > 0) {
          formData.guardians = guardians;
      }
      
      return formData;
  }

  // Gerar ID inicial para novo paciente
  document.getElementById('patientId').value = generatePatientId();
});

// Validação de CPF
function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g,'');
    if(cpf == '') return false;
    
    // Elimina CPFs invalidos conhecidos    
    if (cpf.length != 11 || 
        cpf == "00000000000" || 
        cpf == "11111111111" || 
        cpf == "22222222222" || 
        cpf == "33333333333" || 
        cpf == "44444444444" || 
        cpf == "55555555555" || 
        cpf == "66666666666" || 
        cpf == "77777777777" || 
        cpf == "88888888888" || 
        cpf == "99999999999")
        return false;
        
    // Valida 1o digito
    let add = 0;
    for (let i=0; i < 9; i ++)     
        add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)     
        rev = 0;
    if (rev != parseInt(cpf.charAt(9)))     
        return false;
        
    // Valida 2o digito
    add = 0;
    for (let i = 0; i < 10; i ++)        
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) 
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;
        
    return true;
}

// Validação de telefone
function validatePhone(phone) {
    return phone.replace(/\D/g, '').length >= 10;
}

// Adicione ao evento submit do formulário:
const cpfField = document.getElementById('cpf');
if (cpfField.value && !validateCPF(cpfField.value)) {
    alert('CPF inválido!');
    isValid = false;
    cpfField.style.borderColor = 'red';
}

const phoneField = document.getElementById('phone');
if (!validatePhone(phoneField.value)) {
    alert('Telefone inválido!');
    isValid = false;
    phoneField.style.borderColor = 'red';
}

// Máscaras para os campos
$(document).ready(function(){
  $('#cpf').mask('000.000.000-00');
  $('#rg').mask('00.000.000-0');
  $('#phone').mask('(00) 00000-0000');
  $('#emergencyContact').mask('(00) 00000-0000');
  $('input[name="guardianPhone"]').mask('(00) 00000-0000');
});

document.getElementById('exportPdfBtn').addEventListener('click', function() {
  // Simulação - na prática use bibliotecas como jsPDF ou html2pdf
  alert('Funcionalidade de exportação para PDF será implementada!\n\nPermitirá salvar ou imprimir o prontuário.');
});

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
      toast.style.display = 'block';
      setTimeout(() => {
          toast.style.opacity = '0';
          setTimeout(() => {
              toast.remove();
          }, 300);
      }, 3000);
  }, 100);
}

// Exemplo de uso no submit:
showToast('Prontuário salvo com sucesso!', 'success');