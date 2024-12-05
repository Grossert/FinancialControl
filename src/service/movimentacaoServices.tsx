import { collection, addDoc, getDocs , Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebaseconfig'

export interface Movimentacao {
  descricao: string;
  valor: number;
  data: string | Timestamp;
  tipo: string;
}

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

export async function getMovimentacoes(): Promise<Movimentacao[]> {
    try {
      const movimentacoesRef = collection(firestore, 'movimentacoes');
      const snapshot = await getDocs(movimentacoesRef);
        const movimentacoes: Movimentacao[] = snapshot.docs.map(doc => {
        const data = doc.data() as Movimentacao;
        const dataFormatada = data.data instanceof Timestamp
          ? data.data.toDate().toLocaleDateString()
          : data.data;
  
        return {
          ...data,
          data: dataFormatada,
        };
      });
  
      console.log('Movimentações recuperadas com sucesso:', movimentacoes);
      return movimentacoes;
    } catch (error) {
      console.error('Erro ao recuperar movimentações: ', error);
      throw new Error('Erro ao recuperar movimentações');
    }
  }


  
