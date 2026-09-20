/*
 * Módulo de Comunicação HTTP / API RESTful
 * Projeto: SolarStorage — Gestão Fotovoltaica & Baterias
 */

const API_BASE_URL = 'http://127.0.0.1:5000';

// === ROTAS DE USINA ===

// GET /usinas - Buscar lista completa
async function apiObterUsinas() {
    try {
        const response = await fetch(`${API_BASE_URL}/usinas`);
        if (!response.ok) throw new Error('Falha ao buscar usinas.');
        const data = await response.json();
        return data.usinas || [];
    } catch (error) {
        console.error('Erro em apiObterUsinas:', error);
        return [];
    }
}


// POST /usina - Cadastrar nova usina
async function apiCadastrarUsina(payload) {
    try {
        const response = await fetch(`${API_BASE_URL}/usina`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return response;
    } catch (error) {
        console.error('Erro em apiCadastrarUsina:', error);
        throw error;
    }
}

// PUT /usina?id=X - Editar usina existente
async function apiEditarUsina(payload) {
    try {
        const response = await fetch(`${API_BASE_URL}/usina?id=${payload.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return response;
    } catch (error) {
        console.error('Erro em apiEditarUsina:', error);
        throw error;
    }
}

// DELETE /usina?id=X - Excluir usina
async function apiDeletarUsina(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/usina?id=${id}`, {
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        console.error('Erro em apiDeletarUsina:', error);
        throw error;
    }
}


// === ROTAS DE BATERIA ===

// POST /bateria (Cadastrar) ou PUT /bateria?id=X (Atualizar)
async function apiSalvarBateria(payload, bateriaId = null) {
    const isEdit = Boolean(bateriaId);
    const url = isEdit ? `${API_BASE_URL}/bateria?id=${bateriaId}` : `${API_BASE_URL}/bateria`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return response;
    } catch (error) {
        console.error('Erro em apiSalvarBateria:', error);
        throw error;
    }
}

// DELETE /bateria?id=X - Excluir bateria individual
async function apiDeletarBateria(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/bateria?id=${id}`, {
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        console.error('Erro em apiDeletarBateria:', error);
        throw error;
    }
}