setTimeout(function () {
  let alertaOk = document.getElementById('alertaOk')
  if (alertaOk !== null) {
    alertaOk.style.display = "none";
  }
}, 3000);

setTimeout(function () {
  let alertaErro = document.getElementById('alertaErro')
  if (alertaErro !== null) {
    alertaErro.style.display = "none";
  }
}, 3000);

function maskPhoneNumber(numero) {
  var telefone = numero.value.replace(/\D/g, ''); 
  if (telefone.length === 11) {
    numero.value = telefone.replace(/(\d{2})(\d{4})(\d{4})/, '+55($1) $2-$3');
  }
}
