/**
 * Controlador Principal de Eventos e Fluxo da Aplicação
 * Projeto: SolarStorage — Gestão Fotovoltaica & Baterias
 */

let idUsinaEmEdicao = null;

// Sincroniza e recarrega toda a interface
const atualizarInterface = async () => {
    const listaUsinas = await apiObterUsinas();

    if (typeof renderizarKPIs === 'function') {
        renderizarKPIs(listaUsinas);
    }

    if (typeof renderizarGrafico === 'function') {
        renderizarGrafico(listaUsinas);
    }

    if (typeof renderizarTabelaUsinas === 'function') {
        renderizarTabelaUsinas(listaUsinas);
    }
};

// Handler de submissão do formulário de Usina
const salvarUsinaHandler = async (e) => {
    e.preventDefault();
    const form = e.target;

    try {
        const campoNome = form.querySelector('#usina-nome') || form.querySelector('#nome');
        const campoPotencia = form.querySelector('#usina-potencia') || form.querySelector('#potencia_kwp');
        const campoTensao = form.querySelector('#usina-tensao') || form.querySelector('#tensao_sistema_v');
        const campoTipo = form.querySelector('#usina-tipo') || form.querySelector('#tipo_sistema');
        const selectUF = form.querySelector('#usina-uf');
        const selectCidade = form.querySelector('#usina-cidade');
        const campoData = form.querySelector('#usina-data') || form.querySelector('#data_instalacao');

        const inputHiddenId = form.querySelector('#usina-id');
        const usinaId = idUsinaEmEdicao || (inputHiddenId ? inputHiddenId.value : null);

        // Monta o nome da cidade formatado (ex: "São Paulo/SP")
        let localizacao = '';
        if (selectCidade && selectCidade.value) {
            localizacao = selectCidade.value;
        } else if (selectUF && selectUF.value) {
            localizacao = selectUF.value;
        }

        const payload = {
            nome: campoNome ? campoNome.value.trim() : '',
            potencia_kwp: campoPotencia ? parseFloat(campoPotencia.value) : 0,
            tensao_sistema_v: campoTensao ? parseFloat(campoTensao.value) : 0,
            tipo_sistema: campoTipo ? campoTipo.value : '',
            cidade: localizacao,
            data_instalacao: campoData ? campoData.value : ''
        };

        if (usinaId) {
            payload.id = parseInt(usinaId, 10);
        }

        const res = usinaId ? await apiEditarUsina(payload) : await apiCadastrarUsina(payload);

        if (res.ok) {
            alert(usinaId ? 'Usina atualizada com sucesso!' : 'Usina cadastrada com sucesso!');
            resetarFormularioUsina(form);
            await atualizarInterface();
        } else {
            const erroApi = await res.json();
            alert(`Erro ao processar usina: ${erroApi.message || 'Verifique os dados enviados.'}`);
        }
    } catch (err) {
        console.error('Erro na submissão da usina:', err);
        alert('Falha na comunicação com o servidor Flask.');
    }
};

// Prepara o formulário principal para a edição de uma usina
async function prepararEdicaoUsina(id, nome, potencia, tensao, tipo, cidadeFormatada, dataInstalacao) {
    idUsinaEmEdicao = id;
    const form = document.getElementById('form-usina') || document.getElementById('usina-form');
    if (!form) return;

    let inputId = form.querySelector('#usina-id');
    if (!inputId) {
        inputId = document.createElement('input');
        inputId.type = 'hidden';
        inputId.id = 'usina-id';
        form.appendChild(inputId);
    }
    inputId.value = id;

    const elNome = form.querySelector('#usina-nome') || form.querySelector('#nome');
    const elPotencia = form.querySelector('#usina-potencia') || form.querySelector('#potencia_kwp');
    const elTensao = form.querySelector('#usina-tensao') || form.querySelector('#tensao_sistema_v');
    const elTipo = form.querySelector('#usina-tipo') || form.querySelector('#tipo_sistema');
    const selectUF = form.querySelector('#usina-uf');
    const selectCidade = form.querySelector('#usina-cidade');
    const elData = form.querySelector('#usina-data') || form.querySelector('#data_instalacao');

    if (elNome) elNome.value = nome || '';
    if (elPotencia) elPotencia.value = potencia || '';
    if (elTensao) elTensao.value = tensao || '';
    if (elTipo) elTipo.value = tipo || 'Grid-Tied (On-Grid)';
    if (elData) elData.value = dataInstalacao || '';

    // Separa "Cidade/UF" gravado no banco para preencher os selects encadeados
    if (cidadeFormatada && cidadeFormatada.includes('/')) {
        const partes = cidadeFormatada.split('/');
        const nomeCidade = partes[0].trim();
        const uf = partes[1].trim();

        if (selectUF) {
            selectUF.value = uf;
            // Carrega dinamicamente as cidades do IBGE para a UF selecionada
            await carregarCidadesPorUF(uf, selectCidade, cidadeFormatada);
        }
    }

    // Atualiza a UI do formulário para o modo de Edição
    const tituloForm = document.getElementById('titulo-form-usina');
    if (tituloForm) tituloForm.textContent = 'Editar Usina Solar';

    const btnSalvar = document.getElementById('btn-salvar-usina');
    if (btnSalvar) btnSalvar.textContent = 'Salvar Alterações';

    const btnCancelar = document.getElementById('btn-cancelar-usina');
    if (btnCancelar) btnCancelar.style.display = 'inline-block';

    form.scrollIntoView({ behavior: 'smooth' });
}

