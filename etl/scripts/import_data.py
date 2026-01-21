import pandas as pd
import sqlite3
import os

# Caminhos definidos no Dockerfile/Docker-compose
DB_PATH = '/app/data/database.sqlite'
SCHEMA_PATH = '/app/schema/schema.sql'
EXCEL_FILE = '/app/data/base_2025.xlsx'

EXCEL_FILE_FINAL = '/app/input/base_2025.xlsx'

def run_etl():
    print("🚀 [ETL] Iniciando processo...")

    if not os.path.exists(EXCEL_FILE_FINAL):
        print(f"❌ [ETL] Erro: Arquivo Excel não encontrado em {EXCEL_FILE_FINAL}")
        # Em produção, poderíamos levantar uma exceção, mas aqui avisamos para debug
        return

    print(f"🔌 [ETL] Conectando ao banco em {DB_PATH}...")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    try:
        with open(SCHEMA_PATH, 'r') as f:
            sql_script = f.read()
            cursor.executescript(sql_script)
        print("✅ [ETL] Tabelas (re)criadas com sucesso.")
    except FileNotFoundError:
        print(f"❌ [ETL] Erro: Arquivo de schema não encontrado em {SCHEMA_PATH}")
        return

    print("📖 [ETL] Lendo arquivo Excel...")
    try:
        df = pd.read_excel(EXCEL_FILE_FINAL)
    except Exception as e:
        print(f"❌ [ETL] Erro ao ler Excel: {e}")
        return

    df['Valor'] = pd.to_numeric(df['Valor'], errors='coerce').fillna(0)
    df['Valor_Centavos'] = (df['Valor'] * 100).round().astype(int)

    df['Data'] = pd.to_datetime(df['Data']).dt.strftime('%Y-%m-%d')

    print(f"🔄 [ETL] Processando {len(df)} linhas e normalizando dados...")

    
    registros_inseridos = 0
    
    for _, row in df.iterrows():
        try:
            nome_emissor = str(row['Emissor']).strip()
            
            # Tenta encontrar o emissor
            cursor.execute("SELECT id FROM Emissor WHERE nome = ?", (nome_emissor,))
            resultado_emissor = cursor.fetchone()
            
            if resultado_emissor:
                id_emissor = resultado_emissor[0]
            else:
                # Se não existe, cria
                cursor.execute("INSERT INTO Emissor (nome) VALUES (?)", (nome_emissor,))
                id_emissor = cursor.lastrowid

            codigo_tipo = str(row['Tipo']).strip()
            
            cursor.execute("SELECT id FROM Tipo WHERE codigo = ?", (codigo_tipo,))
            resultado_tipo = cursor.fetchone()
            
            if resultado_tipo:
                id_tipo = resultado_tipo[0]
            else:
                cursor.execute("INSERT INTO Tipo (codigo) VALUES (?)", (codigo_tipo,))
                id_tipo = cursor.lastrowid

            cursor.execute("""
                INSERT INTO Primario (id_emissor, id_tipo, data, valor, link)
                VALUES (?, ?, ?, ?, ?)
            """, (
                id_emissor,
                id_tipo,
                row['Data'],
                row['Valor_Centavos'],
                str(row['Link'])
            ))
            registros_inseridos += 1
            
        except Exception as e:
            print(f"⚠️ [ETL] Erro na linha {_}: {e}")
            continue

    conn.commit()
    conn.close()
    print(f"🏁 [ETL] Sucesso! {registros_inseridos} registros inseridos no banco.")

if __name__ == "__main__":
    run_etl()
