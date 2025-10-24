class Aluno {
    constructor(nome, idade, curso, nota) {
        this.nome = nome;
        this.idade = idade;
        this.curso = curso;
        this.nota = nota;
    }
}

class AlunoController {
    constructor() {
        this.alunos = [];
        this.editando = false;
        this.indexEditando = null;
        this.init();
    }

    init() {
        document.getElementById('btsalvar').addEventListener("click", (e) => this.salvar(e));
    }

    salvar(e) {
        e.preventDefault();

        let nome = document.getElementById('nome').value.trim();
        let idade = document.getElementById('idade').value.trim();
        let cursoRadio = document.querySelector('input[name="curso"]:checked');
        let nota = parseFloat(document.getElementById("nota").value);
        let curso = cursoRadio.value;
        const aluno = new Aluno(nome, idade, curso, nota);

        if (this.editando) {
            this.alunos.splice(this.indexEditando, 0, aluno);
            this.editando = false;
            this.indexEditando = null;
            document.getElementById('btsalvar').value = "Salvar"; 
        } else {
            this.alunos.push(aluno);
        }

        this.atualizarTabela();
        this.limpaFormulario();
    }

    atualizarTabela() {
        const tabela = document.getElementById("tabela");
        tabela.innerHTML = "";

        this.alunos.forEach((aluno, index) => {
            let row = tabela.insertRow();

            row.insertCell(0).innerText = index + 1;
            row.insertCell(1).innerText = aluno.nome;
            row.insertCell(2).innerText = aluno.idade;
            row.insertCell(3).innerText = aluno.curso;
            row.insertCell(4).innerText = aluno.nota.toFixed(1);

            const actionCell = row.insertCell(5);

            const btEditar = document.createElement("button");
            btEditar.innerText = "Editar";
            btEditar.type = "button";
            btEditar.addEventListener("click", () => this.editar(index));

            const btExcluir = document.createElement("button");
            btExcluir.innerText = "Excluir";
            btExcluir.type = "button";
            btExcluir.addEventListener("click", () => this.excluir(index));

            actionCell.appendChild(btEditar);
            actionCell.appendChild(btExcluir);
        });
    }

    editar(index) {
        const aluno = this.alunos[index];

        document.getElementById('nome').value = aluno.nome;
        document.getElementById('idade').value = aluno.idade;
        document.querySelectorAll('input[name="curso"]').forEach(el => {
            el.checked = el.value === aluno.curso;
        });
        document.getElementById('nota').value = aluno.nota;

        this.alunos.splice(index, 1);
        this.editando = true;
        this.indexEditando = index;
        document.getElementById('btsalvar').value = "Salvar Edição";
        this.atualizarTabela();
    }

    excluir(index) {
        this.alunos.splice(index, 1);
        this.atualizarTabela();
    }

    limpaFormulario() {
        document.getElementById('nome').value = '';
        document.getElementById('idade').value = '';
        document.querySelectorAll('input[name="curso"]').forEach(el => el.checked = false);
        document.getElementById('nota').value = '';
    }

}

new AlunoController();
