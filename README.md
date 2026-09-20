☀️ SolarStorage Frontend — Single Page Application (SPA)

Dashboard Single Page Application (SPA) moderno, reativo e responsivo construído em **Vanilla JS (ES6+)**, **HTML5** e **CSS3** para monitoramento em tempo real de **Usinas Fotovoltaicas** e **Sistemas BESS (Armazenamento em Baterias)**.

---

## 🚀 Tecnologias Utilizadas

* **HTML5 & CSS3** — Interface SaaS Dark Theme responsiva com CSS Variables e ícones SVG.
* **JavaScript ES6+ (Vanilla JS / Fetch API)** — Comunicação reativa e assíncrona sem recarregamento da página (*sem F5*).
* **API de Localidades do IBGE** — População dinâmica de Estados (UF) e Municípios brasileiros.
* **Chart.js** — Renderização de gráficos comparativos de Potência ($kWp$) vs Armazenamento ($kWh$).

---

## 🎨 Funcionalidades & Diferenciais da Interface

* **Padrão SPA sem Frameworks (Pure Vanilla JS):** Manipulação reativa do DOM via `Async/Await` sem nenhuma dependência de React, Vue ou Angular.
* **Design SaaS Dark Theme:** Paleta escura técnica (`#0f172a` e `#1e293b`) com cards iluminados em neon.
* **KPIs Indicadores:** Atualização dinâmica de totais de usinas, potência acumulada em $kWp$ e energia útil total em $kWh$.
* **Integração Dinâmica com IBGE:** Seletores de Estado (UF) e Cidade encadeados que buscam os dados da API oficial do IBGE.
* **Visualização Gráfica Interativa:** Comparativo de geração solar vs capacidade de armazenamento utilizando Chart.js.
* **Badges Visuais para Auditoria:** Identificação clara dos IDs de usinas e baterias para simplificar a validação das rotas REST no Swagger.

---

## 📁 Estrutura de Arquivos

```text
solarstorage-frontend/
├── css/
│   ├── global.css        # Variáveis CSS, resets e estrutura geral
│   └── components.css    # Estilos de formulários, tabelas, modais e cards
├── javascript/
│   ├── api.js            # Módulo de comunicação HTTP RESTful (Fetch API)
│   ├── render.js         # Manipulação do DOM (Renderização de KPIs e Tabela)
│   ├── chart.js          # Configuração do Chart.js
│   └── main.js           # Gerenciamento de eventos, modais e fluxo principal
├── index.html            # Estrutura principal da SPA
└── README.md             # Documentação do projeto
```

---

## 🌐 Consumo de Rotas da API RESTful

O módulo `javascript/api.js` consome todas as rotas da API em `http://127.0.0.1:5000`:

* **`GET /usinas`:** Atualiza o dashboard, KPIs e gráfico ao carregar.
* **`GET /usina?id={id}`:** Busca detalhes da usina selecionada.
* **`POST /usina`:** Cadastra novas usinas via formulário principal.
* **`PUT /usina?id={id}`:** Atualiza especificações técnicas da usina em modo de edição.
* **`DELETE /usina?id={id}`:** Remove a usina e expurga suas baterias filhas.
* **`POST /bateria` & `PUT /bateria?id={id}`:** Cadastra e altera módulos BESS via modal.
* **`DELETE /bateria?id={id}`:** Exclui baterias individualmente na tabela.

---

## ⚙️ Como Executar

Esta aplicação **não necessita de NENHUMA etapa de compilação (*build*)**, Node.js ou dependências npm.

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/solarstorage-frontend.git
   cd solarstorage-frontend
   ```

2. Abra o arquivo **`index.html`** diretamente em seu navegador (Google Chrome, Microsoft Edge, Firefox, Brave).

> **Atenção:** Certifique-se de que a API RESTful (`solarstorage-api`) esteja em execução no endereço `http://127.0.0.1:5000` para que os dados sejam carregados e persistidos corretamente.