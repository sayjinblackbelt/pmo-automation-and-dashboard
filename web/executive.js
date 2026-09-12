function escapeExecutive(value) {
  return String(value ?? "").replace(/[&<>\"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[char]));
}

function renderExecutiveReading() {
  if (!window.dashboardState || !dashboardState.documents.length) return false;
  const docs = typeof getFilteredDocuments === "function" ? getFilteredDocuments() : dashboardState.documents;
  const results = (dashboardState.analysis && dashboardState.analysis.resultados) || [];
  const riskByCode = Object.fromEntries(results.map(item => [item.codigo, item]));
  const highRisk = docs.map(d => riskByCode[d.codigo]).filter(r => r && r.nivel_risco === "Alto");
  const avgProgress = docs.length ? docs.reduce((sum, d) => sum + Number(d.progresso || 0), 0) / docs.length : 0;
  const lowest = [...docs].sort((a, b) => Number(a.progresso) - Number(b.progresso))[0];
  const strongest = [...docs].sort((a, b) => Number(b.progresso) - Number(a.progresso))[0];
  const pending = docs.filter(d => !["concluido", "aprovado"].includes(String(d.status).toLowerCase())).length;
  const summary = document.getElementById("executiveSummary");
  if (!summary) return false;
  if (!docs.length) {
    summary.innerHTML = "<p>Nenhum documento corresponde aos filtros atuais. Ajuste os filtros para gerar uma leitura executiva.</p>";
    return true;
  }
  const riskText = highRisk.length ? `${highRisk.length} documento(s) de alto risco` : "nenhum documento de alto risco";
  summary.innerHTML = `<div class="executive-grid"><div><span>Leitura do recorte</span><strong>${docs.length} documento(s)</strong><p>Progresso médio de ${avgProgress.toFixed(1)}%.</p></div><div><span>Atenção</span><strong>${riskText}</strong><p>${pending} documento(s) ainda exigem acompanhamento.</p></div><div><span>Menor progresso</span><strong>${escapeExecutive(lowest.codigo)}</strong><p>${escapeExecutive(lowest.titulo)} · ${Number(lowest.progresso).toFixed(0)}%.</p></div><div><span>Maior progresso</span><strong>${escapeExecutive(strongest.codigo)}</strong><p>${escapeExecutive(strongest.titulo)} · ${Number(strongest.progresso).toFixed(0)}%.</p></div></div>`;
  return true;
}

function initExecutiveReading() {
  const timer = setInterval(() => {
    if (renderExecutiveReading()) clearInterval(timer);
  }, 100);
  setTimeout(() => clearInterval(timer), 10000);
  ["disciplineFilter", "statusFilter", "ownerFilter", "progressFilter"].forEach(id => {
    const element = document.getElementById(id);
    if (element) element.addEventListener("change", renderExecutiveReading);
  });
  const reset = document.getElementById("resetFilters");
  if (reset) reset.addEventListener("click", () => setTimeout(renderExecutiveReading, 0));
}

document.addEventListener("DOMContentLoaded", initExecutiveReading);
