
'use client';

import { useState } from "react";

export default function Cadastro() {
  // Estados do formulário
  const [tipo, setTipo] = useState<string>("receita"); // 'receita' ou 'despesa'
  const [caracteristica, setCaracteristica] = useState<string>("variavel"); // 'fixa' ou 'variavel'
  const [isFixa, setIsFixa] = useState<boolean>(false); // Para saber se é fixa
  const [meses, setMeses] = useState<number>(1); // Meses se for fixa
  const [descricao, setDescricao] = useState<string>("");
  const [valor, setValor] = useState<number>(0);
  const [data, setData] = useState<string>("");
  const [situacao, setSituacao] = useState<string>("pago"); // Para situação de despesa

  // Função de envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const movimentacao = {
      tipo,
      caracteristica,
      isFixa,
      meses,
      descricao,
      valor,
      data,
      situacao,
    };
    console.log("Movimentação Cadastrada:", movimentacao);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-center text-blue-600">Cadastro de Movimentação</h2>

      {/* Tipo de Movimentação (Receita ou Despesa) */}
      <div className="flex justify-between items-center">
        <label className="text-gray-700">Tipo de Movimentação</label>
        <select
          value={tipo}
          onChange={(e) => {
            setTipo(e.target.value);
            setCaracteristica("variavel"); // Resetando para "variável" ao mudar o tipo
          }}
          className="border border-gray-300 rounded p-2"
        >
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>
      </div>

      {/* Característica (Fixa ou Variável) */}
      <div className="flex justify-between items-center">
        <label className="text-gray-700">Característica</label>
        <select
          value={caracteristica}
          onChange={(e) => setCaracteristica(e.target.value)}
          className="border border-gray-300 rounded p-2"
        >
          <option value="variavel">Variável</option>
          <option value="fixa">Fixa</option>
        </select>
      </div>

      {/* Se for despesa fixa, escolha o número de meses */}
      {caracteristica === "fixa" && tipo === "despesa" && (
        <div className="flex justify-between items-center">
          <label className="text-gray-700">Quantos meses?</label>
          <input
            type="number"
            value={meses}
            onChange={(e) => setMeses(Number(e.target.value))}
            min={1}
            className="border border-gray-300 rounded p-2"
          />
        </div>
      )}

      {/* Descrição da Movimentação */}
      <div className="flex flex-col">
        <label className="text-gray-700">Descrição</label>
        <input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
          className="border border-gray-300 rounded p-2"
        />
      </div>

      {/* Valor da Movimentação */}
      <div className="flex flex-col">
        <label className="text-gray-700">Valor</label>
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(Number(e.target.value))}
          required
          className="border border-gray-300 rounded p-2"
        />
      </div>

      {/* Data da Movimentação */}
      <div className="flex flex-col">
        <label className="text-gray-700">Data</label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
          className="border border-gray-300 rounded p-2"
        />
      </div>

      {/* Situação da Despesa (Aparece apenas se for uma despesa) */}
      {tipo === "despesa" && (
        <div className="flex justify-between items-center">
          <label className="text-gray-700">Situação</label>
          <select
            value={situacao}
            onChange={(e) => setSituacao(e.target.value)}
            className="border border-gray-300 rounded p-2"
          >
            <option value="pago">Pago</option>
            <option value="pendente">Pendente</option>
          </select>
        </div>
      )}

      {/* Botão de Submissão */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-blue-600 text-white rounded p-2 w-48 hover:bg-blue-700 w-full">
          Cadastrar
        </button>
      </div>
    </form>
  );
};