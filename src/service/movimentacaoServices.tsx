import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebaseconfig'

export interface Movimentacao {
    id: string;
    descricao: string;
    valor: number;
    data: any;
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
      
      const movimentacoes: Movimentacao[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Movimentacao, 'id'>; // Excluindo 'id' do tipo aqui
        const dataFormatada = data.data instanceof Timestamp
          ? data.data.toDate().toLocaleDateString()
          : data.data;
          
        return {
          ...data,
          id: doc.id, // Atribuindo o id do documento
          data: dataFormatada
        };
      });
      
      console.log('Movimentações recuperadas com sucesso:', movimentacoes);
      return movimentacoes;
    } catch (error) {
      console.error('Erro ao recuperar movimentações: ', error);
      throw new Error('Erro ao recuperar movimentações');
    }
  }
  
  

  export async function editarMovimentacao(id: string, movimentacao: Movimentacao) {
    try {
      const movimentacaoRef = doc(firestore, 'movimentacoes', id);
      let dataFormatada: Timestamp;
      if (movimentacao.data instanceof Timestamp) {
        dataFormatada = movimentacao.data;
      } else {
        dataFormatada = Timestamp.fromDate(new Date(movimentacao.data));
      }

      await updateDoc(movimentacaoRef, {
        descricao: movimentacao.descricao,
        valor: movimentacao.valor,
        data: dataFormatada,
        tipo: movimentacao.tipo,
      });
  
      console.log('Movimentação editada com sucesso!');
    } catch (error) {
      console.error('Erro ao editar movimentação: ', error);
      throw new Error('Erro ao editar movimentação');
    }
  }

  export async function deletarMovimentacao(id: string) {
    try {
      const movimentacaoRef = doc(firestore, 'movimentacoes', id);
      await deleteDoc(movimentacaoRef);
  
      console.log('Movimentação deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar movimentação: ', error);
      throw new Error('Erro ao deletar movimentação');
    }
  }
  


  
