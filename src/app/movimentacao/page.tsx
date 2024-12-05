'use client';

import { useState, useEffect } from 'react';
import { getMovimentacoes, editarMovimentacao, deletarMovimentacao } from '@/service/movimentacaoServices';
import { Movimentacao } from '@/service/movimentacaoServices';

export default function Movimentacao() {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false); // Controla o popup de edição
  const [currentMovimentacao, setCurrentMovimentacao] = useState<Movimentacao | null>(null); // Movimentação que está sendo editada
  const [formData, setFormData] = useState<Movimentacao>({
    id: '',
    descricao: '',
    valor: 0,
    data: '',
    tipo: '',
    situacao: '', // Nova propriedade
    caracteristica: '', // Nova propriedade
  }); // Dados do formulário para editar

  useEffect(() => {
    const fetchMovimentacoes = async () => {
      try {
        const data = await getMovimentacoes();
        setMovimentacoes(data);
      } catch (error) {
        console.error('Erro ao buscar movimentações:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovimentacoes();
  }, []);

  const handleEditClick = (movimentacao: Movimentacao) => {
    setCurrentMovimentacao(movimentacao);
    setFormData({
      id: movimentacao.id, // Passando o id também
      descricao: movimentacao.descricao,
      valor: movimentacao.valor,
      data: movimentacao.data,
      tipo: movimentacao.tipo,
      situacao: movimentacao.situacao, // Incluindo situação no formulário
      caracteristica: movimentacao.caracteristica, // Incluindo característica no formulário
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (currentMovimentacao) {
      try {
        await editarMovimentacao(currentMovimentacao.id, formData); // Passando o id e os dados editados
        setMovimentacoes((prev) =>
          prev.map((mov) =>
            mov.id === currentMovimentacao.id ? { ...mov, ...formData } : mov
          )
        );
        setIsEditing(false); // Fecha o popup
      } catch (error) {
        console.error('Erro ao editar movimentação:', error);
      }
    }
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await deletarMovimentacao(id);
      setMovimentacoes(movimentacoes.filter((mov) => mov.id !== id)); // Remove a movimentação da lista
    } catch (error) {
      console.error('Erro ao deletar movimentação:', error);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Lista de Movimentações</h2>

      {movimentacoes.length === 0 ? (
        <p className="text-center">Nenhuma movimentação encontrada.</p>
      ) : (
        <ul className="space-y-4">
          {movimentacoes.map((mov) => (
            <li key={mov.id} className="p-4 border border-gray-300 rounded-md shadow-md">
              <p><strong>Descrição:</strong> {mov.descricao}</p>
              <p><strong>Valor:</strong> R$ {mov.valor}</p>
              <p><strong>Data:</strong> {mov.data}</p>
              <p><strong>Tipo:</strong> {mov.tipo}</p>
              <p><strong>Situação:</strong> {mov.situacao}</p> {/* Exibindo a Situação */}
              <p><strong>Característica:</strong> {mov.caracteristica}</p> {/* Exibindo a Característica */}

              <div className="mt-2">
                <button
                  className="bg-blue-600 text-white rounded p-2 mr-2 hover:bg-blue-700"
                  onClick={() => handleEditClick(mov)}>
                  Editar
                </button>
                <button
                  className="bg-red-600 text-white rounded p-2 hover:bg-red-700"
                  onClick={() => handleDeleteClick(mov.id)}>
                  Deletar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Popup de Edição */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md w-1/3">
            <h3 className="text-xl font-bold mb-4">Editar Movimentação</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Descrição</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Valor</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Data</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Tipo</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Situação</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  value={formData.situacao}
                  onChange={(e) => setFormData({ ...formData, situacao: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Característica</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  value={formData.caracteristica}
                  onChange={(e) => setFormData({ ...formData, caracteristica: e.target.value })}
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  className="bg-gray-500 text-white rounded p-2 hover:bg-gray-600"
                  onClick={() => setIsEditing(false)}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
