import requests
import re

def extract_offer_id(link):
    """Extrai o ID da oferta a partir do link da CVM."""
    match = re.search(r'/oferta-publica/(\d+)', str(link))
    return match.group(1) if match else None

def fetch_cvm_data(offer_id):
    """Busca dados da oferta diretamente da API da CVM."""
    if not offer_id:
        return None
    
    url = f"https://web.cvm.gov.br/sre-publico-cvm/rest/sitePublico/pesquisar/informacoesGerais/{offer_id}"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"⚠️  Erro ao buscar dados para ID {offer_id}: {e}")
        return None

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
