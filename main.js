'use strict'

const openModal = () => document.getElementById("modal")
    .classList.add("active")

const closeModal = () => {
    clearFields()
    document.getElementById("modal").classList.remove("active")
}

const getLocalStorage = () => JSON.parse(localStorage.getItem("db_client")) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient))

// função de criar
const creatClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push (client)
    setLocalStorage(dbClient)
}

// função de ler (réplica)
const readClient = () => getLocalStorage()

// função de atualizar
const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
}

// limpar tabela após atualizacao
const clearTable = () => {
    const rows = document.querySelectorAll("#tbClient>tbody tr")
    rows.forEach(row => row.parentNode.removeChild(row))
}

// função de deleção
const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index,1)
    setLocalStorage(dbClient)
}

// Interações com usuário 

const isValidFields = () => {
    return document.getElementById("form-princ").reportValidity()
}

const clearFields = () => {
    const fields = document.querySelectorAll(".modal-field")
    fields.forEach(field => field.value = "")
}

const saveClient = () => {
    if(isValidFields()) {
        const client = {
            nome: document.getElementById("nome").value,
            email: document.getElementById("email").value,
            celular: document.getElementById("celular").value,
            cidade: document.getElementById("cidade").value,
            estado: document.getElementById("estado").value,
        }
        const index = document.getElementById("nome").dataset.index
        if(index == "new") {
            creatClient(client)
            updateTable()
            closeModal()
        }else {
            updateClient(index, client)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
    <td>${index}</td>
    <td>${client.nome}</td>
    <td>${client.email}</td>
    <td>${client.celular}</td>
    <td>${client.cidade}</td>
    <td>${client.estado}</td>
    <td>
        <button type="button" class="button buttonGreen" id="edit-${index}">Editar</button>
        <button type="button" class="button buttonRed" id="delete-${index}">Excluir</button>
    </td>
    `
    document.querySelector("#tbClient>tbody").appendChild(newRow)
}


// função de update da tabela
const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(createRow)
}

// função que busca o ID para edição e deleção
const fillFields = (client) => {
    document.getElementById("nome").value = client.nome
    document.getElementById("email").value = client.email
    document.getElementById("celular").value = client.celular
    document.getElementById("cidade").value = client.cidade
    document.getElementById("estado").value = client.estado
    document.getElementById("nome").dataset.index = client.index
}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split("-")
        if (action == "edit") {
            editClient(index)
        }else {
            const client = readClient()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
            if(response) {
                deleteClient(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Eventos

document.getElementById('newRegister')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('save')
    .addEventListener('click', saveClient)

document.querySelector("#tbClient>tbody")
    .addEventListener("click", editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)