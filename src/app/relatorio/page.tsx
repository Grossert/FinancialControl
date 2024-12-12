"use client";

import { useEffect, useState, useRef } from "react";
import { getMovimentacoes } from "@/service/movimentacaoServices";
import { jsPDF } from "jspdf";
import Chart from "chart.js/auto";

interface Movimentacao {
  descricao: string;
  valor: number;
  data: string;
  tipo: string;
  situacao: string;
}

export default function Relatorio() {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
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
  const [filtro, setFiltro] = useState({
    tipo: "",
    situacao: "",
  });

  const graficoRef = useRef<Chart | null>(null);

  useEffect(() => {
    const fetchMovimentacoes = async () => {
      const data = await getMovimentacoes();
      setMovimentacoes(data);

      // Calcular os dados do resumo
      const receitas = data
        .filter((mov) => mov.tipo === "receita")
        .reduce((acc, mov) => acc + mov.valor, 0);
      const despesas = data
        .filter((mov) => mov.tipo === "despesa")
        .reduce((acc, mov) => acc + mov.valor, 0);
      const despesasFixas = data
        .filter((mov) => mov.tipo === "fixa")
        .reduce((acc, mov) => acc + mov.valor, 0);
      const despesasVariaveis = data
        .filter((mov) => mov.tipo === "variavel")
        .reduce((acc, mov) => acc + mov.valor, 0);

      const maiorDespesa = data
        .filter((mov) => mov.tipo === "despesa")
        .reduce((max, mov) => (mov.valor > max ? mov.valor : max), 0);

      const economia = receitas - despesas;

      const qtdDespesasFixas = data.filter((mov) => mov.tipo === "fixa").length;
      const qtdDespesasVariaveis = data.filter((mov) => mov.tipo === "variavel").length;

      setResumo({
        receitas,
        despesas,
        despesasFixas,
        despesasVariaveis,
        maiorDespesa,
        economia,
        qtdDespesasFixas,
        qtdDespesasVariaveis,
      });
    };

    fetchMovimentacoes();
  }, []);

  const movimentacoesFiltradas = movimentacoes.filter((mov) => {
    return (
      (filtro.tipo ? mov.tipo === filtro.tipo : true) &&
      (filtro.situacao ? mov.situacao === filtro.situacao : true)
    );
  });

  const gerarRelatorioPDF = () => {
    const doc = new jsPDF();

    // Cabeçalho do PDF
    doc.text("Relatório de Movimentações", 10, 10);

    // Resumo financeiro
    doc.text("Resumo Financeiro", 10, 20);
    doc.text(`Total de Receitas: R$ ${resumo.receitas.toFixed(2)}`, 10, 30);
    doc.text(`Total de Despesas: R$ ${resumo.despesas.toFixed(2)}`, 10, 40);
    doc.text(`Maior Despesa: R$ ${resumo.maiorDespesa.toFixed(2)}`, 10, 70);
    doc.text(`Economia: R$ ${resumo.economia.toFixed(2)}`, 10, 80);

    // Detalhes das movimentações
    doc.text("Detalhes das Movimentações", 10, 110);

    let yPosition = 120; // Iniciar a posição vertical para as movimentações

    movimentacoesFiltradas.forEach((mov, index) => {
      doc.text(`Descrição: ${mov.descricao}`, 10, yPosition);
      yPosition += 10; // Incrementa a posição vertical após a descrição

      doc.text(`Valor: R$ ${mov.valor.toFixed(2)}`, 10, yPosition);
      yPosition += 10;

      doc.text(`Data: ${mov.data}`, 10, yPosition);
      yPosition += 10;

      doc.text(`Tipo: ${mov.tipo}`, 10, yPosition);
      yPosition += 10;

      doc.text(`Situação: ${mov.situacao}`, 10, yPosition);
      yPosition += 15; // Aumenta o espaçamento entre cada movimentação
    });

    doc.save("relatorio_financeiro.pdf");
  };

  useEffect(() => {
    const canvas = document.getElementById("graficoResumo") as HTMLCanvasElement | null;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        if (graficoRef.current) {
          graficoRef.current.destroy();
        }

        const novoGrafico = new Chart(ctx, {
          type: "pie",
          data: {
            labels: ["Receitas", "Despesas"],
            datasets: [
              {
                data: [
                  movimentacoes.filter((mov) => mov.tipo === "receita").length,
                  movimentacoes.filter((mov) => mov.tipo === "despesa").length,
                ],
                backgroundColor: ["#4CAF50", "#FF5722"],
              },
            ],
          },
        });

        graficoRef.current = novoGrafico;
      }
    }
  }, [movimentacoes]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Relatórios</h1>

      <div style={{ marginBottom: "20px" }}>
        <label>
          Tipo:
          <select
            value={filtro.tipo}
            onChange={(e) => setFiltro({ ...filtro, tipo: e.target.value })}
          >
            <option value="">Todos</option>
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>
        </label>

        <label style={{ marginLeft: "10px" }}>
          Situação:
          <select
            value={filtro.situacao}
            onChange={(e) => setFiltro({ ...filtro, situacao: e.target.value })}
          >
            <option value="">Todas</option>
            <option value="pago">Pago</option>
            <option value="pendente">Pendente</option>
          </select>
        </label>

        <button
          onClick={gerarRelatorioPDF}
          style={{
            marginLeft: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Exportar para PDF
        </button>
      </div>

      <canvas
        id="graficoResumo"
        width="400"
        height="200"
        style={{ marginBottom: "20px" }}
      ></canvas>

      <ul>
        {movimentacoesFiltradas.map((mov, index) => (
          <li key={index}>
            {mov.descricao} - {mov.valor} - {mov.data} - {mov.tipo} - {mov.situacao}
          </li>
        ))}
      </ul>
    </div>
  );
}
