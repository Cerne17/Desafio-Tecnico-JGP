import pandas as pd
import os
from scraper import extract_offer_id, fetch_cvm_data, parse_valor_total

# Caminhos configuráveis via ENV ou caminhos padrões
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXCEL_FILE = os.getenv('EXCEL_FILE', os.path.join(BASE_DIR, 'input/base_2025.xlsx'))
REPORT_FILE = os.getenv('REPORT_FILE', os.path.join(BASE_DIR, 'discrepancy_report.csv'))

def validate_data():
    if not os.path.exists(EXCEL_FILE):
        print("❌ Arquivo Excel não encontrado.")
        return

    print("📖 Lendo dados do Excel...")
    df = pd.read_excel(EXCEL_FILE)
    
    # Normaliza o valor original para centavos (como fazemos no ETL)
    df['Valor_Original_Centavos'] = (pd.to_numeric(df['Valor'], errors='coerce').fillna(0) * 100).round().astype(int)
    
    discrepancies = []
    
    print(f"🔍 Validando {len(df)} registros contra a API da CVM...")
    
    # Para o teste, vamos limitar aos primeiros 20 ou apenas os que têm Link
    for index, row in df.iterrows():
        link = row.get('Link')
        if not link or pd.isna(link):
            continue
            
        offer_id = extract_offer_id(link)
        if not offer_id:
            continue
            
        print(f"[{index+1}/{len(df)}] Verificando ID {offer_id} ({row['Emissor']})...", end="\r")
        
        cvm_data = fetch_cvm_data(offer_id)
        if cvm_data and 'valorTotal' in cvm_data:
            official_valor_centavos = parse_valor_total(cvm_data['valorTotal'])
            local_valor_centavos = row['Valor_Original_Centavos']
            
            # Salvaguarda: Se a CVM retornar 0 e nós temos um valor, 
            # não consideramos como discrepância (provavelmente erro na API/extração)
            if official_valor_centavos == 0 and local_valor_centavos != 0:
                print(f"[{index+1}/{len(df)}] ID {offer_id} ignorado (CVM retornou 0)...", end="\r")
                continue

            if official_valor_centavos != local_valor_centavos:
                discrepancies.append({
                    'Linha': index + 2, # +1 header, +1 zero-indexed
                    'Emissor': row['Emissor'],
                    'ID_CVM': offer_id,
                    'Valor_Planilha': local_valor_centavos / 100,
                    'Valor_Oficial': official_valor_centavos / 100,
                    'Diferenca': (official_valor_centavos - local_valor_centavos) / 100
                })

    print("\n\n🏁 Validação concluída!")
    
    if discrepancies:
        report_df = pd.DataFrame(discrepancies)
        print(f"⚠️  Encontradas {len(discrepancies)} divergências:")
        print(report_df.to_string(index=False))
        
        # Salva o relatório
        report_df.to_csv(REPORT_FILE, index=False)
        print(f"\n📄 Relatório salvo em '{REPORT_FILE}'")
    else:
        print("✅ Nenhuma divergência encontrada nos registros validados.")

if __name__ == "__main__":
    validate_data()
