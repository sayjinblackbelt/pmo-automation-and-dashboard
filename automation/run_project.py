"""
Executa a sequência completa da automação demonstrativa.

Uso:
    python automation/run_project.py
"""

from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
AUTOMATION = ROOT / "automation"

scripts = [
    "validate_data.py",
    "generate_visual_dashboard.py",
    "analyze_documents.py",
    "project_trend_analysis.py",
    "verify_output.py",
]

for script in scripts:
    path = AUTOMATION / script
    print(f"\n>>> Executando {script}")
    subprocess.run([sys.executable, str(path)], check=True)

print("\nAUTOMAÇÃO COMPLETA CONCLUÍDA COM SUCESSO")
