# Termografia - HomePage

- [Voltar](./index.md)

## Endpoint

`GET /summary`

## Descrição

Este endpoint permite listar todas as câmaras, fornecendo informações detalhadas sobre cada uma, incluindo a temperatura atual o id e o status. A lista retornada é composta por um array de objetos, onde cada objeto representa uma câmara. Cada objeto contém os seguintes dados:

- **Id** Um identificador único para a câmara.
- **Nome:** O nome identificador da câmara.
- **Valor:** A temperatura ou a pressão atual da câmara.
- **Tipo:** O tipo da câmara, se é temperatura ou medidor de pressão
- **Status:** O status atual da câmara (por exemplo, degelo,ventilação,compressor,porta aberta).

Essas informações serão utilizadas na página inicial da plataforma para exibir um resumo das câmaras em operação.

## Request

- **Method:** `GET`
- **URL:** `/summary`

## Autenticação

Essa requisição só deve retornar os dados caso o usuário esteja logado com o **token JWT**, que deve ser enviado no cabeçalho da requisição.

### Exemplo de uso:

```bash
Authorization: Bearer jwt_token
```

## Response

### Response Body (200 - Success)

A resposta do endpoint será um array de objetos JSON, com o seguinte formato:

```json
{
  "summary": [
    {
      "name": "Câmara 01",
      "type": "temp",
      "status": "vent",
      "value": -15.5,
      "id": "0cd34527-5732-49f8-a27f-0dd2b73925a5"
    },
    {
      "name": "Câmara 02",
      "type": "temp",
      "status": "deg",
      "value": 10.2,
      "id": "c314ae15-9276-4e93-9bb2-a9b2ac7f2be7"
    },
    {
      "name": "Câmara 03",
      "type": "temp",
      "status": "vent",
      "value": -2.5,
      "id": "e8b708c9-84ff-4b87-8051-9edd497e3d23"
    },
    {
      "name": "Câmara 04",
      "type": "temp",
      "status": "comp",
      "value": 18.0,
      "id": "b92a0733-ab66-405e-a06a-ea8248a43c7a"
    }
  ]
}
```
