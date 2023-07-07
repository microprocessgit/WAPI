
function editarCadastro(pkId, client, key, webhook, telefone) {
	let form = document.createElement('form')
	form.action = "editar"
	form.method = "post"

	let div1 = document.createElement('div')
	div1.className = "row mb-5";

	let div2 = document.createElement('div')
	div2.className = "col-sm-2";

	let div3 = document.createElement('div')
	div3.className = "col-sm-2";

  let div4 = document.createElement('div')
	div4.className = "col-sm-2";

  let div5 = document.createElement('div')
	div5.className = "col-sm-6";

	let inputClient = document.createElement('input')
	inputClient.type = "text"
	inputClient.name = "client"
	inputClient.className = "form-control"
	inputClient.value = client
	inputClient.setAttribute('required', '');

	let inputKey = document.createElement('input')
	inputKey.type = "text"
	inputKey.name = "key"
	inputKey.className = "form-control"
	inputKey.value = key
	inputKey.setAttribute('required', '');

  let inputWebhook = document.createElement('input')
	inputWebhook.type = "text"
	inputWebhook.name = "webhook"
	inputWebhook.className = "form-control"
	inputWebhook.value = webhook

  let inputTelefone = document.createElement('input')
	inputTelefone.type = "text"
	inputTelefone.name = "telefone"
	inputTelefone.className = "form-control"
	inputTelefone.value = telefone
  inputTelefone.setAttribute("onkeypress", "maskPhoneNumber(this);");

	let inputId = document.createElement('input')
	inputId.type = "hidden"
	inputId.name = "pkId"
	inputId.value = pkId

	let button = document.createElement('button')
	button.type = "submit"
	button.className = "btn btn-primary"
	button.innerHTML = "Atualizar"


	form.appendChild(div1)
	div1.appendChild(div2)
	div1.appendChild(div3)
  div1.appendChild(div4)
  div1.appendChild(div5)
	div2.appendChild(inputClient)
	div3.appendChild(inputKey)
	div4.appendChild(inputTelefone)
  div5.appendChild(inputWebhook)
	div2.appendChild(inputId)
	form.appendChild(button)

	var infoSessao = document.getElementById("id_" + pkId)

	infoSessao.innerHTML = "";

	infoSessao.insertBefore(form, infoSessao[0])

}
function deletarCadastro(pkId) {
	location.href = 'excluir/' + pkId;
}