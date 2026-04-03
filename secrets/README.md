# Secrets (Production)

Para subir o profile `prod` com Docker Compose, crie estes arquivos locais:

1. `secrets/db_password.txt`
2. `secrets/jwt_secret.txt`

Regras:

- **Nunca commite os arquivos `.txt` reais.** Crie-os localmente a partir dos `.example` e mantenha-os fora do controle de versão.
- Use uma senha forte para banco.
- Use `jwt_secret` com pelo menos 32 bytes.

Você pode copiar dos exemplos:

- `secrets/db_password.txt.example`
- `secrets/jwt_secret.txt.example`

## Como criar os arquivos locais

```bash
cp secrets/db_password.txt.example secrets/db_password.txt
cp secrets/jwt_secret.txt.example secrets/jwt_secret.txt
```

Edite os arquivos criados com seus valores reais. Eles estão listados no `.gitignore` e nunca serão commitados.
