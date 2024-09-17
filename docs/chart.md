# Termografia - HomePage
- [Voltar](./index.md)

## Endpoint

`POST /chart`

## Descrição

Este endpoint retorna um objeto contendo o nome da câmara, a data e hora de abertura e fechamento, um array contendo a hora e a temperatura no intervalo de tempo que foi passado para o endpoint.

No corpo da requisição, você deve enviar os seguintes dados:

- **Id** Identificador único da câmara.
- **Nome:** Nome da câmara.
- **Variação do gráfico:** A variação para o gráfico (obrigatório).
- **Variação da tabela:** A variação para a tabela (obrigatório).
- **Valor limite:** Valor limite, sendo opcional.
- **Desvio:** Desvio, sendo opcional, sendo o valor padrão 1.
- **Variação coluna de temperatura:** Variação da coluna de temperatura, sendo opcional.
- **Valor mínimo:** Valor mínimo, sendo opcional.
- **Valor máximo:** Valor máximo, sendo opcional.
- **Data e hora inicial:** Data e hora inicial (obrigatório).
- **Data e hora final:** Data e hora final (obrigatório).
- **Informações detalhadas:** Informações detalhadas, sendo opcional.

Exemplo de Requisição
O corpo da requisição deve ser enviado em formato JSON, conforme o exemplo abaixo:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Câmara 1",
  "graphVariation": "10min",
  "tableVariation": "5min",
  "limitValue": 10,
  "deviation": 1,
  "temperatureColumnVariation": "1",
  "minValue": -20,
  "maxValue": 20,
  "startDateTime": "2024-08-10T12:00",
  "endDateTime": "2024-08-11T12:00",
  "description": "Informações adicionais sobre a câmara",
}
```


## Request

- **Method:** `POST`
- **URL:** `/chart`

## Autenticação

Essa requisição só deve retornar os dados caso o usuário esteja logado com o  **token JWT**, que deve ser enviado no cabeçalho da  requisição.

### Exemplo de uso:

```bash
Authorization: Bearer jwt_token
```

## Response
### Response Body (200 - Success)
Este endpoint retorna um objeto contendo as seguintes informações:

- **Id**: O identificador único para a câmara.
- **Nome da câmara:** O nome da câmara solicitada.
- **Data e hora de abertura:** Data e hora quando a câmara foi aberta.
- **Data e hora de fechamento:** Data e hora quando a câmara foi fechada.
- **Intervalo de temperatura do gráfico:** Um array contendo os horários e as temperaturas registradas no intervalo de -tempo especificado.
- **Intervalo de temperatura da tabela:** Um array contendo os horários e as temperaturas registradas no intervalo de -tempo especificado.

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Câmara 1",
  "startDate": "2024-08-10T12:00",
  "endDate": "2024-08-11T12:00",
  "chartTemperature": [
    {
      "time": "2024-09-17T08:00",
      "temperature": 12.5
    },
    {
      "time": "2024-09-17T08:10",
      "temperature": 8.7
    },
    {
      "time": "2024-09-17T08:20",
      "temperature": 10.8
    },
    {
      "time": "2024-09-17T08:30",
      "temperature": 6.6
    },
    {
      "time": "2024-09-17T08:40",
      "temperature": 4.5
    }
  ],
   "tableTemperatureRange": [
    {
      "time": "2024-09-17T08:00",
      "temperature": 22.4
    },
    {
      "time": "2024-09-17T08:05",
      "temperature": 22.6
    },
    {
      "time": "2024-09-17T08:10",
      "temperature": 22.7
    },
    {
      "time": "2024-09-17T08:15",
      "temperature": 22.5
    },
    {
      "time": "2024-09-17T08:20",
      "temperature": 22.4
    }
  ]
}


```
