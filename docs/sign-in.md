# Termografia - Sign-In

- [Voltar](./index.md)

## Endpoint

`POST /auth/sign-in`

## Descrição

Este endpoint é utilizado para realizar o login de um usuário na plataforma, autenticando com credenciais de e-mail e senha. Ele retorna um token JWT, que será utilizado para autenticar as requisições subsequentes.

## Request

- **Method:** `POST`
- **URL:** `/auth/sign-in`
- **Content-Type:** `application/json`

### Headers

| Key            | Value              | Description                              |
| -------------- | ------------------ | ---------------------------------------- |
| `Content-Type` | `application/json` | Define o formato dos dados da requisição |

### Request Body

O corpo da requisição deve ser enviado em formato JSON e conter as seguintes propriedades:

```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

## Autenticação

A resposta deste endpoint retorna um **token JWT**, que deve ser enviado no cabeçalho das próximas requisições protegidas da API.

### Exemplo de uso:

```bash
Authorization: Bearer jwt_token
```

# Response

### Response Body (200 - Success)

Caso o login seja bem-sucedido, a resposta será:

```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

# Response Body (400 - Bad Request)

### Caso haja um erro na requisição, como um e-mail ou senha incorretos:

```json
{
  "error": "Invalid email or password"
}
```
