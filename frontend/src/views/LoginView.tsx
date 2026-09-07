import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Shield, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LoginView = ({ setAuth }: { setAuth: (val: boolean) => void }) => {
  const [licensePlate, setLicensePlate] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post('/api/auth/login', { licensePlate: licensePlate.toUpperCase(), password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      setAuth(true);
      toast.success(`Bienvenido Lider ${res.data.fullName}`);
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Acceso denegado');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto animate-fade-in mt-10">
      <div className="glass-panel p-8 relative overflow-hidden text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-brand-yellow/10 rounded-full border border-brand-yellow/30">
            <Shield className="text-brand-yellow w-12 h-12" />
          </div>
        </div>
        
        <h2 className="text-3xl text-white font-oswald font-bold tracking-wide mb-2">ZONA DE <span className="text-brand-yellow">LIDERES</span></h2>
        <p className="text-gray-400 font-roboto mb-8">Acceso restringido al alto mando del club</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative text-left">
            <label className="block text-sm font-oswald tracking-widest mb-2 text-brand-yellow uppercase">Placa Lider</label>
            <input
              type="text"
              required
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              className="w-full bg-black/50 border border-brand-yellow/30 p-3 text-white focus:outline-none focus:border-brand-yellow font-oswald text-xl uppercase tracking-widest"
              placeholder="ABC12D"
            />
          </div>

          <div className="relative text-left">
            <label className="block text-sm font-oswald tracking-widest mb-2 text-brand-yellow uppercase">Contraseña</label>
            <div className="relative">
              <Lock className="absolute right-3 top-3.5 text-brand-yellow/50" size={20} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-brand-yellow/30 p-3 text-white focus:outline-none focus:border-brand-yellow pr-10"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-yellow text-black font-oswald font-bold text-xl tracking-widest py-3 mt-4 hover:bg-white transition-all duration-300 disabled:opacity-50"
          >
            {isSubmitting ? 'VERIFICANDO...' : 'ENTRAR AL SISTEMA'}
          </button>
        </form>
      </div>
    </div>
  );
};
