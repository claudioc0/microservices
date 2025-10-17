erDiagram
    CONTA {
        UUID id PK
        String nome_usuario
        String email UK
        Decimal saldo
        String moeda_padrao
    }

    TRANSACAO {
        UUID id PK
        UUID conta_id FK
        String tipo
        Decimal valor_origem
        String moeda_origem
        Decimal valor_destino
        String moeda_destino
        DateTime timestamp
    }

    CONTA ||--|{ TRANSACAO : "realiza"