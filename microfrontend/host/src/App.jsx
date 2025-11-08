import React, { useState, Suspense } from 'react';

// microfrontends remotos
const ContasApp = React.lazy(() => import('contas/ContasApp'));
const TransacoesApp = React.lazy(() => import('transacoes/TransacoesApp'));

export default function App() {
  const [selectedAccount, setSelectedAccount] = useState(null);

  const handleAccountSelect = (conta) => {
    console.log("Conta selecionada no host:", conta);
    setSelectedAccount(conta);
  };

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f7f9fb',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '20px',
        }}
      >
        <h1 style={{ textAlign: 'center', color: '#2b7a78' }}>GlobalStable</h1>
        <p style={{ textAlign: 'center', color: '#666' }}>
          Transações globais simplificadas com stablecoins
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginTop: '20px',
          }}
        >
          <div
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: '#fefefe',
            }}
          >
            <Suspense fallback={<div>Carregando contas...</div>}>
              <ContasApp onAccountSelect={handleAccountSelect} />
            </Suspense>
          </div>

          <div
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: '#fefefe',
            }}
          >
            <Suspense fallback={<div>Carregando transações...</div>}>
              <TransacoesApp selectedAccount={selectedAccount} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
