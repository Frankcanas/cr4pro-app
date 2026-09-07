import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Users, CalendarDays, Home, Menu, X, LogIn, LogOut } from 'lucide-react';

import { RegisterView } from './views/RegisterView';
import { AttendanceView } from './views/AttendanceView';
import { LoginView } from './views/LoginView';

const HomeView = () => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] text-center animate-fade-in px-4">
    <div className="relative group cursor-pointer animate-rev mt-10 md:mt-0">
      <div className="absolute inset-0 bg-brand-yellow rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
      <img 
        src="/logo.jpeg" 
        alt="Cr4Pro Barranquilla Logo" 
        className="w-56 h-56 md:w-80 md:h-80 object-cover rounded-full relative z-10 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] border-4 border-brand-black"
      />
    </div>
    
    <div className="mt-8 md:mt-12 space-y-4 w-full">
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-oswald text-transparent bg-clip-text bg-gradient-to-b from-brand-yellow to-yellow-700 drop-shadow-sm leading-tight">
        CLUB BIKER<br className="md:hidden" /> CR4 PRO
      </h1>
      <h2 className="text-2xl md:text-4xl text-gray-200 tracking-widest font-oswald">BARRANQUILLA</h2>
      
      <div className="flex items-center justify-center gap-2 md:gap-4 mt-6 md:mt-8">
        <div className="h-[1px] w-8 md:w-16 bg-brand-yellow"></div>
        <p className="text-lg md:text-2xl italic text-gray-400 font-roboto font-light text-center px-2">"Sumando KM a la vida"</p>
        <div className="h-[1px] w-8 md:w-16 bg-brand-yellow"></div>
      </div>
    </div>
  </div>
);

const NavLink = ({ to, icon: Icon, children, onClick }: { to: string, icon: any, children: React.ReactNode, onClick?: () => void }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 md:py-2 rounded-lg transition-all duration-300 font-oswald text-lg md:text-lg tracking-wide w-full md:w-auto
        ${isActive 
          ? 'bg-brand-yellow text-brand-black shadow-[0_0_15px_rgba(255,215,0,0.4)]' 
          : 'text-gray-300 hover:text-brand-yellow hover:bg-white/5'
        }`}
    >
      <Icon size={22} className={isActive ? 'text-brand-black' : ''} /> 
      {children}
    </Link>
  );
};

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuth(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuth(false);
  };

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuth ? <>{children}</> : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col selection:bg-brand-yellow selection:text-black relative z-0">
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid #FFD700',
              fontFamily: 'Roboto, sans-serif'
            }
          }} 
        />
        
        {/* Navigation Bar */}
        <nav className="glass-panel sticky top-0 z-50 border-b border-brand-yellow/30 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link to="/" className="flex items-center gap-3 md:gap-4 group z-50" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="overflow-hidden rounded-full border-2 border-brand-yellow/50 group-hover:border-brand-yellow transition-colors shadow-[0_0_10px_rgba(255,215,0,0.3)] shrink-0">
                  <img src="/logo.jpeg" alt="Logo Pequeño" className="w-10 h-10 md:w-12 md:h-12 object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl md:text-2xl font-black text-brand-yellow font-oswald tracking-wider leading-none">CR4 PRO</span>
                  <span className="text-[10px] md:text-xs text-gray-400 font-oswald tracking-widest">BARRANQUILLA</span>
                </div>
              </Link>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex gap-4">
                <NavLink to="/" icon={Home}>Inicio</NavLink>
                {isAuth && (
                  <>
                    <NavLink to="/registro" icon={Users}>Pilotos</NavLink>
                    <NavLink to="/asistencia" icon={CalendarDays}>Asistencia</NavLink>
                  </>
                )}
                {isAuth ? (
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-white/5 transition-all duration-300 font-oswald text-lg tracking-wide">
                    <LogOut size={20} /> Salir
                  </button>
                ) : (
                  <NavLink to="/login" icon={LogIn}>Lideres</NavLink>
                )}
              </div>

              {/* Mobile Menu Toggle Button */}
              <div className="md:hidden flex items-center z-50">
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-brand-yellow hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <div className={`md:hidden absolute top-20 left-0 w-full glass-panel border-b border-brand-yellow/30 transition-all duration-300 ease-in-out origin-top ${isMobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
            <div className="flex flex-col p-4 gap-2 shadow-2xl">
              <NavLink to="/" icon={Home} onClick={() => setIsMobileMenuOpen(false)}>Inicio</NavLink>
              {isAuth && (
                <>
                  <NavLink to="/registro" icon={Users} onClick={() => setIsMobileMenuOpen(false)}>Pilotos</NavLink>
                  <NavLink to="/asistencia" icon={CalendarDays} onClick={() => setIsMobileMenuOpen(false)}>Asistencia</NavLink>
                </>
              )}
              {isAuth ? (
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-white/5 transition-all duration-300 font-oswald text-lg tracking-wide w-full text-left">
                  <LogOut size={22} /> Salir
                </button>
              ) : (
                <NavLink to="/login" icon={LogIn} onClick={() => setIsMobileMenuOpen(false)}>Lideres</NavLink>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 py-6 md:py-8 relative">
          {/* Subtle background decoration */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[800px] md:h-[800px] bg-brand-yellow opacity-[0.03] rounded-full blur-[80px] pointer-events-none -z-10"></div>

          
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/login" element={<LoginView setAuth={setIsAuth} />} />
            <Route path="/registro" element={<ProtectedRoute><RegisterView /></ProtectedRoute>} />
            <Route path="/asistencia" element={<ProtectedRoute><AttendanceView /></ProtectedRoute>} />
          </Routes>
        </main>

        <footer className="glass-panel border-t border-brand-yellow/20 p-8 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo.jpeg" alt="Logo Footer" className="w-8 h-8 rounded-full grayscale opacity-50" />
              <p className="font-oswald text-gray-500 tracking-wider">CLUB BIKER CR4 PRO BARRANQUILLA</p>
            </div>
            <p className="text-sm text-gray-600 font-roboto">
              &copy; {new Date().getFullYear()} - Todos los derechos reservados. Sumando KM a la vida.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
