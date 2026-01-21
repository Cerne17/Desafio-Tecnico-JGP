import pandas as pd
import pytest
from import_data import clean_data

def test_clean_data_conversion():
    # Arrange
    data = {
        'Valor': [10.5, '20,0', None, 'abc'],
        'Data': ['2025-01-01', '2025-12-31', '2025-06-15', '2025-01-01']
    }
    df = pd.DataFrame(data)

    # Act
    cleaned_df = clean_data(df)

    # Assert
    # 10.5 -> 1050 centavos
    assert cleaned_df.loc[0, 'Valor_Centavos'] == 1050
    # '20,0' deve ser tratado pelo to_numeric (pode falhar dependendo do locale, 
    # mas o pandas por padrão usa ponto. Se falhar, vira 0 via fillna)
    # No caso de 'abc' vira 0.
    assert cleaned_df.loc[3, 'Valor_Centavos'] == 0
    assert cleaned_df.loc[2, 'Valor_Centavos'] == 0

def test_clean_data_date_format():
    # Arrange
    data = {
        'Valor': [10],
        'Data': [pd.Timestamp('2025-05-20')]
    }
    df = pd.DataFrame(data)

    # Act
    cleaned_df = clean_data(df)

    # Assert
    assert cleaned_df.loc[0, 'Data'] == '2025-05-20'
