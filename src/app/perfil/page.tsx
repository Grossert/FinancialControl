'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@/contexts/authUser';
import { getMovimentacoes } from "@/service/movimentacaoServices"; // Função para buscar as movimentações

export default function Perfil() {
  const { user, setUser } = useUser();

  const [resumo, setResumo] = useState({
    receitas: 0,
    despesas: 0,
    despesasFixas: 0,
    despesasVariaveis: 0,
    maiorDespesa: 0,
    economia: 0,
    qtdDespesasFixas: 0,
    qtdDespesasVariaveis: 0,
  });

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const movimentacoes = await getMovimentacoes();
        const receitas = movimentacoes
          .filter((mov) => mov.tipo === "receita")
          .reduce((acc, mov) => acc + mov.valor, 0);
        const despesas = movimentacoes
          .filter((mov) => mov.tipo === "despesa")
          .reduce((acc, mov) => acc + mov.valor, 0);
        const despesasFixas = movimentacoes
          .filter((mov) => mov.tipo === "fixa")
          .reduce((acc, mov) => acc + mov.valor, 0);
        const despesasVariaveis = movimentacoes
          .filter((mov) => mov.tipo === "variavel")
          .reduce((acc, mov) => acc + mov.valor, 0);

        const qtdDespesasFixas = movimentacoes.filter((mov) => mov.tipo === "fixa").length;
        const qtdDespesasVariaveis = movimentacoes.filter((mov) => mov.tipo === "variavel").length;

        const maiorDespesa = movimentacoes
          .filter((mov) => mov.tipo === "despesa")
          .reduce((max, mov) => (mov.valor > max ? mov.valor : max), 0);

        // Economia
        const economia = receitas - despesas;

        // Atualizar o estado com os cálculos
        setResumo({
          receitas,
          despesas,
          despesasFixas,
          despesasVariaveis,
          maiorDespesa,
          economia,
          qtdDespesasFixas, // Atualizando a quantidade de despesas fixas
          qtdDespesasVariaveis, // Atualizando a quantidade de despesas variáveis
        });
      } catch (error) {
        console.error("Erro ao buscar movimentações:", error);
      }
    };

    fetchDados();
  }, []);


  return (
    <div className="flex min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl w-full mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Meu Perfil</h1>

        {/* Informações do Usuário */}
        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-700">Email: <span className="font-normal">{user?.email}</span></h2>
        </div>

        {/* Resumo das Movimentações */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-blue-600">Receitas</h3>
            <p className="text-xl font-semibold text-gray-800">R$ {resumo.receitas.toFixed(2)}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-red-600">Despesas</h3>
            <p className="text-xl font-semibold text-gray-800">R$ {resumo.despesas.toFixed(2)}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-green-600">Economia</h3>
            <p className="text-xl font-semibold text-gray-800">R$ {resumo.economia.toFixed(2)}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-yellow-600">Maior Despesa</h3>
            <p className="text-xl font-semibold text-gray-800">R$ {resumo.maiorDespesa.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