// Reseta o formulário de usina de volta ao modo de cadastro
function resetarFormularioUsina(form) {
    idUsinaEmEdicao = null;
    if (form) {
        form.reset();
        const inputId = form.querySelector('#usina-id');
        if (inputId) inputId.value = '';

        const selectCidade = form.querySelector('#usina-cidade');
        if (selectCidade) {
            selectCidade.innerHTML = '<option value="" disabled selected>Selecione primeiro a UF...</option>';
            selectCidade.disabled = true;
        }

        const tituloForm = document.getElementById('titulo-form-usina');
        if (tituloForm) tituloForm.textContent = 'Cadastrar Nova Usina Solar';

        const btnSalvar = document.getElementById('btn-salvar-usina');
        if (btnSalvar) btnSalvar.textContent = 'Cadastrar Usina';

        const btnCancelar = document.getElementById('btn-cancelar-usina');
        if (btnCancelar) btnCancelar.style.display = 'none';
    }
}

// Função auxiliar para carregar cidades do IBGE via API
async function carregarCidadesPorUF(uf, selectCidade, valorSelecionado = null) {
    if (!selectCidade) return;

    selectCidade.innerHTML = '<option value="" disabled selected>Carregando cidades...</option>';
    selectCidade.disabled = true;

    try {
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`);
        const cidades = await response.json();

        selectCidade.innerHTML = '<option value="" disabled selected>Selecione a cidade...</option>';
        cidades.forEach(cidade => {
            const valorOption = `${cidade.nome}/${uf}`;
            const option = document.createElement('option');
            option.value = valorOption;
            option.textContent = cidade.nome;
            selectCidade.appendChild(option);
        });

        selectCidade.disabled = false;

        if (valorSelecionado) {
            selectCidade.value = valorSelecionado;
        }
    } catch (error) {
        console.error('Erro ao carregar cidades do IBGE:', error);
        selectCidade.innerHTML = '<option value="" disabled selected>Erro ao carregar cidades</option>';
    }
}

// Abertura do modal para cadastrar NOVA BATERIA
function abrirNovaBateriaModal(usinaId) {
    const form = document.getElementById('form-bateria');
    if (form) form.reset();

    const tituloModal = document.getElementById('titulo-modal-bateria') || document.querySelector('#modal-bateria h3');
    if (tituloModal) tituloModal.textContent = 'Adicionar Banco de Baterias';

    const elId = document.getElementById('bateria-id');
    const elUsinaId = document.getElementById('bateria-usina-id');
    if (elId) elId.value = '';
    if (elUsinaId) elUsinaId.value = usinaId;

    const modal = document.getElementById('modal-bateria');
    if (modal) modal.style.display = 'block';
}

// Abertura do modal para EDITAR BATERIA EXISTENTE
function abrirEdicaoBateria(id, usinaId, tecnologia, capacidade, tensao, dod, quantidade) {
    const tituloModal = document.getElementById('titulo-modal-bateria') || document.querySelector('#modal-bateria h3');
    if (tituloModal) tituloModal.textContent = 'Editar Banco de Baterias';

    const elId = document.getElementById('bateria-id');
    const elUsinaId = document.getElementById('bateria-usina-id');
    const elTecnologia = document.getElementById('bateria-tecnologia') || document.getElementById('bat-tecnologia');
    const elCapacidade = document.getElementById('bateria-capacidade') || document.getElementById('bat-capacidade');
    const elTensao = document.getElementById('bateria-tensao') || document.getElementById('bat-tensao');
    const elDod = document.getElementById('bateria-dod') || document.getElementById('bat-dod');
    const elQuantidade = document.getElementById('bateria-quantidade') || document.getElementById('bat-quantidade');

    if (elId) elId.value = id;
    if (elUsinaId) elUsinaId.value = usinaId;
    if (elCapacidade) elCapacidade.value = capacidade;
    if (elTensao) elTensao.value = tensao;
    if (elDod) elDod.value = dod;
    if (elQuantidade) elQuantidade.value = quantidade;

    if (elTecnologia) {
        let opcaoExiste = false;
        for (let i = 0; i < elTecnologia.options.length; i++) {
            if (elTecnologia.options[i].value === tecnologia) {
                opcaoExiste = true;
                break;
            }
        }
        if (!opcaoExiste && tecnologia) {
            const novaOpcao = document.createElement('option');
            novaOpcao.value = tecnologia;
            novaOpcao.textContent = tecnologia;
            elTecnologia.appendChild(novaOpcao);
        }
        elTecnologia.value = tecnologia;
    }

    const modal = document.getElementById('modal-bateria');
    if (modal) modal.style.display = 'block';
}

// Ações de exclusão
const acaoExcluirUsina = async (id) => {
    if (!confirm('Deseja realmente excluir esta usina e todos os seus módulos de bateria?')) return;
    const res = await apiDeletarUsina(id);
    if (res.ok) await atualizarInterface();
};

const acaoRemoverBateria = async (id) => {
    if (!confirm('Deseja remover este banco de baterias?')) return;
    const res = await apiDeletarBateria(id);
    if (res.ok) await atualizarInterface();
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const formUsina = document.getElementById('form-usina') || document.getElementById('usina-form');
    if (formUsina) {
        formUsina.addEventListener('submit', salvarUsinaHandler);
    }

    // Configuração dos selects de UF e Cidade (IBGE)
    const selectUF = document.getElementById('usina-uf');
    const selectCidade = document.getElementById('usina-cidade');
    if (selectUF && selectCidade) {
        selectUF.addEventListener('change', (e) => {
            carregarCidadesPorUF(e.target.value, selectCidade);
        });
    }

    const formBateria = document.getElementById('form-bateria');
    if (formBateria) {
        formBateria.addEventListener('submit', async (e) => {
            e.preventDefault();
            const bateriaId = document.getElementById('bateria-id')?.value || null;
            const usinaId = document.getElementById('bateria-usina-id')?.value;

            const elTecnologia = document.getElementById('bateria-tecnologia') || document.getElementById('bat-tecnologia');
            const elCapacidade = document.getElementById('bateria-capacidade') || document.getElementById('bat-capacidade');
            const elTensao = document.getElementById('bateria-tensao') || document.getElementById('bat-tensao');
            const elDod = document.getElementById('bateria-dod') || document.getElementById('bat-dod');
            const elQuantidade = document.getElementById('bateria-quantidade') || document.getElementById('bat-quantidade');

            const payload = {
                usina_id: parseInt(usinaId, 10),
                tecnologia: elTecnologia ? elTecnologia.value : 'LiFePO4',
                capacidade_ah: elCapacidade ? parseFloat(elCapacidade.value) : 0,
                tensao_nominal_v: elTensao ? parseFloat(elTensao.value) : 0,
                dod_percentual: elDod ? parseFloat(elDod.value) : 80,
                quantidade: elQuantidade ? parseInt(elQuantidade.value, 10) : 1
            };

            const res = await apiSalvarBateria(payload, bateriaId);
            if (res.ok) {
                alert(bateriaId ? "Bateria atualizada com sucesso!" : "Bateria cadastrada com sucesso!");
                const modal = document.getElementById('modal-bateria');
                if (modal) modal.style.display = 'none';
                await atualizarInterface();
            } else {
                alert("Erro ao salvar bateria.");
            }
        });
    }

    atualizarInterface();
});