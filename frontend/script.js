const API_URL = "http://localhost:3000/api/users";

// 🔍 Listar todos os usuários
async function loadUsers() {
    const response = await fetch(API_URL);
    const users = await response.json();
    renderTable(users);
}

// 🔎 Buscar usuários por nome
async function searchUsers() {
    const name = document.getElementById('searchInput').value;
    if (!name) {
        loadUsers();
        return;
    }
    const response = await fetch(`${API_URL}/search?name=${name}`);
    const users = await response.json();
    renderTable(users);
}

// ❌ Deletar usuário
async function deleteUser(id) {
    const confirmDelete = confirm('Tem certeza que deseja excluir este usuário?');
    if (confirmDelete) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.status === 204) {
            alert('Usuário deletado com sucesso.');
        } else {
            alert('Erro ao deletar usuário.');
        }
        loadUsers();
    }
}

// 🔑 Trocar senha
async function changePassword(id) {
    const newPassword = prompt('Digite a nova senha:');
    if (newPassword) {
        const response = await fetch(`${API_URL}/${id}/password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newPassword })
        });

        if (response.ok) {
            alert('Senha alterada com sucesso!');
        } else {
            alert('Erro ao alterar senha.');
        }
    }
}

// ➕ Criar novo usuário
async function createUser() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!name || !email || !password) {
        alert('Preencha todos os campos.');
        return;
    }

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });

    if (response.ok) {
        alert('Usuário cadastrado com sucesso!');
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        loadUsers();
    } else {
        alert('Erro ao cadastrar usuário.');
    }
}

// 🏗️ Renderizar a tabela
function renderTable(users) {
    const table = document.getElementById('userTable');
    table.innerHTML = '';

    if (users.length === 0) {
        table.innerHTML = `<tr><td colspan="4">Nenhum usuário encontrado.</td></tr>`;
        return;
    }

    users.forEach(user => {
        const row = `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <button class="delete" onclick="deleteUser(${user.id})">Excluir</button>
                    <button class="change-password" onclick="changePassword(${user.id})">Trocar Senha</button>
                </td>
            </tr>
        `;
        table.innerHTML += row;
    });
}

// Carrega a lista ao abrir a página
loadUsers();
