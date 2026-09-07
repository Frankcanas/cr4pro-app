import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CalendarDays, Save, Search, CheckCircle2, Circle, List, Plus } from 'lucide-react';

interface User {
  id: number;
  fullName: string;
  licensePlate: string;
  role: string;
}

interface Event {
  id: number;
  name: string;
  date: string;
}

export const AttendanceView = () => {
  const [view, setView] = useState<'create' | 'history'>('create');
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [users, setUsers] = useState<User[]>([]);
  const [attendance, setAttendance] = useState<Record<number, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [eventDetails, setEventDetails] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (view === 'create') {
      fetchUsers();
    } else {
      fetchEvents();
    }
  }, [view]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const usersRes = await axios.get('/api/users');
      setUsers(usersRes.data);
      const attMap: Record<number, boolean> = {};
      usersRes.data.forEach((u: User) => {
        attMap[u.id] = false;
      });
      setAttendance(attMap);
    } catch (error) {
      toast.error('Error al cargar pilotos');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/events');
      setEvents(res.data);
    } catch (error) {
      toast.error('Error al cargar historial');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEventDetails = async (eventId: number) => {
    setSelectedEventId(eventId);
    try {
      const res = await axios.get(`/api/events/${eventId}/attendance`);
      setEventDetails(res.data);
    } catch (error) {
      toast.error('Error al cargar detalles del evento');
    }
  };

  const handleToggle = (userId: number) => {
    setAttendance(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const handleSave = async () => {
    if (!eventName.trim()) {
      toast.error('Debes ponerle un nombre a la rodada/reunión');
      return;
    }

    setIsSaving(true);
    try {
      // Create Event first
      const eventRes = await axios.post('/api/events', { name: eventName, date });
      const eventId = eventRes.data.id;

      // Mark Attendance
      const payload = {
        eventId,
        attendances: Object.entries(attendance).map(([userId, attended]) => ({
          userId: parseInt(userId, 10),
          attended
        }))
      };

      await axios.post('/api/attendance', payload);
      toast.success('¡Kilómetros sumados! Asistencia guardada.', { icon: '🏍️' });
      setEventName('');
      fetchUsers(); // Reset
    } catch (error) {
      toast.error('Error al guardar asistencia en boxes');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputClasses = "w-full bg-black/50 border border-brand-yellow/30 p-3 md:p-3 text-white focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all duration-300 backdrop-blur-sm font-oswald text-base md:text-lg tracking-wide rounded-none";

  return (
    <div className="max-w-5xl mx-auto animate-fade-in mt-2 md:mt-4 pb-12">
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setView('create')}
          className={`flex-1 py-3 font-oswald text-lg tracking-wider border-b-2 transition-all ${view === 'create' ? 'border-brand-yellow text-brand-yellow bg-white/5' : 'border-transparent text-gray-500 hover:text-white'}`}
        >
          <div className="flex items-center justify-center gap-2"><Plus size={20} /> NUEVA RODADA</div>
        </button>
        <button 
          onClick={() => setView('history')}
          className={`flex-1 py-3 font-oswald text-lg tracking-wider border-b-2 transition-all ${view === 'history' ? 'border-brand-yellow text-brand-yellow bg-white/5' : 'border-transparent text-gray-500 hover:text-white'}`}
        >
          <div className="flex items-center justify-center gap-2"><List size={20} /> HISTORIAL</div>
        </button>
      </div>

      <div className="glass-panel p-4 md:p-8 relative overflow-hidden">
        {/* Decorative corner accents */}
        <div className="absolute top-0 right-0 w-20 md:w-32 h-20 md:h-32 bg-brand-yellow opacity-10 rounded-bl-full pointer-events-none"></div>
        
        {view === 'create' ? (
          <>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 mb-8 md:mb-10 pb-4 md:pb-6 border-b border-brand-yellow/20">
              <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                <div className="p-2 md:p-3 bg-brand-yellow/10 rounded-full border border-brand-yellow/30 shrink-0">
                  <CalendarDays className="text-brand-yellow w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-4xl text-white font-oswald font-bold tracking-wide leading-tight">NUEVA <span className="text-brand-yellow">ASISTENCIA</span></h2>
                  <p className="text-xs md:text-sm text-gray-400 font-roboto mt-1">Registra una nueva rodada o reunión</p>
                </div>
              </div>
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-brand-yellow text-black font-oswald font-bold tracking-widest text-base md:text-lg py-3 px-6 hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,215,0,0.6)] transition-all duration-300 disabled:opacity-50"
              >
                <Save size={20} /> {isSaving ? 'GUARDANDO...' : 'GUARDAR RODADA'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 mb-6 md:mb-8">
              <div className="md:col-span-6">
                <label className="block text-xs md:text-sm font-oswald tracking-widest mb-1 md:mb-2 text-brand-yellow uppercase">Nombre del Evento</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Ej: Reunion de primeros auxilios"
                  className={inputClasses}
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs md:text-sm font-oswald tracking-widest mb-1 md:mb-2 text-brand-yellow uppercase">Fecha</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs md:text-sm font-oswald tracking-widest mb-1 md:mb-2 text-brand-yellow uppercase">Buscar Piloto</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 md:top-3.5 text-gray-500" size={20} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ej: Frank"
                    className={`${inputClasses} pl-10 md:pl-12`}
                  />
                </div>
              </div>
            </div>

            <div className="bg-black/60 border border-brand-yellow/20 overflow-hidden relative">
              {isLoading && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-brand-yellow/10 border-b border-brand-yellow/30 text-brand-yellow font-oswald tracking-widest text-sm md:text-lg">
                      <th className="p-3 md:p-5 font-normal">Piloto</th>
                      <th className="p-3 md:p-5 font-normal">Placa</th>
                      <th className="p-3 md:p-5 font-normal hidden sm:table-cell">Rol</th>
                      <th className="p-3 md:p-5 font-normal text-center w-24 md:w-32">Asistencia</th>
                    </tr>
                  </thead>
                  <tbody className="font-roboto">
                    {filteredUsers.length === 0 && !isLoading ? (
                      <tr>
                        <td colSpan={4} className="p-8 md:p-12 text-center text-gray-500 font-oswald text-lg md:text-xl tracking-wider">
                          NO SE ENCONTRARON PILOTOS EN EL RADAR
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map(user => (
                        <tr key={user.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors group">
                          <td className="p-3 md:p-5">
                            <div className="font-bold text-gray-200 group-hover:text-white transition-colors text-sm md:text-lg">{user.fullName}</div>
                            <div className="sm:hidden text-gray-500 text-xs font-oswald mt-1 uppercase tracking-widest">{user.role}</div>
                          </td>
                          <td className="p-3 md:p-5">
                            <span className="inline-block px-2 md:px-3 py-1 bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow font-oswald tracking-widest rounded-none text-xs md:text-base">
                              {user.licensePlate}
                            </span>
                          </td>
                          <td className="p-3 md:p-5 hidden sm:table-cell">
                            <span className="text-gray-400 uppercase text-xs md:text-sm tracking-widest font-bold">
                              {user.role}
                            </span>
                          </td>
                          <td className="p-3 md:p-5 text-center">
                            <button
                              onClick={() => handleToggle(user.id)}
                              className="focus:outline-none transition-transform hover:scale-110 active:scale-95 inline-flex items-center justify-center p-2"
                            >
                              {attendance[user.id] ? (
                                <CheckCircle2 className="text-brand-yellow drop-shadow-[0_0_8px_rgba(255,215,0,0.8)] w-6 h-6 md:w-8 md:h-8" />
                              ) : (
                                <Circle className="text-gray-600 hover:text-gray-400 w-6 h-6 md:w-8 md:h-8" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* History View */
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl text-white font-oswald font-bold tracking-wide mb-6">HISTORIAL DE <span className="text-brand-yellow">EVENTOS</span></h2>
            
            {events.length === 0 && !isLoading && (
               <p className="text-gray-500 font-oswald text-xl tracking-wider text-center py-12">NO HAY HISTORIAL DISPONIBLE</p>
            )}

            {events.map(ev => (
              <div key={ev.id} className="bg-black/40 border border-brand-yellow/20 hover:border-brand-yellow/50 transition-colors p-4">
                <div 
                  className="flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer"
                  onClick={() => fetchEventDetails(ev.id)}
                >
                  <div>
                    <h3 className="text-xl font-oswald text-brand-yellow uppercase tracking-wider">{ev.name}</h3>
                    <p className="text-gray-400 font-roboto text-sm">{ev.date}</p>
                  </div>
                  <button className="text-sm font-oswald tracking-widest border border-brand-yellow text-brand-yellow px-4 py-1 mt-2 md:mt-0 hover:bg-brand-yellow hover:text-black transition-colors">
                    VER PILOTOS
                  </button>
                </div>
                
                {selectedEventId === ev.id && (
                  <div className="mt-4 pt-4 border-t border-brand-yellow/10 animate-fade-in">
                    <p className="text-gray-300 font-roboto mb-4">
                      <strong>Asistieron {eventDetails.length} motos</strong> en total.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {eventDetails.map((detail, idx) => (
                        <div key={idx} className="flex justify-between bg-white/5 p-2 px-3 border-l-2 border-brand-yellow">
                          <span className="text-gray-200">
                            {detail.User.role.slice(0, -1)} <strong className="text-white">{detail.User.fullName}</strong>
                          </span>
                          <span className="text-brand-yellow font-oswald tracking-widest">{detail.User.licensePlate}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
