import sqlite3
import pandas as pd
import os

# Caminhos baseados no local do arquivo para evitar erros de CWD
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, '../data/database.sqlite')
REPORT_FILE = os.path.join(BASE_DIR, 'discrepancy_report.csv')

def fix_database():
    if not os.path.exists(REPORT_FILE):
        print(f"❌ Relatório {REPORT_FILE} não encontrado. Rode o script de validação primeiro.")
        return

    if not os.path.exists(DB_PATH):
        # Tenta caminho alternativo se rodar da raiz
        DB_PATH_ALT = 'data/database.sqlite'
        if os.path.exists(DB_PATH_ALT):
            current_db = DB_PATH_ALT
        else:
            print(f"❌ Banco de dados não encontrado em {DB_PATH}")
            return
    else:
        current_db = DB_PATH

    print(f"🔌 Conectando ao banco em {current_db}...")
    conn = sqlite3.connect(current_db)
    cursor = conn.cursor()

    print(f"📖 Lendo relatório de discrepâncias...")
    report_df = pd.read_csv(REPORT_FILE)
    
    correcoes_sucesso = 0
    erros = 0

    print(f"🛠️  Iniciando correções de {len(report_df)} registros...")

    for index, row in report_df.iterrows():
        id_cvm = str(int(row['ID_CVM']))
        novo_valor_centavos = int(round(row['Valor_Oficial'] * 100))
        
        # O link contém o ID_CVM no final
        # Ex: https://web.cvm.gov.br/sre-publico-cvm/#/oferta-publica/18962
        try:
            cursor.execute("""
                UPDATE Primario 
                SET valor = ? 
                WHERE link LIKE ?
            """, (novo_valor_centavos, f"%/{id_cvm}"))
            
            if cursor.rowcount > 0:
                correcoes_sucesso += cursor.rowcount
            else:
                print(f"⚠️  Nenhum registro encontrado no banco para o ID CVM {id_cvm}")
                erros += 1
                
        except Exception as e:
            print(f"❌ Erro ao atualizar ID {id_cvm}: {e}")
            erros += 1

    conn.commit()
    conn.close()

    print(f"\n✅ Sucesso! {correcoes_sucesso} registros atualizados no banco de dados.")
    if erros > 0:
        print(f"⚠️  {erros} registros não puderam ser atualizados (veja os avisos acima).")

if __name__ == "__main__":
    fix_database()
