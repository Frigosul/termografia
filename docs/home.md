# Termografia - HomePage
- [Voltar](./index.md)

## Endpoint

`GET /summary`

## Descrição

Este endpoint permite listar todas as câmaras, fornecendo informações detalhadas sobre cada uma, incluindo a temperatura atual o id e o status. A lista retornada é composta por um array de objetos, onde cada objeto representa uma câmara. Cada objeto contém os seguintes dados:
- **Id** Um identificador único para a câmara.
- **Nome:** O nome identificador da câmara.
- **Temperatura:** A temperatura atual da câmara.
- **Status:** O status atual da câmara (por exemplo, degelo,ventilação,compressor,porta aberta).

Essas informações serão utilizadas na página inicial da plataforma para exibir um resumo das câmaras em operação.

## Request

- **Method:** `GET`
- **URL:** `/summary`

## Autenticação

Essa requisição só deve retornar os dados caso o usuário esteja logado com o  **token JWT**, que deve ser enviado no cabeçalho da  requisição.

### Exemplo de uso:

```bash
Authorization: Bearer jwt_token
```

## Response
### Response Body (200 - Success)
A resposta do endpoint será um array de objetos JSON, com o seguinte formato:

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Câmara 1",
    "temperature": 22.5,
    "status": "deg"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Câmara 2",
    "temperature": 18.3,
    "status": "vent"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "name": "Câmara 3",
    "temperature": 20.1,
    "status": "comp"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "name": "Câmara 4",
    "temperature": 15.1,
    "status": "port"
  }
]


```
