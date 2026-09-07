import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UserPlus, Settings, Hash, Shield } from 'lucide-react';

export const RegisterView = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    documentId: '',
    age: '',
    motorcycleModel: 'Cr4',
    otherModel: '',
    cylinderCapacity: '150',
    licensePlate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [users, setUsers] = useState<any[]>([]);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar este piloto?')) return;
    try {
      await axios.delete(`/api/users/${id}`);
      toast.success('Piloto eliminado');
      fetchUsers();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const handleUpdateRole = async (id: number, role: string) => {
    try {
      await axios.patch(`/api/users/${id}/role`, { role });
      toast.success('Rol actualizado');
      fetchUsers();
    } catch (error) {
      toast.error('Error al actualizar rol');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const model = formData.motorcycleModel === 'Others' ? formData.otherModel : formData.motorcycleModel;
      
      const payload = {
        fullName: formData.fullName,
        documentId: formData.documentId,
        age: parseInt(formData.age, 10),
        motorcycleModel: model,
        cylinderCapacity: parseInt(formData.cylinderCapacity, 10),
        licensePlate: formData.licensePlate.toUpperCase(),
        role: 'Aspirantes'
      };

      await axios.post('/api/users', payload);
      toast.success('Piloto registrado en las filas!');
      setFormData({
        fullName: '',
        documentId: '',
        age: '',
        motorcycleModel: 'Cr4',
        otherModel: '',
        cylinderCapacity: '150',
        licensePlate: '',
      });
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al registrar piloto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full bg-black/50 border border-brand-yellow/30 rounded-none p-3 md:p-4 text-white font-roboto focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all duration-300 backdrop-blur-sm";
  const labelClasses = "block text-xs md:text-sm font-oswald tracking-widest mb-1 md:mb-2 text-gray-400 uppercase";

  return (
    <div className="max-w-3xl mx-auto animate-fade-in mt-2 md:mt-4">
      <div className="glass-panel p-6 md:p-12 relative overflow-hidden">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-10 md:w-16 h-10 md:h-16 border-t-4 border-l-4 border-brand-yellow opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-10 md:w-16 h-10 md:h-16 border-b-4 border-r-4 border-brand-yellow opacity-50"></div>
        
        <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-10 pb-4 md:pb-6 border-b border-brand-yellow/20">
          <div className="p-2 md:p-3 bg-brand-yellow/10 rounded-full border border-brand-yellow/30 shrink-0">
            <UserPlus className="text-brand-yellow w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div>
            <h2 className="text-2xl md:text-4xl text-white font-oswald font-bold tracking-wide leading-tight">NUEVO <span className="text-brand-yellow">INGRESO</span></h2>
            <p className="text-sm md:text-base text-gray-400 font-roboto mt-1">Registra un nuevo piloto en el club</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            <div className="group">
              <label className={labelClasses}>Piloto (Nombre Completo)</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Ej: Frank Cañas"
              />
            </div>
            <div className="group">
              <label className={labelClasses}>Documento / Cédula</label>
              <input
                type="text"
                name="documentId"
                required
                value={formData.documentId}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Ej: 1000123456"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            <div className="group">
              <label className={labelClasses}>Edad</label>
              <input
                type="number"
                name="age"
                required
                min="16"
                value={formData.age}
                onChange={handleChange}
                className={inputClasses}
                placeholder="26"
              />
            </div>

            <div className="group">
              <label className={labelClasses}>Placa de la Moto</label>
              <div className="relative">
                <Hash className="absolute right-3 top-3 md:top-4 text-brand-yellow/50" size={20} />
                <input
                  type="text"
                  name="licensePlate"
                  required
                  value={formData.licensePlate}
                  onChange={handleChange}
                  className={`${inputClasses} uppercase font-oswald text-lg md:text-xl tracking-widest`}
                  placeholder="ABC12D"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            <div className="group">
              <label className={labelClasses}>Marca / Modelo</label>
              <div className="relative">
                <Shield className="absolute right-3 top-3 md:top-4 text-brand-yellow/50" size={20} />
                <select
                  name="motorcycleModel"
                  value={formData.motorcycleModel}
                  onChange={handleChange}
                  className={`${inputClasses} appearance-none pr-10`}
                >
                  <option value="Cr4">AKT CR4 (Oficial)</option>
                  <option value="Others">Otra marca/modelo</option>
                </select>
              </div>
            </div>

            <div className="group">
              <label className={labelClasses}>Cilindrada (CC)</label>
              <div className="relative">
                <Settings className="absolute right-3 top-3 md:top-4 text-brand-yellow/50" size={20} />
                <select
                  name="cylinderCapacity"
                  value={formData.cylinderCapacity}
                  onChange={handleChange}
                  className={`${inputClasses} appearance-none pr-10`}
                >
                  <option value="125">125 cc</option>
                  <option value="150">150 cc</option>
                  <option value="200">200 cc</option>
                  <option value="250">250 cc</option>
                </select>
              </div>
            </div>
          </div>

          {formData.motorcycleModel === 'Others' && (
            <div className="animate-fade-in group">
              <label className={`${labelClasses} text-brand-yellow`}>¿Qué moto es?</label>
              <input
                type="text"
                name="otherModel"
                required
                value={formData.otherModel}
                onChange={handleChange}
                className={`${inputClasses} border-brand-yellow/50 focus:border-brand-yellow bg-brand-yellow/5`}
                placeholder="Ej: Yamaha MT-03"
              />
            </div>
          )}

          <div className="pt-4 md:pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-yellow text-black font-oswald font-bold text-xl md:text-2xl tracking-widest py-3 md:py-4 rounded-none hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,215,0,0.6)] transition-all duration-300 flex items-center justify-center gap-2 group border border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'ACELERANDO...' : 'REGISTRAR MÁQUINA'}
            </button>
          </div>
        </form>

        {/* User CRUD Table */}
        <div className="mt-16 pt-8 border-t border-brand-yellow/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl text-white font-oswald font-bold tracking-wide">BASE DE DATOS <span className="text-brand-yellow">PILOTOS</span></h3>
          </div>
          
          <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-brand-yellow/10 border-b border-brand-yellow/30 text-brand-yellow font-oswald tracking-widest text-sm md:text-base">
                  <th className="p-3 font-normal">Piloto</th>
                  <th className="p-3 font-normal">Documento</th>
                  <th className="p-3 font-normal">Placa</th>
                  <th className="p-3 font-normal">Moto</th>
                  <th className="p-3 font-normal">Rol</th>
                  <th className="p-3 font-normal text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="font-roboto text-gray-300 text-sm md:text-base">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">No hay pilotos registrados</td>
                  </tr>
                ) : (
                  users.map((u: any) => (
                    <tr key={u.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                      <td className="p-3 font-bold text-white">{u.fullName} ({u.age})</td>
                      <td className="p-3">{u.documentId}</td>
                      <td className="p-3 font-oswald text-brand-yellow tracking-widest">{u.licensePlate}</td>
                      <td className="p-3">{u.motorcycleModel} {u.cylinderCapacity}cc</td>
                      <td className="p-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                          className="bg-black border border-brand-yellow/30 text-white p-1 text-xs uppercase"
                        >
                          <option value="Aspirantes">Aspirante</option>
                          <option value="Pilotos">Piloto</option>
                          <option value="Lideres">Lider</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-red-500 hover:text-red-400 font-oswald uppercase text-xs border border-red-500/50 px-2 py-1"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

