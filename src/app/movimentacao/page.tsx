'use client';

import { useEffect, useState } from 'react';
import { getMovimentacoes } from '@/service/movimentacaoServices'

export default function Movimentacao() {
  const [movimentacoes, setMovimentacoes] = useState<any[]>([]);  // Estado para armazenar as movimentações
  const [loading, setLoading] = useState<boolean>(true);          // Estado para controlar o loading

  useEffect(() => {
    // Função para buscar as movimentações do Firestore
    const fetchMovimentacoes = async () => {
      try {
        const data = await getMovimentacoes();
        setMovimentacoes(data);
      } catch (error) {
        console.error('Erro ao buscar movimentações:', error);
      } finally {
        setLoading(false);  // Finaliza o loading após a resposta
      }
    };

    fetchMovimentacoes();  // Chama a função quando o componente for montado
  }, []);

  if (loading) {
    return <div>Carregando...</div>;  // Exibe "Carregando..." enquanto as movimentações são buscadas
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Lista de Movimentações</h2>
      
      {/* Verifica se há movimentações para exibir */}
      {movimentacoes.length === 0 ? (
        <p className="text-center">Nenhuma movimentação encontrada.</p>
      ) : (
        <ul className="space-y-4">
          {movimentacoes.map((mov, index) => (
            <li key={index} className="p-4 border border-gray-300 rounded-md shadow-md">
              <p><strong>Descrição:</strong> {mov.descricao}</p>
              <p><strong>Valor:</strong> {mov.valor}</p>
              <p><strong>Data:</strong> {mov.data}</p>
              <p><strong>Tipo:</strong> {mov.tipo}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
