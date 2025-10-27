import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));
root.render(<App />);

// carregamento dinâmico dos remotes expostos
const ContasApp = React.lazy(() => import('contas/ContasApp'));
const TransacoesApp = React.lazy(() => import('transacoes/TransacoesApp'));

