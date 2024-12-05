"use client"

import React, { useEffect, useState } from "react";
import { getMovimentacoes } from "@/service/movimentacaoServices"; // Função para buscar as movimentações

export default function Home() {
  const [resumo, setResumo] = useState({
    receitas: 0,
    despesas: 0,
    despesasFixas: 0,
    despesasVariaveis: 0,
    maiorDespesa: 0,
    economia: 0,
    qtdDespesasFixas: 0, // Quantidade de despesas fixas
    qtdDespesasVariaveis: 0, // Quantidade de despesas variáveis
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800 p-6 sm:p-12 font-sans">
      {/* Cabeçalho */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Dashboard Financeiro</h1>
        <p className="text-gray-600">Acompanhe suas finanças de forma clara e prática</p>
      </header>

      {/* Grid principal */}
      <main className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Resumo do Mês */}
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-gray-700">Resumo do Mês</h2>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span>Total de Receitas:</span>
              <span className="text-green-600 font-bold">R$ {resumo.receitas.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Total de Despesas:</span>
              <span className="text-red-600 font-bold">R$ {resumo.despesas.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Economia do Mês */}
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-gray-700">Economia</h2>
          <p className="mt-4 text-4xl font-bold text-green-500 text-center">
            R$ {resumo.economia.toFixed(2)}
          </p>
          <p className="text-center text-gray-600">guardado no mês</p>
        </div>

        {/* Maior Despesa */}
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-gray-700">Maior Despesa</h2>
          <p className="mt-4 text-4xl font-bold text-red-500 text-center">
            R$ {resumo.maiorDespesa.toFixed(2)}
          </p>
          <p className="text-center text-gray-600">registrada no mês</p>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="mt-12 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Dashboard Financeiro. Todos os direitos reservados.
      </footer>
    </div>
  );
}
