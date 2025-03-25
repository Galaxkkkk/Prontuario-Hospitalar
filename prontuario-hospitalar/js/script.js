document.addEventListener('DOMContentLoaded', function() {
  const patientForm = document.getElementById('patientForm');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const clearBtn = document.getElementById('clearBtn');
  const newPatientBtn = document.getElementById('newPatientBtn');
  const exportPdfBtn = document.getElementById('exportPdfBtn');
  const birthDateInput = document.getElementById('birthDate');
  const ageInput = document.getElementById('age');
  const registerDateInput = document.getElementById('registerDate');
  const addGuardianBtn = document.getElementById('addGuardianBtn');
  const guardiansContainer = document.getElementById('guardians-container');
  const otherConditionsCheckbox = document.querySelector('input[name="preexistingConditions"][value="outras"]');
  const otherAllergiesCheckbox = document.querySelector('input[name="allergies"][value="outras"]');
  const otherConditionsInput = document.getElementById('otherConditions');
  const otherAllergiesInput = document.getElementById('otherAllergies');
  const loadingIndicator = document.getElementById('loadingIndicator');

  // Data atual para cadastro
  const today = new Date().toISOString().split('T')[0];
  registerDateInput.value = today;
  document.getElementById('patientId').value = generatePatientId();

  // 1. Funções utilitárias
  function generatePatientId() {
      return 'PAT-' + Math.floor(100000 + Math.random() * 900000);
  }

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

  function showToast(message, type = 'success') {
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      
      const icon = document.createElement('i');
      icon.className = type === 'error' ? 'fas fa-exclamation-circle' : 
                       type === 'warning' ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle';
      
      toast.appendChild(icon);
      toast.appendChild(document.createTextNode(message));
      document.body.appendChild(toast);
      
      setTimeout(() => {
          toast.classList.add('fade-out');
          setTimeout(() => toast.remove(), 500);
      }, 3000);
  }

  function showLoading(show) {
      loadingIndicator.style.display = show ? 'flex' : 'none';
  }

  function validateCPF(cpf) {
      cpf = cpf.replace(/[^\d]+/g,'');
      if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
      
      let sum = 0, remainder;
      
      for (let i = 1; i <= 9; i++) 
          sum += parseInt(cpf.substring(i-1, i)) * (11 - i);
      remainder = (sum * 10) % 11;
      
      if ((remainder === 10) || (remainder === 11)) remainder = 0;
      if (remainder !== parseInt(cpf.substring(9, 10))) return false;
      
      sum = 0;
      for (let i = 1; i <= 10; i++) 
          sum += parseInt(cpf.substring(i-1, i)) * (12 - i);
      remainder = (sum * 10) % 11;
      
      if ((remainder === 10) || (remainder === 11)) remainder = 0;
      return remainder === parseInt(cpf.substring(10, 11));
  }

  function validateForm() {
      let isValid = true;
      const requiredFields = [
          'fullName', 'birthDate', 'gender', 
          'motherName', 'phone', 'emergencyContact'
      ];

      // Valida campos obrigatórios
      requiredFields.forEach(id => {
          const field = document.getElementById(id);
          if (!field.value.trim()) {
              field.style.borderColor = 'var(--danger-color)';
              isValid = false;
          } else {
              field.style.borderColor = '';
          }
      });

      // Valida CPF se preenchido
      const cpfField = document.getElementById('cpf');
      if (cpfField.value && !validateCPF(cpfField.value)) {
          showToast('CPF inválido!', 'error');
          cpfField.style.borderColor = 'var(--danger-color)';
          isValid = false;
      }

      // Valida telefones
      const phoneFields = [
          document.getElementById('phone'),
          document.getElementById('emergencyContact')
      ];
      
      phoneFields.forEach(field => {
          const digits = field.value.replace(/\D/g, '');
          if (digits.length < 10 || digits.length > 11) {
              showToast(`Telefone ${field.placeholder} inválido!`, 'error');
              field.style.borderColor = 'var(--danger-color)';
              isValid = false;
          }
      });

      return isValid;
  }

  function getFormData() {
      const formData = {
          basicInfo: {},
          medicalHistory: {}
      };

      // Informações básicas
      formData.basicInfo = {
          id: document.getElementById('patientId').value,
          fullName: document.getElementById('fullName').value,
          birthDate: document.getElementById('birthDate').value,
          age: document.getElementById('age').value,
          gender: document.getElementById('gender').value,
          registerDate: document.getElementById('registerDate').value,
          ethnicity: document.getElementById('ethnicity').value,
          cpf: document.getElementById('cpf').value,
          rg: document.getElementById('rg').value,
          fatherName: document.getElementById('fatherName').value,
          motherName: document.getElementById('motherName').value,
          phone: document.getElementById('phone').value,
          profession: document.getElementById('profession').value,
          education: document.getElementById('education').value,
          emergencyContact: document.getElementById('emergencyContact').value,
          nationality: document.getElementById('nationality').value,
          naturality: document.getElementById('naturality').value
      };

      // Responsáveis
      formData.basicInfo.guardians = [];
      document.querySelectorAll('.guardian-input').forEach(guardian => {
          formData.basicInfo.guardians.push({
              name: guardian.querySelector('input[name="guardianName"]').value,
              relationship: guardian.querySelector('input[name="guardianRelationship"]').value,
              phone: guardian.querySelector('input[name="guardianPhone"]').value
          });
      });

      // Histórico médico
      formData.medicalHistory = {
          preexistingConditions: Array.from(
              document.querySelectorAll('input[name="preexistingConditions"]:checked')
          ).map(el => el.value),
          otherConditions: document.getElementById('otherConditions').value,
          allergies: Array.from(
              document.querySelectorAll('input[name="allergies"]:checked')
          ).map(el => el.value),
          otherAllergies: document.getElementById('otherAllergies').value,
          currentMedications: document.getElementById('currentMedications').value,
          additionalHistory: document.getElementById('medicalHistory').value
      };

      return formData;
  }

  // 2. Event Listeners
  birthDateInput.addEventListener('change', function() {
      ageInput.value = calculateAge(this.value);
  });

  addGuardianBtn.addEventListener('click', addGuardian);

  clearBtn.addEventListener('click', function() {
      if (confirm('Tem certeza que deseja limpar o formulário?')) {
          resetForm();
          showToast('Formulário limpo', 'success');
      }
  });

  newPatientBtn.addEventListener('click', function() {
      if (confirm('Iniciar novo prontuário? As alterações não salvas serão perdidas.')) {
          resetForm();
          document.getElementById('patientId').value = generatePatientId();
          showToast('Novo prontuário criado', 'success');
      }
  });

  searchBtn.addEventListener('click', searchPatient);

  exportPdfBtn.addEventListener('click', function() {
      showLoading(true);
      setTimeout(() => {
          showLoading(false);
          showToast('PDF gerado com sucesso (simulação)', 'success');
      }, 1500);
  });

  patientForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (!validateForm()) {
          showToast('Preencha os campos obrigatórios corretamente', 'error');
          return;
      }

      showLoading(true);
      
      // Simulação de envio ao servidor
      setTimeout(() => {
          showLoading(false);
          const formData = getFormData();
          console.log('Dados para envio:', formData);
          showToast('Prontuário salvo com sucesso!', 'success');
          
          // Atualiza ID para novo possível cadastro
          document.getElementById('patientId').value = generatePatientId();
      }, 2000);
  });

  otherConditionsCheckbox.addEventListener('change', function() {
      otherConditionsInput.style.display = this.checked ? 'block' : 'none';
      if (!this.checked) otherConditionsInput.value = '';
  });

  otherAllergiesCheckbox.addEventListener('change', function() {
      otherAllergiesInput.style.display = this.checked ? 'block' : 'none';
      if (!this.checked) otherAllergiesInput.value = '';
  });

  // 3. Funções principais
  function addGuardian() {
      const guardianDiv = document.createElement('div');
      guardianDiv.className = 'guardian-input';
      
      guardianDiv.innerHTML = `
          <input type="text" name="guardianName" placeholder="Nome do Responsável">
          <input type="text" name="guardianRelationship" placeholder="Parentesco">
          <input type="tel" name="guardianPhone" placeholder="Telefone" class="phone-mask">
          <button type="button" class="btn-remove-guardian"><i class="fas fa-minus"></i></button>
      `;
      
      guardiansContainer.insertBefore(guardianDiv, addGuardianBtn);
      
      // Adiciona máscara ao telefone
      if (typeof $ !== 'undefined') {
          $(guardianDiv).find('.phone-mask').mask('(00) 00000-0000');
      }
      
      // Adiciona evento ao botão de remover
      guardianDiv.querySelector('.btn-remove-guardian').addEventListener('click', function() {
          guardianDiv.remove();
          showToast('Responsável removido', 'warning');
      });
  }

  function resetForm() {
      patientForm.reset();
      ageInput.value = '';
      registerDateInput.value = today;
      
      // Remove responsáveis extras
      const guardians = document.querySelectorAll('.guardian-input');
      guardians.forEach((guardian, index) => {
          if (index > 0) guardian.remove();
      });
      
      // Reseta campos condicionais
      otherConditionsInput.style.display = 'none';
      otherConditionsInput.value = '';
      otherAllergiesInput.style.display = 'none';
      otherAllergiesInput.value = '';
  }

  function searchPatient() {
      const searchTerm = searchInput.value.trim();
      
      if (!searchTerm) {
          showToast('Digite um nome para pesquisa', 'error');
          searchInput.focus();
          return;
      }
      
      showLoading(true);
      
      // Simulação de busca (substituir por AJAX na implementação real)
      setTimeout(() => {
          showLoading(false);
          
          if (searchTerm.toLowerCase().includes('exemplo')) {
              // Preenche com dados de exemplo
              fillSampleData();
              showToast('Paciente encontrado', 'success');
          } else {
              showToast('Paciente não encontrado', 'warning');
          }
      }, 1500);
  }

  function fillSampleData() {
      // Dados fictícios para exemplo
      document.getElementById('fullName').value = 'Maria da Silva Exemplo';
      document.getElementById('patientId').value = 'PAT-789123';
      document.getElementById('birthDate').value = '1985-08-20';
      document.getElementById('age').value = calculateAge('1985-08-20');
      document.getElementById('gender').value = 'feminino';
      document.getElementById('ethnicity').value = 'parda';
      document.getElementById('cpf').value = '987.654.321-00';
      document.getElementById('rg').value = '45.678.901-2';
      document.getElementById('fatherName').value = 'José da Silva';
      document.getElementById('motherName').value = 'Ana da Silva';
      document.getElementById('phone').value = '(11) 98765-4321';
      document.getElementById('profession').value = 'Enfermeira';
      document.getElementById('education').value = 'superior-completo';
      document.getElementById('emergencyContact').value = '(11) 91234-5678';
      document.getElementById('nationality').value = 'Brasileira';
      document.getElementById('naturality').value = 'Rio de Janeiro/RJ';
      
      // Histórico médico fictício
      document.querySelector('input[name="preexistingConditions"][value="hipertensao"]').checked = true;
      document.querySelector('input[name="preexistingConditions"][value="asma"]').checked = true;
      document.querySelector('input[name="allergies"][value="dipirona"]').checked = true;
      document.getElementById('currentMedications').value = 'Captopril 25mg - 1x ao dia\nSalbutamol - quando necessário';
      document.getElementById('medicalHistory').value = 'Internação em 2018 por pneumonia';
      
      // Adiciona um responsável de exemplo
      if (document.querySelectorAll('.guardian-input').length === 1) {
          addGuardian();
          const guardians = document.querySelectorAll('.guardian-input');
          const lastGuardian = guardians[guardians.length - 1];
          lastGuardian.querySelector('input[name="guardianName"]').value = 'Carlos Exemplo';
          lastGuardian.querySelector('input[name="guardianRelationship"]').value = 'Marido';
          lastGuardian.querySelector('input[name="guardianPhone"]').value = '(11) 99876-5432';
      }
  }

  // 4. Inicialização
  function init() {
      // Adiciona máscaras se jQuery estiver disponível
      if (typeof $ !== 'undefined') {
          $('.cpf-mask').mask('000.000.000-00', {reverse: true});
          $('.rg-mask').mask('00.000.000-0', {reverse: true});
          $('.phone-mask').mask('(00) 00000-0000');
      }
      
      // Adiciona evento para novos campos de telefone dinâmicos
      document.addEventListener('DOMNodeInserted', function(e) {
          if (e.target.name === 'guardianPhone' && typeof $ !== 'undefined') {
              $(e.target).mask('(00) 00000-0000');
          }
      });
  }

  init();
});