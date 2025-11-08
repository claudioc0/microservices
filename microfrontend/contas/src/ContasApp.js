import React, { useState, useEffect } from 'react';

const FormularioCriarConta = ({ onContaCriada, setErroExterno }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [saldo, setSaldo] = useState('');
  const [isSalvando, setIsSalvando] = useState(false);

  const handleCriarConta = async (e) => {
    e.preventDefault();
    setIsSalvando(true);
    setErroExterno(null);

    try {
      const response = await fetch('http://localhost:3000/contas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome_usuario: nome,
          email,
          saldo: parseFloat(saldo),
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Erro ao criar conta.');
      }

      await response.json();
      setNome('');
      setEmail('');
      setSaldo('');
      if (onContaCriada) onContaCriada(); // Atualiza lista
    } catch (error) {
      setErroExterno(error.message);
    } finally {
      setIsSalvando(false);
    }
  };

  return (
    <form onSubmit={handleCriarConta} style={styles.formContainer}>
      <h4 style={styles.sectionTitle}>🧾 Criar Nova Conta</h4>
      <div style={styles.formGrid}>
        <div style={styles.formGroup}>
          <label>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Saldo:</label>
          <input
            type="number"
            step="0.01"
            value={saldo}
            onChange={(e) => setSaldo(e.target.value)}
            required
            style={styles.input}
          />
        </div>
      </div>
      <button type="submit" disabled={isSalvando} style={styles.button}>
        {isSalvando ? 'Salvando...' : 'Criar Conta'}
      </button>
    </form>
  );
};

const ContasApp = ({ onAccountSelect }) => {
  const [contas, setContas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [contaSelecionada, setContaSelecionada] = useState(null);

  const fetchContas = async () => {
    setIsLoading(true);
    setErro(null);
    try {
      const res = await fetch(`http://localhost:3000/contas?_t=${Date.now()}`);
      if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
      const data = await res.json();
      setContas(data);
    } catch (error) {
      setErro(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContas();
  }, []);

  const handleSelecionarConta = (conta) => {
    setContaSelecionada(conta);
    if (onAccountSelect) onAccountSelect(conta);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🏦 Contas</h2>

      {erro && <div style={styles.errorBox}>⚠️ {erro}</div>}

      <FormularioCriarConta onContaCriada={fetchContas} setErroExterno={setErro} />

      <h4 style={styles.sectionTitle}>📋 Lista de Contas</h4>
      {isLoading ? (
        <p>Carregando...</p>
      ) : contas.length > 0 ? (
        <div style={styles.cardList}>
          {contas.map((conta) => (
            <div
              key={conta.id}
              onClick={() => handleSelecionarConta(conta)}
              style={{
                ...styles.card,
                backgroundColor:
                  contaSelecionada?.id === conta.id ? '#d1f7d1' : '#f8f9fa',
              }}
            >
              <strong style={{ fontSize: '1.1em' }}>{conta.nome_usuario}</strong>
              <div>{conta.email}</div>
              <div style={{ color: '#007bff', fontWeight: 'bold' }}>
                💵 Saldo: R${conta.saldo.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#777' }}>Nenhuma conta encontrada.</p>
      )}

      {contaSelecionada && (
        <div style={styles.selectedBox}>
          ✅ Conta selecionada: <strong>{contaSelecionada.nome_usuario}</strong>
        </div>
      )}
    </div>
  );
};

export default ContasApp;

// 🎨 Estilos
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
  sectionTitle: {
    color: '#333',
    marginBottom: 10
  },
  formContainer: {
    border: '1px solid #ddd',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 20
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 12
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
  button: {
    marginTop: 10,
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  cardList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 12
  },
  card: {
    border: '1px solid #ccc',
    borderRadius: 8,
    padding: 10,
    cursor: 'pointer',
    transition: '0.2s ease',
  },
  errorBox: {
    color: '#b00020',
    backgroundColor: '#ffeaea',
    border: '1px solid #f5c2c7',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10
  },
  selectedBox: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#e9ffe9',
    borderRadius: 6,
    textAlign: 'center',
    fontWeight: 'bold'
  }
};
