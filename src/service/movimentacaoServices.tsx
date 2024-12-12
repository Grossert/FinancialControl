import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebaseconfig';

export interface Movimentacao {
  id: string;
  descricao: string;
  valor: number;
  data: any;
  tipo: string;
  situacao: string; 
  caracteristica: string;
}

// Função de cadastro de movimentação
export async function cadastrar(movimentacao: Movimentacao) {
  try { 
    const movimentacoesRef = collection(firestore, 'movimentacoes');
    let dataFormatada: Timestamp;

    if (movimentacao.data instanceof Timestamp) {
      dataFormatada = movimentacao.data;
    } else {
      dataFormatada = Timestamp.fromDate(new Date(movimentacao.data));
    }

    const movimentacaoComData = {
      ...movimentacao,
      data: dataFormatada,
    };

    const docRef = await addDoc(movimentacoesRef, movimentacaoComData);
    console.log('Movimentação cadastrada com sucesso: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao cadastrar movimentação: ', error);
    throw new Error('Erro ao cadastrar movimentação');
  }
}

// Função para recuperar movimentações
export async function getMovimentacoes(): Promise<Movimentacao[]> {
  try {
    const movimentacoesRef = collection(firestore, 'movimentacoes');
    const snapshot = await getDocs(movimentacoesRef);

    const movimentacoes: Movimentacao[] = snapshot.docs.map((doc) => {
      const data = doc.data() as Omit<Movimentacao, 'id'>; // Excluindo 'id' do tipo aqui

      // Verifica se o campo 'data' é um Timestamp e formata a data corretamente
      const dataFormatada = data.data instanceof Timestamp
        ? data.data.toDate().toLocaleDateString()
        : data.data;

      // Retorna o objeto com todos os dados necessários
      return {
        ...data,
        id: doc.id, // Atribuindo o id do documento
        data: dataFormatada, // Formatação da data
      };
    });

    console.log('Movimentações recuperadas com sucesso:', movimentacoes);
    return movimentacoes;
  } catch (error) {
    console.error('Erro ao recuperar movimentações: ', error);
    throw new Error('Erro ao recuperar movimentações');
  }
}

// Função para gerar relatório PDF
export const gerarRelatorioPDF = (movimentacoes: Movimentacao[]) => {
  import('jspdf').then(({ jsPDF }) => {
    const doc = new jsPDF();

    doc.text("Relatório de Movimentações", 10, 10);
    
    movimentacoes.forEach((mov, index) => {
      doc.text(`Descrição: ${mov.descricao}`, 10, 20 + index * 10);
      doc.text(`Valor: ${mov.valor}`, 10, 30 + index * 10);
      doc.text(`Data: ${mov.data}`, 10, 40 + index * 10);
    });

    doc.save("relatorio_movimentacoes.pdf");
  });
};
