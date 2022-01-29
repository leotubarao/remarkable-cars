const isValid = input => {
  if (input.checkValidity) return input.checkValidity();

  let isValid = true;
  const value = $(input).val();
  const type = $(input).attr('type');
  const isRequired = input.attr('required');

  if (value) isValid = !('email' === type && !/^([^@]+?)@(([a-z0-9]-*)*[a-z0-9]+\.)+([a-z0-9]+)$/i.test(value));

  else if (isRequired) isValid = false;

  $(input)[(isValid ? 'remove' : 'add') + 'Class']('is-invalid');

  return isValid;
};

const getInputValues = form => {
  let data = [];
  let isValidForm = true;

  form.find('[data-form-field]').each(function() {
    if (!isValid(this)) isValidForm = false;

    data.push([
      $(this).attr('data-form-field') || $(this).attr('name'),
      $(this).val()
    ]);
  });

  data = JSON.stringify(data);

  return {
    isValidForm,
    data,
  };
}

$(function() {
  $('[data-form-type="ltco_form"]').each(function () {

    const form = $(this);
    const fields = form.find('[data-form-field]:not([type="hidden"])');
    const alert = form.find('[data-form-alert]');
    const submit = form.find('[type="submit"]');
    const submitText = submit.text();

    form.on('submit', function (e) {
      e.preventDefault();

      form.addClass('was-validated');

      let { isValidForm, data } = getInputValues(form);

      if (!isValidForm) return;

      $.ajax({
        url: './includes/send.php',
        data: data,
        type: 'POST',
        beforeSend: (_xhr) => {
          submit.text('ENVIANDO...').prop('disabled', true);
          fields.removeClass('is-invalid');
          alert.prop('hidden', true);
          alert.removeClass('alert-success alert-danger');
        },
        success: (r) => {
          const res = JSON.parse(r);

          alert.text(res.message || 'Mensagem enviada com sucesso!');

          alert.addClass(`alert-${res.class || 'success'}`);
          alert.prop('hidden', false);
          fields.val('');
        }
      })
      .done(function () {
        form.removeClass('was-validated');
        submit.text(submitText).prop('disabled', false);
      });
    });
  });
});
