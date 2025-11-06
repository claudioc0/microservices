import React, { Suspense } from 'react';

// carregamento dinâmico dos remotes expostos
const ContasApp = React.lazy(() => import('contas/ContasApp'));
const TransacoesApp = React.lazy(() => import('transacoes/TransacoesApp'));

export default function App() {
  return (
    <div>
      <h1>Host</h1>
      <Suspense fallback={<div>carregando contas...</div>}>
        <ContasApp />
      </Suspense>
      <Suspense fallback={<div>carregando transações...</div>}>
        <TransacoesApp />
      </Suspense>
    </div>
  );
}