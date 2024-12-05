import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebaseconfig'

export interface Movimentacao {
  descricao: string;
  valor: number;
  data: string;
  tipo: string;
}

export async function cadastrar(movimentacao: Movimentacao) {
  try {
    const movimentacoesRef = collection(firestore, 'movimentacoes');

    const movimentacaoComData = {
      ...movimentacao,
      data: Timestamp.fromDate(new Date(movimentacao.data)),
    };

    const docRef = await addDoc(movimentacoesRef, movimentacaoComData);
    console.log('Movimentação cadastrada com sucesso: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao cadastrar movimentação: ', error);
    throw new Error('Erro ao cadastrar movimentação');
  }
}
