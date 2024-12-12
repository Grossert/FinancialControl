import { useEffect, useState } from "react";
import { getMovimentacoes, gerarRelatorioPDF } from "@/service/movimentacaoServices"; // Corrigido para a importação do serviço

export default function Relatorio() {
  const [movimentacoes, setMovimentacoes] = useState<any[]>([]);

  // Função para carregar as movimentações do Firestore
  const loadMovimentacoes = async () => {
    const dados = await getMovimentacoes();
    setMovimentacoes(dados);
  };

  // Carregar as movimentações assim que o componente for montado
  useEffect(() => {
    loadMovimentacoes();
  }, []);

  return (
    <div>
      <h1>Relatório de Movimentações</h1>
      <div>
        {movimentacoes.map((mov, index) => (
          <div key={index}>
            <p>{mov.descricao} - {mov.valor} - {mov.data}</p>
          </div>
        ))}
      </div>

      <button onClick={() => gerarRelatorioPDF(movimentacoes)}>Gerar Relatório PDF</button>
    </div>
  );
}
