# Copilot Instructions

## context-mode routing instructions

Use the context-mode hooks for tool usage routing.

1. Read repository files from the active workspace only.
2. Do not access external URLs or local files outside this repository unless explicitly instructed.
3. For code changes, modify only the requested files and keep formatting consistent.
4. For debugging, use provided tool output and terminal logs.

## Safety

- Keep responses concise.
- Do not expose secrets.
- Do not perform operations outside project scope.
