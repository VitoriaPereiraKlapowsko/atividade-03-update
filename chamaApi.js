const corpoTabelaPersonagens = document.getElementById('corpoTabelaPersonagens');

let usuarioEmEdicaoId = null;

function pegarUsuarioPeloId(idUsuario) {
    axios.get(`http://infopguaifpr.com.br:3052/pegarUsuarioPeloId/${idUsuario}`)
        .then(response => {
            const usuario = response.data;

            document.querySelector('#nomeEdicao').value = usuario.nome;
            document.querySelector('#emailEdicao').value = usuario.email;
            document.querySelector('#disciplinaEdicao').value = usuario.disciplina;

            usuarioEmEdicaoId = idUsuario;

            $('#editarUsuario').modal('show');
        })
        .catch(error => {
            console.error('Erro ao buscar dados do usuário:', error);
        });
}

/*Outra Tentativa
function pegarUsuarioPeloId(idUsuario) {
    const nomeEdicaoElement = document.querySelector('#nomeEdicao');
    const emailEdicaoElement = document.querySelector('#emailEdicao');
    const disciplinaEdicaoElement = document.querySelector('#disciplinaEdicao');

    if (nomeEdicaoElement && emailEdicaoElement && disciplinaEdicaoElement) {
        axios.get(`http://infopguaifpr.com.br:3052/pegarUsuarioPeloId/${idUsuario}`)
            .then(response => {
                const usuario = response.data;

                nomeEdicaoElement.value = usuario.nome;
                emailEdicaoElement.value = usuario.email;
                disciplinaEdicaoElement.value = usuario.disciplina;

                usuarioEmEdicaoId = idUsuario;

                $('#editarUsuario').modal('show');
            })
            .catch(error => {
                console.error('Erro ao buscar dados do usuário:', error);
            });
    } else {
        console.error('Elementos não encontrados ou IDs incorretos.');
    }
}*/

function atualizarUsuario() {
    if (usuarioEmEdicaoId !== null) {
        const nomeEdicao = document.querySelector('#nomeEdicao').value;
        const emailEdicao = document.querySelector('#emailEdicao').value;
        const disciplinaEdicao = document.querySelector('#disciplinaEdicao').value;

        const dadosAtualizados = {
            nome: nomeEdicao,
            email: emailEdicao,
            disciplina: disciplinaEdicao
        };

        axios.put(`http://infopguaifpr.com.br:3052/atualizarUsuario/${usuarioEmEdicaoId}`, dadosAtualizados)
            .then(response => {
                console.log('Usuário atualizado com sucesso:', response.data);
                $('#editarUsuario').modal('hide');
                buscarDadosEPreencherTabela();
            })
            .catch(error => {
                console.error('Erro ao atualizar o usuário:', error);
            });
        usuarioEmEdicaoId = null;
    }
}

document.addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('btn-edit')) {
        const idUsuario = event.target.dataset.id;
        pegarUsuarioPeloId(idUsuario);
    }
});

document.querySelector('#btnEditarUsuario').addEventListener('click', function (event) {
    event.preventDefault();
    atualizarUsuario();

    const idUsuario = usuarioEmEdicaoId;
    const nomeEdicao = document.querySelector('#nomeEdicao').value;
    const emailEdicao = document.querySelector('#emailEdicao').value;
    const disciplinaEdicao = document.querySelector('#disciplinaEdicao').value;

    const dadosAtualizados = {
        nome: nomeEdicao,
        email: emailEdicao,
        disciplina: disciplinaEdicao
    };
    atualizarUsuario(idUsuario, dadosAtualizados);
});

function buscarDadosEPreencherTabela() {
    axios.get('http://infopguaifpr.com.br:3052/listarTodosUsuarios')
        .then(response => {
            console.log(response)

            const usuarios = response.data.usuarios;
            preencherTabela(usuarios);
        })
        .catch(error => {
            console.error('Error fetching character data:', error);
        });
}

function preencherTabela(usuarios) {
    usuarios.forEach(usuario => {
        const linha = document.createElement('tr');

        const idCelula = document.createElement('td');
        idCelula.textContent = usuario.id;
        linha.appendChild(idCelula);

        const nomeCelula = document.createElement('td');
        nomeCelula.textContent = usuario.nome;
        linha.appendChild(nomeCelula);

        const emailCelula = document.createElement('td');
        emailCelula.textContent = usuario.email;
        linha.appendChild(emailCelula);

        const disciplinaCelula = document.createElement('td');
        disciplinaCelula.textContent = usuario.disciplina;
        linha.appendChild(disciplinaCelula);

        const acoesCelula = document.createElement('td');
        const editarBotao = document.createElement('a');
        editarBotao.href = '#';
        editarBotao.className = 'btn btn-primary btn-edit';
        editarBotao.textContent = 'Editar';
        editarBotao.dataset.id = usuario.id;
        acoesCelula.appendChild(editarBotao);

        const excluirBotao = document.createElement('a');
        excluirBotao.href = '#';
        excluirBotao.className = 'btn btn-danger btn-delete';
        excluirBotao.textContent = 'Excluir';
        excluirBotao.dataset.id = usuario.id;
        acoesCelula.appendChild(excluirBotao);

        linha.appendChild(acoesCelula);
        corpoTabelaPersonagens.appendChild(linha);
    });
}

const botaoChamarAPI = document.getElementById('botaoChamarAPI');
botaoChamarAPI.addEventListener('click', () => {
    buscarDadosEPreencherTabela();

});

function deletarUsuario(idUsuario) {
    axios.delete(`http://infopguaifpr.com.br:3052/deletarUsuario/${idUsuario}`)
        .then(response => {
            console.log('Usuario excluido com suceso')
            buscarDadosEPreencherTabela();
        })
        .catch(error => {
            console.error('Erro ao deletar: ', error);
        });
}

document.addEventListener('click', function (event) {

    if (event.target && event.target.classList.contains('btn-delete')) {
        const idUsuario = event.target.dataset.id;
        deletarUsuario(idUsuario);
    }
});

function cadastrarUsuario(nome, email, disciplina, senha) {
    console.log('Dados capturados para cadastro: ')
    console.log('Nome:', nome);
    console.log('Email:', email);
    console.log('Disciplina:', disciplina);
    console.log('Senha:', senha);

    const novoUsuario = {
        nome: nome,
        email: email,
        disciplina: disciplina,
        senha: senha
    };

    axios.post('http://infopguaifpr.com.br:3052/cadastrarUsuario', novoUsuario, {
        headers: {

            'Content-Type': 'application/json'
        }
    })
        .then(response => {

            console.log('Usuário cadastrado com sucesso:', response.data);
            $('#cadastrarUsuario').modal('hide');
            alert('Usuario cadastrado com sucesso')
            buscarDadosEPreencherTabela()
        })
        .catch(error => {

            alert('Erro ao cadastrar usuario:', error)
        });
}

document.querySelector('#btnCadastrarUsuario').addEventListener('click', function () {
    const nome = document.querySelector('#nome').value;
    const email = document.querySelector('#email').value;
    const disciplina = document.querySelector('#disciplina').value;
    const senha = document.querySelector('#senha').value;

    cadastrarUsuario(nome, email, disciplina, senha);
});