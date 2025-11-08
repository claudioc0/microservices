import React, { useEffect, useState } from 'react';

export default function TransacoesApp({ selectedAccount }) {
  const [transacoes, setTransacoes] = useState([]);
  const [novaTransacao, setNovaTransacao] = useState({
    tipo: 'deposito',
    valor_origem: '',
    moeda_origem: 'BRL',
    descricao: ''
  });

  useEffect(() => {
    if (selectedAccount?.id) {
      carregarTransacoes(selectedAccount.id);
    } else {
      setTransacoes([]);
    }
  }, [selectedAccount]);

  async function carregarTransacoes(contaId) {
    try {
      const response = await fetch(`http://localhost:3002/transacoes/${contaId}`);
      if (!response.ok) throw new Error('Erro ao carregar transações');
      const data = await response.json();
      setTransacoes(data);
    } catch (err) {
      console.error('Erro ao buscar transações:', err);
      setTransacoes([]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedAccount?.id) {
      alert('Selecione uma conta primeiro!');
      return;
    }

    const body = {
      conta_id: selectedAccount.id,
      tipo: novaTransacao.tipo,
      valor_origem: parseFloat(novaTransacao.valor_origem),
      moeda_origem: novaTransacao.moeda_origem,
      valor_destino: parseFloat(novaTransacao.valor_origem),
      moeda_destino: novaTransacao.moeda_origem,
      descricao: novaTransacao.descricao
    };

    try {
      const response = await fetch('http://localhost:3002/transacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao registrar transação');
      }

      setNovaTransacao({
        tipo: 'deposito',
        valor_origem: '',
        moeda_origem: 'BRL',
        descricao: ''
      });
      carregarTransacoes(selectedAccount.id);
    } catch (err) {
      console.error('Erro ao registrar transação:', err);
      alert('Falha ao registrar transação. Veja o console.');
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        💰 Transações da conta:{' '}
        <span style={styles.accountName}>
          {selectedAccount ? selectedAccount.nome_usuario : 'Nenhuma conta selecionada'}
        </span>
      </h2>

      {selectedAccount ? (
        <>
          {/* Formulário */}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label>Tipo:</label>
              <select
                value={novaTransacao.tipo}
                onChange={(e) => setNovaTransacao({ ...novaTransacao, tipo: e.target.value })}
                style={styles.select}
              >
                <option value="deposito">Depósito</option>
                <option value="saque">Saque</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label>Valor:</label>
              <input
                type="number"
                step="0.01"
                required
                value={novaTransacao.valor_origem}
                onChange={(e) => setNovaTransacao({ ...novaTransacao, valor_origem: e.target.value })}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label>Moeda:</label>
              <select
                value={novaTransacao.moeda_origem}
                onChange={(e) => setNovaTransacao({ ...novaTransacao, moeda_origem: e.target.value })}
                style={styles.select}
              >
                <option value="BRL">BRL</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label>Descrição:</label>
              <input
                type="text"
                required
                value={novaTransacao.descricao}
                onChange={(e) => setNovaTransacao({ ...novaTransacao, descricao: e.target.value })}
                style={styles.input}
              />
            </div>

            <button type="submit" style={styles.button}>
              Registrar
            </button>
          </form>

          {/* Lista */}
          <div style={styles.listContainer}>
            {transacoes.length > 0 ? (
              transacoes.map((t) => (
                <div key={t._id} style={styles.transacaoCard}>
                  <div>
                    <strong>{t.tipo.toUpperCase()}</strong> — {t.moeda_origem}{' '}
                    {t.valor_origem.toFixed(2)}
                  </div>
                  <div style={{ color: '#555' }}>{t.descricao}</div>
                  <div style={styles.timestamp}>
                    {new Date(t.timestamp).toLocaleString('pt-BR')}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#888' }}>Nenhuma transação encontrada.</p>
            )}
          </div>
        </>
      ) : (
        <p style={{ color: '#888' }}>Selecione uma conta para ver as transações.</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxWidth: 700,
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: 20
  },
  accountName: {
    color: '#007bff'
  },
  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 12,
    marginBottom: 20,
    alignItems: 'end'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    padding: 8,
    borderRadius: 6,
    border: '1px solid #ccc'
  },
  select: {
    padding: 8,
    borderRadius: 6,
    border: '1px solid #ccc'
  },
  button: {
    gridColumn: '1 / -1',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  listContainer: {
    marginTop: 10
  },
  transacaoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    border: '1px solid #ddd'
  },
  timestamp: {
    fontSize: '0.8em',
    color: '#999',
    marginTop: 4
  }
};
