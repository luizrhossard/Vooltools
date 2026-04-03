# Secrets (Production)

Para subir o profile `prod` com Docker Compose, crie estes arquivos locais:

1. `secrets/db_password.txt`
2. `secrets/jwt_secret.txt`

Regras:

- Não commitar os arquivos `.txt` reais.
- Use uma senha forte para banco.
- Use `jwt_secret` com pelo menos 32 bytes.

Você pode copiar dos exemplos:

- `secrets/db_password.txt.example`
- `secrets/jwt_secret.txt.example`
