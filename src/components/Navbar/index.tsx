import Link from 'next/link';
import { useState } from 'react';
// Contexts
import { useUser } from '@/contexts/authUser';
// Hooks
import { logout } from '@/hooks/auth';

export default function Navbar() {
  const { user, setUser } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout(); // Call the logout function
    setUser(null); // Reset the user context after logging out
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

        <div className="hidden lg:flex space-x-6">

          {user && (
            <>
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
              <Link href="/perfil" className="text-white hover:text-gray-300">
                Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-300">
                Logout
              </button>
            </>
          )}

          {!user && (
            <>
              <Link href="/login" className="text-white hover:text-gray-300">
                Login
              </Link>
              <Link href="/register" className="text-white hover:text-gray-300">
                Cadastrar Usuário
              </Link>
            </>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4">
          <Link href="/" className="block text-white py-2 hover:text-gray-300">
            Início
          </Link>
          <Link
            href="/cadastro"
            className="block text-white py-2 hover:text-gray-300">
            Cadastro de Movimentação
          </Link>
          <Link href="/ver" className="block text-white py-2 hover:text-gray-300">
            Ver Movimentação
          </Link>
          <Link
            href="/relatorios"
            className="block text-white py-2 hover:text-gray-300">
            Relatórios
          </Link>
          <Link
            href="/perfil"
            className="block text-white py-2 hover:text-gray-300">
            Perfil
          </Link>
          <button
                onClick={handleLogout}
                className="text-white hover:text-gray-300">
                Logout
              </button>

          {/* Conditionally render mobile login or logout */}
          {!user ? (
            <>
              <Link
                href="/login"
                className="block text-white py-2 hover:text-gray-300"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block text-white py-2 hover:text-gray-300"
              >
                Cadastrar Usuario
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="block text-white py-2 hover:text-gray-300"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
