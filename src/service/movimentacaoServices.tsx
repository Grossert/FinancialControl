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

// Função para editar uma movimentação
export async function editarMovimentacao(id: string, movimentacao: Partial<Movimentacao>): Promise<void> {
  try {
    const docRef = doc(firestore, 'movimentacoes', id);
    await updateDoc(docRef, movimentacao);
    console.log('Movimentação editada com sucesso:', id);
  } catch (error) {
    console.error('Erro ao editar movimentação:', error);
    throw new Error('Erro ao editar movimentação');
  }
}

// Função para deletar uma movimentação
export async function deletarMovimentacao(id: string): Promise<void> {
  try {
    const docRef = doc(firestore, 'movimentacoes', id);
    await deleteDoc(docRef);
    console.log('Movimentação deletada com sucesso:', id);
  } catch (error) {
    console.error('Erro ao deletar movimentação:', error);
    throw new Error('Erro ao deletar movimentação');
  }
}

// Função para gerar relatório PDF
export const gerarRelatorioPDF = (movimentacoes: Movimentacao[]) => {
  import('jspdf').then(({ jsPDF }) => {
    const doc = new jsPDF();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Relatório de Movimentações', 10, 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    movimentacoes.forEach((mov, index) => {
      const y = 20 + index * 10;
      doc.text(`Descrição: ${mov.descricao}`, 10, y);
      doc.text(`Valor: R$ ${mov.valor.toFixed(2)}`, 10, y + 5);
      doc.text(`Data: ${mov.data}`, 10, y + 10);
      doc.text(`Tipo: ${mov.tipo}`, 100, y);
      doc.text(`Situação: ${mov.situacao}`, 100, y + 5);
      doc.text(`Característica: ${mov.caracteristica}`, 100, y + 10);
    });

    doc.save('relatorio_movimentacoes.pdf');
  });
};