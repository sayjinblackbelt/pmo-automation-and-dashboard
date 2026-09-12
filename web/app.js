let dashboardState = {
  documents: [], requirements: [], analysis: null, trends: null, history: [], selectedDocument: null
};

async function loadDashboardData() {
  try {
    const responses = await Promise.all([
      fetch("automation/sample_data/project_documents.csv"),
      fetch("automation/sample_data/project_requirements.csv"),
      fetch("automation/sample_data/project_history.csv"),
      fetch("automation/output/document_analysis_report.json"),
      fetch("automation/output/project_trend_report.json")
    ]);
    if (responses.some(response => !response.ok)) throw new Error("Um ou mais artefatos do dashboard não estão disponíveis.");
    const [documentsResponse, requirementsResponse, historyResponse, analysisResponse, trendResponse] = responses;
    dashboardState.documents = parseCSV(await documentsResponse.text());
    dashboardState.requirements = parseCSV(await requirementsResponse.text());
    dashboardState.history = parseCSV(await historyResponse.text());
    dashboardState.analysis = await analysisResponse.json();
    dashboardState.trends = await trendResponse.json();
    populateFilters();
    renderInteractiveDashboard();
    renderAnalysis(dashboardState.analysis);
    renderRisk(dashboardState.analysis);
    renderTrends(dashboardState.trends);
  } catch (error) {
    console.error("Não foi possível carregar os dados demonstrativos.", error);
    document.getElementById("analysisStatus").textContent = "Não foi possível carregar os dados publicados do dashboard.";
  }
}

function populateFilters() {
  fillSelect("disciplineFilter", uniqueValues(dashboardState.documents, "disciplina"), "Todas");
  fillSelect("statusFilter", uniqueValues(dashboardState.documents, "status"), "Todos");
  fillSelect("ownerFilter", uniqueValues(dashboardState.documents, "responsavel"), "Todos");
  ["disciplineFilter", "statusFilter", "ownerFilter", "progressFilter"].forEach(id => document.getElementById(id).addEventListener("change", renderInteractiveDashboard));
  document.getElementById("resetFilters").addEventListener("click", resetFilters);
}

function fillSelect(id, values, allLabel) {
  const select = document.getElementById(id);
  select.innerHTML = `<option value="">${allLabel}</option>`;
  values.sort((a, b) => a.localeCompare(b, "pt-BR")).forEach(value => {
    const option = document.createElement("option"); option.value = value; option.textContent = value; select.appendChild(option);
  });
}
function uniqueValues(items, field) { return [...new Set(items.map(item => item[field]).filter(Boolean))]; }
function getFilteredDocuments() {
  const discipline = document.getElementById("disciplineFilter").value;
  const status = document.getElementById("statusFilter").value;
  const owner = document.getElementById("ownerFilter").value;
  const minimumProgress = Number(document.getElementById("progressFilter").value || 0);
  return dashboardState.documents.filter(item => (!discipline || item.disciplina === discipline) && (!status || item.status === status) && (!owner || item.responsavel === owner) && Number(item.progresso) >= minimumProgress);
}
function getFilteredRequirements(filteredDocuments) {
  const owners = new Set(filteredDocuments.map(item => item.responsavel));
  return dashboardState.requirements.filter(item => !owners.size || owners.has(item.responsavel));
}

function renderInteractiveDashboard() {
  const documents = getFilteredDocuments();
  const requirements = getFilteredRequirements(documents);
  const documentProgress = average(documents.map(item => Number(item.progresso)));
  const completed = requirements.filter(item => item.status === "concluido").length;
  const requirementsCompletion = requirements.length ? completed / requirements.length * 100 : 0;
  const overall = (documentProgress + requirementsCompletion) / 2;
  document.getElementById("documents").textContent = documents.length;
  document.getElementById("documentProgress").textContent = documentProgress.toFixed(1) + "%";
  document.getElementById("requirementsCompletion").textContent = requirementsCompletion.toFixed(1) + "%";
  document.getElementById("overall").textContent = overall.toFixed(1) + "%";
  document.getElementById("filterSummary").textContent = `${documents.length} de ${dashboardState.documents.length} documentos exibidos · ${requirements.length} requisitos associados.`;
  renderDocumentsTable(documents); renderRequirementsTable(requirements); renderInteractiveCharts(documents, requirements);
}

