export default function Home() {
  // Dados simulados
  const resumo = {
    receitas: 8500,
    despesas: 5200,
    despesasFixas: 7,
    despesasVariaveis: 12,
    maiorDespesa: 1500, // Valor da maior despesa
    economia: 3300, // Economia calculada
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800 p-6 sm:p-12 font-sans">
      {/* Cabeçalho */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Dashboard Financeiro</h1>
        <p className="text-gray-600">Acompanhe suas finanças de forma clara e prática</p>
      </header>

      {/* Grid principal */}
      <main className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Resumo do Mês */}
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-gray-700">Resumo do Mês</h2>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span>Total de Receitas:</span>
              <span className="text-green-600 font-bold">R$ {resumo.receitas.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Total de Despesas:</span>
              <span className="text-red-600 font-bold">R$ {resumo.despesas.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Saldo Final:</span>
              <span className="text-blue-600 font-bold">
                R$ {(resumo.receitas - resumo.despesas).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Estatísticas de Despesas Fixas */}
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-gray-700">Despesas Fixas</h2>
          <p className="mt-4 text-4xl font-bold text-blue-500 text-center">
            {resumo.despesasFixas}
          </p>
          <p className="text-center text-gray-600">despesas fixas no mês</p>
        </div>

        {/* Estatísticas de Despesas Variáveis */}
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-gray-700">Despesas Variáveis</h2>
          <p className="mt-4 text-4xl font-bold text-purple-500 text-center">
            {resumo.despesasVariaveis}
          </p>
          <p className="text-center text-gray-600">despesas variáveis no mês</p>
        </div>

        {/* Economia do Mês */}
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-gray-700">Economia</h2>
          <p className="mt-4 text-4xl font-bold text-green-500 text-center">
            R$ {resumo.economia.toFixed(2)}
          </p>
          <p className="text-center text-gray-600">guardado no mês</p>
        </div>

        {/* Maior Despesa */}
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-gray-700">Maior Despesa</h2>
          <p className="mt-4 text-4xl font-bold text-red-500 text-center">
            R$ {resumo.maiorDespesa.toFixed(2)}
          </p>
          <p className="text-center text-gray-600">registrada no mês</p>
        </div>

        {/* Total de Movimentações */}
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-gray-700">Movimentações</h2>
          <p className="mt-4 text-4xl font-bold text-gray-700 text-center">
            {resumo.despesasFixas + resumo.despesasVariaveis}
          </p>
          <p className="text-center text-gray-600">movimentações totais</p>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="mt-12 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Dashboard Financeiro. Todos os direitos reservados.
      </footer>
    </div>
  );
}
