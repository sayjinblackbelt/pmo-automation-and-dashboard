async function loadDashboardData() {
  try {
    const responses = await Promise.all([
      fetch("automation/sample_data/project_documents.csv"),
      fetch("automation/sample_data/project_requirements.csv"),
      fetch("automation/output/document_analysis_report.json"),
      fetch("automation/output/project_trend_report.json")
    ]);

    if (responses.some(response => !response.ok)) {
      throw new Error("Um ou mais artefatos do dashboard não estão disponíveis.");
    }

    const [documentsResponse, requirementsResponse, analysisResponse, trendResponse] = responses;
    const documents = parseCSV(await documentsResponse.text());
    const requirements = parseCSV(await requirementsResponse.text());
    const analysis = await analysisResponse.json();
    const trends = await trendResponse.json();

    const documentProgress = average(documents.map(item => Number(item.progresso)));
    const completed = requirements.filter(item => item.status === "concluido").length;
    const requirementsCompletion = requirements.length ? completed / requirements.length * 100 : 0;
    const overall = (documentProgress + requirementsCompletion) / 2;

    document.getElementById("documents").textContent = documents.length;
    document.getElementById("documentProgress").textContent = documentProgress.toFixed(1) + "%";
    document.getElementById("requirementsCompletion").textContent = requirementsCompletion.toFixed(1) + "%";
    document.getElementById("overall").textContent = overall.toFixed(1) + "%";

    renderAnalysis(analysis);
    renderRisk(analysis);
    renderTrends(trends);
  } catch (error) {
    console.error("Não foi possível carregar os dados demonstrativos.", error);
    document.getElementById("analysisStatus").textContent =
      "Não foi possível carregar os dados publicados do dashboard.";
  }
}

function renderAnalysis(analysis) {
  const results = analysis.resultados || [];
  const alerts = analysis.alertas || [];
  const qualityScore = average(results.map(item => Number(item.score_qualidade)));

  document.getElementById("analyzedDocuments").textContent =
    analysis.documentos_analisados ?? results.length;
  document.getElementById("qualityScore").textContent =
    qualityScore.toFixed(1) + "%";
  document.getElementById("analysisAlerts").textContent = alerts.length;

  const status = document.getElementById("analysisStatus");
  const list = document.getElementById("alertsList");

  if (!alerts.length) {
    status.textContent = "Nenhuma inconsistência foi identificada nos dados demonstrativos.";
    list.innerHTML = "";
    return;
  }

  status.textContent = "Alertas identificados pela análise automatizada:";
  list.innerHTML = alerts.map(alert => `
    <article class="alert-card">
      <strong>${escapeHTML(alert.codigo)}</strong>
      <span>${escapeHTML(alert.tipo)}</span>
      <p>${escapeHTML(alert.mensagem)}</p>
    </article>
  `).join("");
}

function renderTrends(trends) {
  document.getElementById("currentProgress").textContent =
    Number(trends.progresso_atual || 0).toFixed(1) + "%";
  document.getElementById("currentRisk").textContent =
    Number(trends.risco_atual || 0).toFixed(1);
  document.getElementById("completionForecast").textContent =
    trends.previsao_semana_conclusao != null
      ? "Semana " + trends.previsao_semana_conclusao
      : "Indisponível";

  const riskTrend = Number(trends.tendencia_risco_semana || 0);
  const riskText = riskTrend < 0 ? "redução" : riskTrend > 0 ? "aumento" : "estabilidade";

  document.getElementById("trendSummary").textContent =
    `O projeto apresenta evolução média de ${Number(trends.taxa_media_progresso_semana || 0).toFixed(2)} pontos por semana e tendência de ${riskText} do risco (${riskTrend.toFixed(2)} ponto(s)/semana).`;
}

function renderRisk(analysis) {
  const results = analysis.resultados || [];
  const distribution = analysis.distribuicao_risco || {};
  const highRisk = results.filter(item => item.nivel_risco === "Alto").length;

  document.getElementById("projectRisk").textContent =
    Number(analysis.indice_risco_projeto || 0).toFixed(1);
  document.getElementById("highRiskDocuments").textContent = highRisk;
  document.getElementById("riskDistribution").textContent =
    `B: ${distribution.Baixo || 0} · M: ${distribution["Médio"] || 0} · A: ${distribution.Alto || 0}`;

  const priority = analysis.documentos_prioritarios || [];
  const container = document.getElementById("priorityDocuments");

  container.innerHTML = priority.map(item => `
    <article class="priority-card">
      <div>
        <strong>${escapeHTML(item.codigo)}</strong>
        <p>${escapeHTML(item.titulo)}</p>
      </div>
      <div class="risk-badge risk-${String(item.nivel_risco).toLowerCase()}">
        ${escapeHTML(item.nivel_risco)} · ${item.score_risco}
      </div>
    </article>
  `).join("");
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (!lines.length || !lines[0]) return [];

  const headers = lines.shift().split(",");
  return lines.map(line => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function average(values) {
  return values.length
    ? values.reduce((total, value) => total + value, 0) / values.length
    : 0;
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

loadDashboardData();
