# ⚙️ PMO Automation and Dashboard

🇧🇷 Português | [🇺🇸 English](README.en.md) | [🇪🇸 Español](README.es.md)

> **PMO · Governança Documental · Python · Automação · Dados · Dashboard · CI/CD**

## Sobre o projeto

Este projeto nasceu em **2024**, a partir de uma **demanda real identificada durante minha atuação em uma equipe de PMO**.

A necessidade inicial estava relacionada à organização de informações, acompanhamento documental e apoio ao controle de atividades e requisitos. Com o tempo, a experiência prática foi transformada em um projeto próprio de estudo, experimentação e desenvolvimento de soluções automatizadas.

Hoje, o repositório funciona como um **case técnico em evolução contínua**, conectando experiência profissional em PMO com desenvolvimento em Python, análise de dados, automação, indicadores e dashboards.

> **Status:** 🟡 Em desenvolvimento contínuo desde 2024.

## 🎯 O que este projeto demonstra

| Área | Demonstração |
|---|---|
| PMO | acompanhamento, indicadores e priorização |
| Governança documental | organização, status, revisão e requisitos |
| Dados | CSV estruturado e validação |
| Python | geração e análise automatizada |
| Qualidade | identificação de inconsistências |
| Risco | score e classificação documental |
| Tendências | evolução temporal e projeção simples |
| Web | HTML, CSS e JavaScript |
| DevOps | GitHub Actions e GitHub Pages |

## 🗓️ Evolução do projeto

```text
2024
  ↓
Demanda real em ambiente de PMO
  ↓
Identificação de tarefas repetitivas e necessidades de controle
  ↓
Experimentação de automações
  ↓
Estruturação de dados e indicadores
  ↓
Dashboards e análise documental
  ↓
2026
  ↓
Case técnico independente em desenvolvimento contínuo
```

A proposta atual não reproduz o ambiente original. Os dados, exemplos e artefatos publicados foram reconstruídos para demonstração técnica.

## 🏗️ Arquitetura

```text
┌──────────────────────────────┐
│ Dados fictícios estruturados │
│ CSV                          │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ Validação de dados           │
│ Python                       │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────────┐
│ Camada de análise                │
│ • qualidade documental           │
│ • inconsistências                │
│ • risco e prioridades            │
│ • tendências temporais           │
└──────────────┬───────────────────┘
               ↓
┌──────────────────────────────┐
│ Artefatos JSON e gráficos    │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ Dashboard Web                │
│ HTML + CSS + JavaScript      │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ GitHub Actions               │
│ Build + validação + deploy   │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ GitHub Pages                 │
└──────────────────────────────┘
```

## 📊 Funcionalidades

### Dashboard de PMO

- documentos e status;
- progresso documental;
- requisitos concluídos;
- índice geral demonstrativo;
- gráficos por disciplina e status.

### Análise documental

A camada atual utiliza regras heurísticas transparentes para:

- verificar campos obrigatórios;
- identificar inconsistências entre status e progresso;
- atribuir score de qualidade;
- registrar alertas estruturados.

### Risco e prioridades

Cada documento pode receber:

- score de risco;
- nível **Baixo**, **Médio** ou **Alto**;
- posição na lista de prioridades.

Também é calculado um **índice demonstrativo de risco do projeto**.

### Tendências temporais

O módulo temporal acompanha:

- evolução do progresso;
- tendência do risco;
- documentos concluídos;
- projeção linear simples de conclusão.

> A previsão é demonstrativa e não substitui planejamento profissional.

## 📁 Estrutura do repositório

```text
pmo-automation-and-dashboard/
├── automation/
│   ├── sample_data/
│   ├── validate_data.py
│   ├── generate_visual_dashboard.py
│   ├── document_analysis.py
│   ├── project_trend_analysis.py
│   └── verify_output.py
├── docs/
│   ├── análise documental
│   └── análise temporal
├── portfolio/
│   └── competências e contexto do case
├── web/
│   ├── index.html
│   ├── app.js
│   └── style.css
└── .github/workflows/
    └── pages.yml
```

## 🔄 Pipeline automatizado

```text
Push no repositório
        ↓
Instalação de dependências
        ↓
Validação dos dados
        ↓
Geração dos indicadores
        ↓
Análise documental
        ↓
Análise de risco
        ↓
Análise temporal
        ↓
Verificação dos outputs
        ↓
Build do site
        ↓
Deploy no GitHub Pages
```

## 💻 Executar localmente

### Instalar dependências

```bash
pip install -r automation/requirements.txt
```

### Executar análises

```bash
python automation/validate_data.py
python automation/generate_visual_dashboard.py
python automation/analyze_documents.py
python automation/project_trend_analysis.py
python automation/verify_output.py
```

### Visualizar a interface

```bash
python -m http.server 8000
```

## 🧩 Decisões técnicas

### Por que CSV?

O CSV facilita:

- leitura humana;
- versionamento;
- reprodução do case;
- integração futura com planilhas ou APIs.

### Por que regras heurísticas antes de IA?

Uma base determinística permite:

- resultados reproduzíveis;
- transparência;
- testes simples;
- menor dependência de serviços externos.

A arquitetura permite evoluir posteriormente para modelos de IA.

### Por que GitHub Actions?

Para demonstrar um fluxo próximo a práticas reais de engenharia:

- automação;
- validação;
- build;
- publicação contínua.

## 🚀 Próximas evoluções

- banco de dados;
- API;
- integração com Google Sheets;
- histórico persistente;
- alertas automáticos;
- autenticação;
- comparação entre revisões;
- análise de documentos por IA;
- classificação automática;
- geração de resumo executivo.

## 👤 Contexto profissional

O projeto surgiu de uma experiência profissional real em **PMO**, relacionada a organização documental, acompanhamento de fluxos, consolidação de informações e apoio à elaboração e controle de documentos e projetos técnicos.

A partir dessa experiência, o trabalho evoluiu para um ambiente independente de experimentação e desenvolvimento, permitindo testar abordagens de automação e análise sem expor documentação proprietária.

## 🔒 Confidencialidade

Todo o conteúdo publicado é:

- genérico;
- reconstruído para fins de portfólio;
- baseado em dados fictícios ou simulados;
- sem informações operacionais confidenciais;
- sem documentos internos;
- sem fornecedores, contratos ou valores;
- sem projetos proprietários.

Responsabilidades técnicas formais, cálculos, validações e aprovações pertencem aos profissionais legalmente habilitados e às áreas responsáveis.

---

## 🛠️ Tecnologias

**Python · CSV · HTML · CSS · JavaScript · GitHub · GitHub Actions · GitHub Pages**

**Finalidade:** case técnico de evolução contínua e demonstração prática de competências em PMO, automação, dados e desenvolvimento de soluções.

---

## Author

**Filipe G Morais**

GitHub: https://github.com/sayjinblackbelt  
Repository: https://github.com/sayjinblackbelt/pmo-automation-and-dashboard

<!-- CI validation trigger: portfolio standardization -->
