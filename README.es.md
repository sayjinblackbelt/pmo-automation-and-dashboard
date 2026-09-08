# ⚙️ PMO Automation and Dashboard

[🇧🇷 Português](README.md) | [🇺🇸 English](README.en.md) | 🇪🇸 Español

> **PMO · Governança Documental · Python · Automação · Dados · Dashboard · CI/CD**

## Sobre el proyecto

Este proyecto comenzó en **2024**, a partir de una **demanda real identificada durante mi trabajo con un equipo de PMO**.

La necesidad inicial estaba relacionada con la organización de información, el seguimiento documental y el apoyo al control de actividades y requisitos. Con el tiempo, esta experiencia práctica evolucionó hacia un proyecto independiente de estudio, experimentación y desarrollo de soluciones automatizadas.

Actualmente, el repositorio funciona como un **caso técnico en desarrollo continuo**, conectando la experiencia profesional en PMO con desarrollo en Python, análisis de datos, automatización, indicadores y paneles de control.

> **Estado:** 🟡 En desarrollo continuo desde 2024.

## 🎯 Lo que demuestra este proyecto

| Area | Demonstration |
|---|---|
| PMO | tracking, metrics, and prioritization |
| Governança documental | organization, status, review, and requirements |
| Dados | structured CSV and validation |
| Python | automated generation and analysis |
| Qualidade | inconsistency detection |
| Risco | document scoring and classification |
| Tendências | temporal evolution and simple projection |
| Web | HTML, CSS, and JavaScript |
| DevOps | GitHub Actions and GitHub Pages |

## 🗓️ Evolución del proyecto

```text
2024
  ↓
Real demand in a PMO environment
  ↓
Identification of repetitive tasks and control needs
  ↓
Automation experimentation
  ↓
Data and metrics structuring
  ↓
Dashboards and document analysis
  ↓
2026
  ↓
Independent technical case under continuous development
```

The current implementation does not reproduce the original environment. Published data, examples, and artifacts were rebuilt for technical demonstration purposes.

## 🏗️ Arquitectura

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

### PMO dashboard

- documentos e status;
- progresso documental;
- requisitos concluídos;
- índice geral demonstrativo;
- gráficos por disciplina e status.

### Document analysis

A camada atual utiliza regras heurísticas transparentes para:

- verificar campos obrigatórios;
- identificar inconsistências entre status e progresso;
- atribuir score de qualidade;
- registrar alertas estruturados.

### Risk and priorities

Cada documento pode receber:

- score de risco;
- nível **Baixo**, **Médio** ou **Alto**;
- posição na lista de prioridades.

Também é calculado um **índice demonstrativo de risco do projeto**.

### Temporal trends

O módulo temporal acompanha:

- evolução do progresso;
- tendência do risco;
- documentos concluídos;
- projeção linear simples de conclusão.

> A previsão é demonstrativa e não substitui planejamento profissional.

## 📁 Estructura del repositorio

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

## 💻 Ejecutar localmente

### Install dependencies

```bash
pip install -r automation/requirements.txt
```

### Run analyses

```bash
python automation/validate_data.py
python automation/generate_visual_dashboard.py
python automation/analyze_documents.py
python automation/project_trend_analysis.py
python automation/verify_output.py
```

### View the interface

```bash
python -m http.server 8000
```

## 🧩 Decisiones técnicas

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

## 🚀 Próximas evoluciones

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

## 👤 Contexto profesional

O projeto surgiu de uma experiência profissional real em **PMO**, relacionada a organização documental, acompanhamento de fluxos, consolidação de informações e apoio à elaboração e controle de documentos e projetos técnicos.

A partir dessa experiência, o trabalho evoluiu para um ambiente independente de experimentação e desenvolvimento, permitindo testar abordagens de automação e análise sem expor documentação proprietária.

## 🔒 Confidencialidad

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

## 🛠️ Tecnologías

**Python · CSV · HTML · CSS · JavaScript · GitHub · GitHub Actions · GitHub Pages**

**Purpose:** a continuously evolving technical case and practical demonstration of skills in PMO, automation, data, and solution development.


---

## Autor

**Filipe G Morais**

GitHub: https://github.com/sayjinblackbelt  
Repository: https://github.com/sayjinblackbelt/pmo-automation-and-dashboard
