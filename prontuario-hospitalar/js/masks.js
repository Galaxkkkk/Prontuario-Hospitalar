document.addEventListener('DOMContentLoaded', function() {
  // Máscaras usando jQuery Mask Plugin
  if (typeof $ !== 'undefined') {
      $('.cpf-mask').mask('000.000.000-00', {reverse: true});
      $('.rg-mask').mask('00.000.000-0', {reverse: true});
      $('.phone-mask').mask('(00) 00000-0000');
      
      // Adiciona máscara dinâmica para novos campos de telefone
      $(document).on('DOMNodeInserted', 'input[name="guardianPhone"]', function() {
          $(this).mask('(00) 00000-0000');
      });
  }
});