import { useAuthStore } from '../store/authStore';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import { Button } from './ui/Button';
import { useState } from 'react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, clearAuth, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    navigate('/sign-in');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg" />
              <span className="font-bold text-lg text-gray-900 hidden sm:inline">
                RPA Platform
              </span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Desktop menu */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  로그아웃
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex gap-2">
                <Link to="/sign-in">
                  <Button variant="secondary" size="sm">
                    로그인
                  </Button>
                </Link>
                <Link to="/sign-up">
                  <Button size="sm">
                    회원가입
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden border-t border-gray-200 py-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="px-2 py-2 text-sm">
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className="text-gray-500 text-xs">{user?.email}</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    로그아웃
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/sign-in" className="block">
                    <Button variant="secondary" size="sm" className="w-full">
                      로그인
                    </Button>
                  </Link>
                  <Link to="/sign-up" className="block">
                    <Button size="sm" className="w-full">
                      회원가입
                    </Button>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
