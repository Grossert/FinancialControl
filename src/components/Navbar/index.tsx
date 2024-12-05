import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          <Link href="/">FinancialControl</Link>
        </div>
        <div className="lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Links da barra de navegação */}
        <div className="hidden lg:flex space-x-6">
          <Link href="/" className="text-white hover:text-gray-300">
            Início
          </Link>
          <Link href="/cadastro" className="text-white hover:text-gray-300">
            Cadastro
          </Link>
          <Link href="/movimentacao" className="text-white hover:text-gray-300">
            Movimentação
          </Link>
          <Link href="/relatorio" className="text-white hover:text-gray-300">
            Relatórios
          </Link>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4">
          <Link href="/" className="block text-white py-2 hover:text-gray-300">
            Início
          </Link>
          <Link
            href="/cadastro"
            className="block text-white py-2 hover:text-gray-300"
          >
            Cadastro de Movimentação
          </Link>
          <Link href="/ver" className="block text-white py-2 hover:text-gray-300">
            Ver Movimentação
          </Link>
          <Link
            href="/relatorios"
            className="block text-white py-2 hover:text-gray-300"
          >
            Relatórios
          </Link>
        </div>
      )}
    </nav>
  );
};