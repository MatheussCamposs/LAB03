class Aluno {
    constructor(nome, idade, curso, notaFinal) {
        this.nome = nome;
        this.idade = idade;
        this.curso = curso;
        this.notaFinal = notaFinal;
    }

    isAprovado() {
        return this.notaFinal >= 7;
    }

    toString() {
        return `Nome: ${this.nome}, Idade: ${this.idade}, Curso: ${this.curso}, Nota Final: ${this.notaFinal.toFixed(1)} (${this.isAprovado() ? "Aprovado" : "Reprovado"})`;
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
        document.getElementById('btrelatorio').addEventListener('click', () => this.gerarRelatorio());
    }

    salvar(e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value;
        const idade = parseInt(document.getElementById('idade').value);
        const cursoRadio = document.querySelector('input[name="curso"]:checked');
        const nota = parseFloat(document.getElementById("nota").value);

        const curso = cursoRadio.value;
        const aluno = new Aluno(nome, idade, curso, nota);

        if (this.editando) {
            this.alunos[this.indexEditando] = aluno;
            this.editando = false;
            this.indexEditando = null;
            document.getElementById('btsalvar').value = "Salvar";
            console.log("Alteração feita com sucesso!");
        } else {
            this.alunos.push(aluno);
            console.log("Aluno cadastrado com sucesso!");
        }

        this.atualizarTabela();
        this.limpaFormulario();
    }

    atualizarTabela() {
        const tabela = document.getElementById("tabela");
        tabela.innerHTML = "";

        this.alunos.forEach((aluno, index) => {
            const row = tabela.insertRow();

            row.insertCell(0).innerText = index + 1;
            row.insertCell(1).innerText = aluno.nome;
            row.insertCell(2).innerText = aluno.idade;
            row.insertCell(3).innerText = aluno.curso;
            row.insertCell(4).innerText = aluno.notaFinal.toFixed(1);
            row.insertCell(5).innerText = aluno.isAprovado() ? "Aprovado" : "Reprovado";

            const actionCell = row.insertCell(6);

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
        document.getElementById('nota').value = aluno.notaFinal;

        this.alunos.splice(index, 1);
        this.editando = true;
        this.indexEditando = index;
        document.getElementById('btsalvar').value = "Salvar Edição";
        this.atualizarTabela();
    }

    excluir(index) {
        this.alunos.splice(index, 1);
        console.log("Aluno excluído com sucesso!");
        this.atualizarTabela();
    }

    limpaFormulario() {
        document.getElementById('nome').value = '';
        document.getElementById('idade').value = '';
        document.querySelectorAll('input[name="curso"]').forEach(el => el.checked = false);
        document.getElementById('nota').value = '';
    }

    gerarRelatorio() {
        const relatorioEl = document.getElementById('relatorio');
        relatorioEl.innerHTML = '';
        const aprovados = this.alunos.filter(aluno => aluno.isAprovado());
        const aprovadosLista = document.createElement('ul');
        aprovados.forEach(aluno => {
            const li = document.createElement('li');
            li.textContent = aluno.toString();
            aprovadosLista.appendChild(li);
        });
        relatorioEl.appendChild(document.createTextNode('Alunos Aprovados:'));
        relatorioEl.appendChild(aprovadosLista);

        let mediaNotas = 0;
        if(this.alunos.length > 0) {
            mediaNotas = this.alunos.reduce((soma, aluno) => soma + aluno.notaFinal, 0);
            mediaNotas /= this.alunos.length;
        }
        const mediaNotasP = document.createElement('p');
        mediaNotasP.textContent = `Média das notas: ${mediaNotas.toFixed(2)}`;
        relatorioEl.appendChild(mediaNotasP);

        let mediaIdades = 0;
        if(this.alunos.length > 0) {
            mediaIdades = this.alunos.reduce((soma, aluno) => soma + aluno.idade, 0);
            mediaIdades /= this.alunos.length;
        }
        const mediaIdadesP = document.createElement('p');
        mediaIdadesP.textContent = `Média das idades: ${mediaIdades.toFixed(1)} anos`;
        relatorioEl.appendChild(mediaIdadesP);
        console.log(mediaIdades);

        const nomesOrdenados = this.alunos.map(aluno => aluno.nome).sort();
        const nomesLista = document.createElement('ul');
        nomesOrdenados.forEach(nome => {
            const li = document.createElement('li');
            li.textContent = nome;
            nomesLista.appendChild(li);
        });
        relatorioEl.appendChild(document.createTextNode('Nomes em ordem alfabética:'));
        relatorioEl.appendChild(nomesLista);

        const alunosPorCurso = {};
        this.alunos.forEach(aluno => {
            const curso = aluno.curso;
            alunosPorCurso[curso] = (alunosPorCurso[curso] || 0) + 1;
        });
        const cursosLista = document.createElement('ul');
        for (const curso in alunosPorCurso) {
            const li = document.createElement('li');
            li.textContent = `${curso}: ${alunosPorCurso[curso]} aluno(s)`;
            cursosLista.appendChild(li);
        }
        relatorioEl.appendChild(document.createTextNode('Alunos por curso:'));
        relatorioEl.appendChild(cursosLista);
    };

}

new AlunoController();

