'use client';

import { useState, useEffect } from "react";
import { cadastrar, getMovimentacoes } from "@/service/movimentacaoServices";
import pdfMake from "pdfmake/build/pdfmake"; // Importação correta
import { vfs } from "pdfmake/build/vfs_fonts"; // Importa vfs corretamente


// Configuração do pdfMake.vfs
pdfMake.vfs = vfs;

export default function Cadastro() {
  const [tipo, setTipo] = useState<string>("receita");
  const [caracteristica, setCaracteristica] = useState<string>("variavel");
  const [isFixa, setIsFixa] = useState<boolean>(false);
  const [meses, setMeses] = useState<number>(1);
  const [descricao, setDescricao] = useState<string>("");
  const [valor, setValor] = useState<number>(0);
  const [data, setData] = useState<string>("");
  const [situacao, setSituacao] = useState<string>("pago");

  const [movimentacoes, setMovimentacoes] = useState<any[]>([]); // Armazenar movimentações recuperadas

  // Função de envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const movimentacao = {
      id: 'umIDunico',
      tipo,
      caracteristica,
      isFixa,
      meses,
      descricao,
      valor,
      data,
      situacao,
    };

    try {
      const id = await cadastrar(movimentacao);
      console.log("Movimentação cadastrada com sucesso:", id);

      // Resetando os campos após o cadastro
      setTipo("receita");
      setCaracteristica("variavel");
      setIsFixa(false);
      setMeses(1);
      setDescricao("");
      setValor(0);
      setData("");
      setSituacao("pago");

      // Recarregar as movimentações após cadastro
      const movimentacoesRecuperadas = await getMovimentacoes();
      setMovimentacoes(movimentacoesRecuperadas);
    } catch (error) {
      console.error("Erro ao cadastrar movimentação:", error);
    }
  };

  // Função para gerar o relatório em PDF
  const gerarRelatorioPDF = () => {
    const movimentacoesFormatadas = movimentacoes.map((mov) => ({
      Descrição: mov.descricao,
      Valor: `R$ ${mov.valor.toFixed(2)}`,
      Tipo: mov.tipo,
      Característica: mov.caracteristica,
      Data: mov.data,
      Situação: mov.situacao,
    }));

    const docDefinition: any = {
      content: [
        { text: 'Relatório de Movimentações', style: 'header' },
        { text: 'Lista de movimentações realizadas:', margin: [0, 10] },
        {
          table: {
            widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              ['Descrição', 'Valor', 'Tipo', 'Característica', 'Data', 'Situação'],
              ...movimentacoesFormatadas.map((mov) => [
                mov.Descrição,
                mov.Valor,
                mov.Tipo,
                mov.Característica,
                mov.Data,
                mov.Situação,
              ]),
            ],
          },
          layout: 'lightHorizontalLines', // Layout da tabela
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10], alignment: 'center' },
      },
    };
    
    pdfMake.createPdf(docDefinition).open();
    
  };

  // Recuperar movimentações quando o componente for montado
  useEffect(() => {
    const fetchMovimentacoes = async () => {
      try {
        const movimentacoesRecuperadas = await getMovimentacoes();
        setMovimentacoes(movimentacoesRecuperadas);
      } catch (error) {
        console.error("Erro ao recuperar movimentações:", error);
      }
    };

    fetchMovimentacoes();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
        <h2 className="text-2xl font-bold text-center text-blue-600">Cadastro de Movimentação</h2>

        {/* Formulário de cadastro, com campos já existentes */}
        <div className="flex justify-between items-center">
          <label className="text-gray-700">Tipo de Movimentação</label>
          <select
            value={tipo}
            onChange={(e) => {
              setTipo(e.target.value);
              setCaracteristica("variavel");
            }}
            className="border border-gray-300 rounded p-2"
          >
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>
        </div>

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

        {/* Outros campos do formulário omitidos por brevidade */}

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white rounded p-2 w-48 hover:bg-blue-700 w-full">
            Cadastrar
          </button>
        </div>
      </form>

      {/* Botão para gerar o relatório PDF */}
      <div className="flex justify-center mt-6">
        <button
          onClick={gerarRelatorioPDF}
          className="bg-green-600 text-white rounded p-2 w-48 hover:bg-green-700 w-full">
          Gerar Relatório PDF
        </button>
      </div>
    </div>
  );
}
