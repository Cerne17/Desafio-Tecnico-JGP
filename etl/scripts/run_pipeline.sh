#!/bin/sh

set -e # Sai se houver erro crítico

echo "🚀 [PIPELINE] 1/3 - Iniciando Importação de Dados..."
python scripts/import_data.py || { echo "❌ Falha crítica na importação"; exit 1; }

echo "🔍 [PIPELINE] 2/3 - Validando integridade com API CVM..."
# Não paramos a pipeline se a validação falhar, para manter a resiliência
python scripts/validate_data.py || echo "⚠️  Aviso: Falha na validação (pode ser rede), prosseguindo..."

echo "🛠️ [PIPELINE] 3/3 - Aplicando correções automáticas..."
if [ -f "$REPORT_FILE" ]; then
    python scripts/fix_data.py || echo "⚠️  Aviso: Falha ao aplicar correções, prosseguindo com dados originais..."
else
    echo "⚠️  Aviso: Relatório de discrepâncias não encontrado, pulando correção."
fi

echo "🏁 [PIPELINE] Pipeline concluída!"