function renderDocumentsTable(documents) {
  const analysisResults = (dashboardState.analysis && dashboardState.analysis.resultados) || [];
  const tbody = document.getElementById("documentsTable"); tbody.innerHTML = "";
  documents.forEach(documentItem => {
    const row = document.createElement("tr"); row.tabIndex = 0; row.dataset.code = documentItem.codigo;
    const result = analysisResults.find(item => item.codigo === documentItem.codigo);
    row.innerHTML = `<td><strong>${escapeHTML(documentItem.codigo)}</strong></td><td>${escapeHTML(documentItem.titulo)}</td><td>${escapeHTML(documentItem.disciplina)}</td><td>${escapeHTML(documentItem.status)}</td><td>${escapeHTML(documentItem.responsavel)}</td><td><div class="progress-cell"><span>${Number(documentItem.progresso).toFixed(0)}%</span><div class="progress-track"><span style="width:${clamp(Number(documentItem.progresso), 0, 100)}%"></span></div></div></td>`;
    row.addEventListener("click", () => showDocumentDetails(documentItem, result));
    row.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); showDocumentDetails(documentItem, result); } });
    tbody.appendChild(row);
  });
  if (!documents.length) tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Nenhum documento corresponde aos filtros.</td></tr>`;
}
function renderRequirementsTable(requirements) {
  const tbody = document.getElementById("requirementsTable"); tbody.innerHTML = requirements.map(item => `<tr><td><strong>${escapeHTML(item.id)}</strong></td><td>${escapeHTML(item.tema)}</td><td>${escapeHTML(item.descricao)}</td><td>${escapeHTML(item.status)}</td><td>${escapeHTML(item.prioridade)}</td><td>${escapeHTML(item.responsavel)}</td></tr>`).join("");
  if (!requirements.length) tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Nenhum requisito associado aos filtros.</td></tr>`;
}
function showDocumentDetails(documentItem, analysisResult) {
  dashboardState.selectedDocument = documentItem.codigo;
  const detail = document.getElementById("documentDetails"), result = analysisResult || {};
  detail.hidden = false;
  detail.innerHTML = `<div><p class="eyebrow dark">DOCUMENTO SELECIONADO</p><h3>${escapeHTML(documentItem.codigo)} — ${escapeHTML(documentItem.titulo)}</h3><p>${escapeHTML(documentItem.disciplina)} · Revisão ${escapeHTML(documentItem.revisao)} · ${escapeHTML(documentItem.responsavel)}</p></div><div class="detail-grid"><span>Progresso <strong>${Number(documentItem.progresso).toFixed(0)}%</strong></span><span>Qualidade <strong>${result.score_qualidade != null ? Number(result.score_qualidade).toFixed(1) + "%" : "—"}</strong></span><span>Risco <strong>${result.nivel_risco ? escapeHTML(result.nivel_risco) : "—"}</strong></span><span>Score de risco <strong>${result.score_risco != null ? Number(result.score_risco).toFixed(1) : "—"}</strong></span></div>${result.motivos && result.motivos.length ? `<p><strong>Observações:</strong> ${result.motivos.map(escapeHTML).join(" · ")}</p>` : ""}`;
  detail.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
function resetFilters() {
  ["disciplineFilter", "statusFilter", "ownerFilter"].forEach(id => document.getElementById(id).value = "");
  document.getElementById("progressFilter").value = "0"; document.getElementById("documentDetails").hidden = true; renderInteractiveDashboard();
}

function renderAnalysis(analysis) {
  const results = analysis.resultados || [], alerts = analysis.alertas || [], qualityScore = average(results.map(item => Number(item.score_qualidade)));
  document.getElementById("analyzedDocuments").textContent = analysis.documentos_analisados ?? results.length;
  document.getElementById("qualityScore").textContent = qualityScore.toFixed(1) + "%"; document.getElementById("analysisAlerts").textContent = alerts.length;
  const status = document.getElementById("analysisStatus"), list = document.getElementById("alertsList");
  if (!alerts.length) { status.textContent = "Nenhuma inconsistência foi identificada nos dados demonstrativos."; list.innerHTML = ""; return; }
  status.textContent = "Alertas identificados pela análise automatizada:";
  list.innerHTML = alerts.map(alert => `<article class="alert-card"><strong>${escapeHTML(alert.codigo)}</strong><span>${escapeHTML(alert.tipo)}</span><p>${escapeHTML(alert.mensagem)}</p></article>`).join("");
}
function renderTrends(trends) {
  document.getElementById("currentProgress").textContent = Number(trends.progresso_atual || 0).toFixed(1) + "%";
  document.getElementById("currentRisk").textContent = Number(trends.risco_atual || 0).toFixed(1);
  document.getElementById("completionForecast").textContent = trends.previsao_semana_conclusao != null ? "Semana " + trends.previsao_semana_conclusao : "Indisponível";
  const riskTrend = Number(trends.tendencia_risco_semana || 0), riskText = riskTrend < 0 ? "redução" : riskTrend > 0 ? "aumento" : "estabilidade";
  document.getElementById("trendSummary").textContent = `O projeto apresenta evolução média de ${Number(trends.taxa_media_progresso_semana || 0).toFixed(2)} pontos por semana e tendência de ${riskText} do risco (${riskTrend.toFixed(2)} ponto(s)/semana).`;
}
function renderRisk(analysis) {
  const results = analysis.resultados || [], distribution = analysis.distribuicao_risco || {}, highRisk = results.filter(item => item.nivel_risco === "Alto").length;
  document.getElementById("projectRisk").textContent = Number(analysis.indice_risco_projeto || 0).toFixed(1);
  document.getElementById("highRiskDocuments").textContent = highRisk;
  document.getElementById("riskDistribution").textContent = `B: ${distribution.Baixo || 0} · M: ${distribution["Médio"] || 0} · A: ${distribution.Alto || 0}`;
  const priority = analysis.documentos_prioritarios || [];
  document.getElementById("priorityDocuments").innerHTML = priority.map(item => `<article class="priority-card"><div><strong>${escapeHTML(item.codigo)}</strong><p>${escapeHTML(item.titulo)}</p></div><div class="risk-badge risk-${String(item.nivel_risco).toLowerCase()}">${escapeHTML(item.nivel_risco)} · ${item.score_risco}</div></article>`).join("");
}

function renderInteractiveCharts(documents, requirements) {
  const statusCounts = groupCount(documents, "status");
  const disciplineProgress = groupAverage(documents, "disciplina", "progresso");
  const requirementCounts = groupCount(requirements, "status");
  renderBarChart("statusChart", statusCounts, "documentos");
  renderBarChart("disciplineChart", disciplineProgress, "%", true);
  renderBarChart("requirementsChart", requirementCounts, "requisitos");
  renderTrendChart("trendChart", dashboardState.history);
  const riskResults = (dashboardState.analysis && dashboardState.analysis.resultados) || [];
  renderRiskScatter("riskChart", documents, riskResults);
}
function groupCount(items, field) { return items.reduce((out, item) => { const key = item[field] || "Sem informação"; out[key] = (out[key] || 0) + 1; return out; }, {}); }
function groupAverage(items, groupField, valueField) {
  const groups = {};
  items.forEach(item => { const key = item[groupField] || "Sem informação"; if (!groups[key]) groups[key] = []; groups[key].push(Number(item[valueField])); });
  return Object.fromEntries(Object.entries(groups).map(([key, values]) => [key, average(values)]));
}
function chartShell(content, label) { return `<svg class="chart-svg" viewBox="0 0 760 300" role="img" aria-label="${escapeHTML(label)}">${content}</svg>`; }
function renderBarChart(id, data, unit, isPercentage = false) {
  const entries = Object.entries(data), el = document.getElementById(id);
  if (!entries.length) { el.innerHTML = `<div class="chart-empty">Sem dados para os filtros atuais.</div>`; return; }
  const max = Math.max(...entries.map(([, value]) => Number(value)), 1), left = 190, top = 30, barH = 34, gap = 18, width = 500;
  const content = entries.map(([label, value], index) => { const y = top + index * (barH + gap), barWidth = Number(value) / max * width; return `<text class="chart-label" x="${left - 12}" y="${y + 22}" text-anchor="end">${escapeHTML(label)}</text><rect class="chart-bar" x="${left}" y="${y}" width="${Math.max(barWidth, 2)}" height="${barH}" rx="5"></rect><text class="chart-value" x="${left + barWidth + 10}" y="${y + 22}">${formatChartValue(value, unit, isPercentage)}</text>`; }).join("");
  const height = Math.max(300, top + entries.length * (barH + gap) + 20); el.innerHTML = `<svg class="chart-svg" viewBox="0 0 760 ${height}" role="img" aria-label="${escapeHTML(id)}">${content}</svg>`;
}
function renderTrendChart(id, history) {
  const el = document.getElementById(id); if (!history.length) { el.innerHTML = `<div class="chart-empty">Histórico indisponível.</div>`; return; }
  const points = history.map(item => ({ week: Number(item.semana), progress: Number(item.progresso), risk: Number(item.indice_risco) }));
  const x0 = 55, x1 = 725, yTop = 30, yBottom = 245, maxX = Math.max(points.length - 1, 1);
  const x = index => x0 + index / maxX * (x1 - x0), y = value => yBottom - value / 100 * (yBottom - yTop);
  const progressPath = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.progress).toFixed(1)}`).join(" ");
  const riskPath = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.risk).toFixed(1)}`).join(" ");
  const grid = [0,25,50,75,100].map(v => `<line class="chart-grid" x1="${x0}" y1="${y(v)}" x2="${x1}" y2="${y(v)}"></line><text class="chart-axis" x="${x0 - 10}" y="${y(v) + 4}" text-anchor="end">${v}</text>`).join("");
  const labels = points.map((p, i) => `<text class="chart-axis" x="${x(i)}" y="268" text-anchor="middle">S${p.week}</text><circle class="chart-dot progress-dot" cx="${x(i)}" cy="${y(p.progress)}" r="4"><title>Semana ${p.week}: progresso ${p.progress}%</title></circle><circle class="chart-dot risk-dot" cx="${x(i)}" cy="${y(p.risk)}" r="4"><title>Semana ${p.week}: risco ${p.risk}</title></circle>`).join("");
  el.innerHTML = chartShell(`${grid}<path class="chart-line progress-line" d="${progressPath}"></path><path class="chart-line risk-line" d="${riskPath}"></path>${labels}<text class="chart-legend progress-text" x="55" y="292">Progresso</text><text class="chart-legend risk-text" x="150" y="292">Risco</text>`, "Evolução semanal de progresso e risco");
}
function renderRiskScatter(id, documents, riskResults) {
  const riskByCode = Object.fromEntries(riskResults.map(item => [item.codigo, Number(item.score_risco || 0)]));
  const points = documents.map(item => ({ code: item.codigo, progress: Number(item.progresso), risk: riskByCode[item.codigo] ?? 0 })).filter(p => Number.isFinite(p.progress));
  const el = document.getElementById(id); if (!points.length) { el.innerHTML = `<div class="chart-empty">Sem dados para os filtros atuais.</div>`; return; }
  const x0 = 65, x1 = 725, yTop = 30, yBottom = 245;
  const x = v => x0 + clamp(v, 0, 100) / 100 * (x1 - x0), y = v => yBottom - clamp(v, 0, 100) / 100 * (yBottom - yTop);
  const grid = [0,25,50,75,100].map(v => `<line class="chart-grid" x1="${x0}" y1="${y(v)}" x2="${x1}" y2="${y(v)}"></line><line class="chart-grid" x1="${x(v)}" y1="${yTop}" x2="${x(v)}" y2="${yBottom}"></line><text class="chart-axis" x="${x(v)}" y="268" text-anchor="middle">${v}</text><text class="chart-axis" x="${x0 - 10}" y="${y(v) + 4}" text-anchor="end">${v}</text>`).join("");
  const dots = points.map(p => `<circle class="chart-dot risk-scatter-dot" cx="${x(p.progress)}" cy="${y(p.risk)}" r="7"><title>${escapeHTML(p.code)} · progresso ${p.progress}% · risco ${p.risk}</title></circle>`).join("");
  el.innerHTML = chartShell(`${grid}${dots}<text class="chart-axis" x="395" y="292" text-anchor="middle">Progresso (%)</text><text class="chart-axis" transform="translate(16 160) rotate(-90)" text-anchor="middle">Risco</text>`, "Dispersão de progresso e risco documental");
}
function formatChartValue(value, unit, percentage) { return percentage ? Number(value).toFixed(1) + unit : Number.isInteger(Number(value)) ? value + " " + unit : Number(value).toFixed(1) + " " + unit; }
function parseCSV(text) { const lines = text.trim().split(/\r?\n/); if (!lines.length || !lines[0]) return []; const headers = lines.shift().split(","); return lines.map(line => { const values = line.split(","); return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])); }); }
function average(values) { const numeric = values.filter(value => Number.isFinite(Number(value))).map(Number); return numeric.length ? numeric.reduce((total, value) => total + value, 0) / numeric.length : 0; }
function clamp(value, min, max) { return Math.min(Math.max(value, min), max); }
function escapeHTML(value) { return String(value ?? "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]); }

loadDashboardData();
