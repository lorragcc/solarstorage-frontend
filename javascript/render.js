/**
 * Módulo de Renderização de Interface (Tabela e Cards)
 * Projeto: SolarStorage — Gestão Fotovoltaica & Baterias
 */

// Atualiza os 3 cards de KPI no topo da tela
const renderizarKPIs = (listaUsinas) => {
    let potenciaTotal = 0;
    let armazTotal = 0;

    if (Array.isArray(listaUsinas)) {
        listaUsinas.forEach(u => {
            potenciaTotal += Number(u.potencia_kwp) || 0;
            const kwhUsina = Number(u.total_kwh_armazenado !== undefined ? u.total_kwh_armazenado : u.capacidade_util_total_kwh) || 0;
            armazTotal += kwhUsina;
        });
    }

    const elTotalUsinas = document.getElementById('total-usinas') || document.getElementById('totalUsinas');
    const elTotalPotencia = document.getElementById('total-potencia') || document.getElementById('totalPotencia');
    const elTotalArmazenamento = document.getElementById('total-armazenamento') || document.getElementById('totalArmazenamento');

    if (elTotalUsinas) elTotalUsinas.textContent = listaUsinas ? listaUsinas.length : 0;
    if (elTotalPotencia) elTotalPotencia.textContent = potenciaTotal.toFixed(1);
    if (elTotalArmazenamento) elTotalArmazenamento.textContent = armazTotal.toFixed(2);
};

// Renderiza as usinas e baterias dentro do <tbody> da Tabela HTML
const renderizarTabelaUsinas = (usinas) => {
    const tbody = document.getElementById('tabela-usinas-body') || document.querySelector('table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!usinas || usinas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px;">Nenhuma usina cadastrada no momento.</td></tr>`;
        return;
    }

    usinas.forEach(usina => {
        // Formata a localização substituindo ", " por "/" caso venha no formato "Cidade, UF"
        const localFormatado = usina.cidade ? usina.cidade.replace(', ', '/') : '';

        let bateriasHtml = '';
        
        if (usina.baterias && usina.baterias.length > 0) {
            bateriasHtml = usina.baterias.map(b => {
                const kwhBateria = b.capacidade_util_kwh !== undefined ? b.capacidade_util_kwh : (b.energia_util_kwh || 0);
                const tecEscaped = (b.tecnologia || 'LiFePO4').replace(/'/g, "\\'");
                return `
                <div class="bateria-item" style="margin-bottom: 6px; padding: 6px 10px; background: rgba(30, 41, 59, 0.7); border-radius: 6px; border: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; gap: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="background: #0284c7; color: #ffffff; padding: 2px 7px; border-radius: 12px; font-size: 0.75rem; font-weight: 700; white-space: nowrap;" title="ID da Bateria no Banco de Dados">
                            ID Bat: ${b.id}
                        </span>
                        <span style="font-size: 0.88rem;">⚡ <strong>${b.quantidade}x</strong> ${b.tecnologia} (${kwhBateria} kWh)</span>
                    </div>
                    <div style="display: flex; gap: 4px; flex-shrink: 0;">
                        <button class="btn-sm btn-warning" style="padding: 2px 6px; font-size: 0.75rem;" onclick="abrirEdicaoBateria(${b.id}, ${usina.id}, '${tecEscaped}', ${b.capacidade_ah || 100}, ${b.tensao_nominal_v || usina.tensao_sistema_v}, ${b.dod_percentual || 80}, ${b.quantidade || 1})" title="Editar esta bateria">✏️ Editar</button>
                        <button class="btn-sm btn-danger" style="padding: 2px 6px; font-size: 0.75rem;" onclick="acaoRemoverBateria(${b.id})" title="Remover esta bateria">✕</button>
                    </div>
                </div>
            `;
            }).join('');
        } else {
            bateriasHtml = '<em style="color: #64748b; font-size: 0.85rem;">Sem baterias vinculadas</em>';
        }

        const totalKwhUsina = usina.total_kwh_armazenado !== undefined ? usina.total_kwh_armazenado : (usina.capacidade_util_total_kwh || 0);
        const nomeEscaped = (usina.nome || '').replace(/'/g, "\\'");
        const cidadeEscaped = (usina.cidade || '').replace(/'/g, "\\'");
        const tipoEscaped = (usina.tipo_sistema || '').replace(/'/g, "\\'");
        const dataEscaped = (usina.data_instalacao || '').replace(/'/g, "\\'");

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                    <span style="background: #f59e0b; color: #000000; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 800; white-space: nowrap;" title="ID da Usina no Banco de Dados">
                        ID Usina: ${usina.id}
                    </span>
                    <strong style="font-size: 1rem; color: #f8fafc;">${usina.nome}</strong>
                </div>
                <small style="color: #94a3b8; margin-left: 2px;">${localFormatado}</small>
            </td>
            <td>${usina.tipo_sistema || ''}</td>
            <td>${usina.potencia_kwp} kWp</td>
            <td><strong>${totalKwhUsina} kWh</strong></td>
            <td>${bateriasHtml}</td>
            <td>
                <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                    <button class="btn-sm btn-primary" onclick="abrirNovaBateriaModal(${usina.id}, '${nomeEscaped}')">+ Bateria</button>
                    <button class="btn-sm btn-secondary" onclick="prepararEdicaoUsina(${usina.id}, '${nomeEscaped}', ${usina.potencia_kwp}, ${usina.tensao_sistema_v}, '${tipoEscaped}', '${cidadeEscaped}', '${dataEscaped}')">✏️ Editar Usina</button>
                    <button class="btn-sm btn-danger" onclick="acaoExcluirUsina(${usina.id})">Excluir Usina</button>
                </div>
            </td>
        `;

        tbody.appendChild(tr);
    });
};
