#!/bin/sh

echo "🚀 [PIPELINE] Iniciando ETL..."
python scripts/import_data.py

echo "🔍 [PIPELINE] Validando integridade com API CVM..."
python scripts/validate_data.py

echo "🛠️ [PIPELINE] Aplicando correções automáticas..."
python scripts/fix_data.py

echo "🏁 [PIPELINE] Pipeline concluída com sucesso!"
