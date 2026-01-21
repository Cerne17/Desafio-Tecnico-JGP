import requests
import re

def extract_offer_id(link):
    """Extrai o ID da oferta a partir do link da CVM."""
    match = re.search(r'/oferta-publica/(\d+)', str(link))
    return match.group(1) if match else None

def fetch_cvm_data(offer_id):
    """
    Busca dados da oferta da CVM. 
    Tenta primeiro o endpoint de 'requerimento' (mais preciso para valores finais)
    e depois o de 'informacoesGerais'.
    """
    if not offer_id:
        return None
    
    # Lista de endpoints para tentar, em ordem de confiabilidade para o Valor Total
    endpoints = [
        f"https://web.cvm.gov.br/sre-publico-cvm/rest/sitePublico/pesquisar/requerimento/{offer_id}",
        f"https://web.cvm.gov.br/sre-publico-cvm/rest/sitePublico/pesquisar/informacoesGerais/{offer_id}"
    ]
    
    final_data = {}
    
    for url in endpoints:
        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if not data:
                    continue
                
                # Se for o endpoint de requerimento, os dados vêm dentro de um objeto
                if 'requerimento' in url:
                    info = data.get('informacoesGerais', {})
                    val = info.get('valorTotalFinal') or info.get('valorTotal')
                    if val and val != "0,0000":
                        final_data['valorTotal'] = val
                        return final_data
                else:
                    val = data.get('valorTotal')
                    if val and val != "0,0000":
                        final_data['valorTotal'] = val
                        return final_data
                        
        except Exception as e:
            print(f"⚠️  Erro ao acessar {url}: {e}")
            
    return final_data if final_data else None

def parse_valor_total(valor_str):
    """Converte a string de valor da CVM (ex: '42.000.000,0000') para centavos (int)."""
    if not valor_str:
        return 0
    try:
        # Remove pontos de milhar e substitui vírgula decimal por ponto
        clean_val = str(valor_str).replace('.', '').replace(',', '.')
        return int(round(float(clean_val) * 100))
    except (ValueError, TypeError):
        return 0
