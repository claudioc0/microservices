import React, { useState, useEffect } from 'react';

const ContasApp = () => {
  const [contas, setContas] = useState([]);
  const [erro, setErro] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bffUrl = 'http://localhost:3000/contas';
    
    setIsLoading(true);
    setErro(null);

    fetch(bffUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro na rede: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setContas(data);
        setIsLoading(false); 
      })
      .catch(error => {
        console.error('Falha ao buscar dados do BFF:', error);
        setErro(error.message);
        setIsLoading(false);
      });
  }, []);

  const renderConteudo = () => {
    if (isLoading) {
      return <li>Carregando...</li>;
    }

    if (erro) {
      return <li style={{ color: 'red' }}>Erro: {erro}</li>;
    }

    if (contas.length === 0) {
      return <li>Nenhuma conta encontrada.</li>;
    }

    return contas.map(conta => (
      <li key={conta.id}>
        {conta.nome_usuario} (Email: {conta.email}, Saldo: {conta.saldo})
      </li>
    ));
  };

  return (
    <div style={{ padding: '10px', border: '1px solid green', margin: '5px' }}>
      <h3>App Contas (Remote)</h3>
      <h4>Lista de Contas (do BFF - Porta 3000):</h4>
      <ul>
        {renderConteudo()}
      </ul>
    </div>
  );
};

export default ContasApp;
