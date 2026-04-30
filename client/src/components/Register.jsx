import logo from '../assets/logo.png';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre,
            telefono,
          },
        },
      });

      if (error) throw error;

      setSuccess('Registro exitoso. Serás redirigido en breve...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error) {
      setError(error.message || 'Error al registrar el usuario');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="mb-8 flex flex-col items-center">
        <img src={logo} alt="Logo" className="w-40 h-auto" />
        <span className="text-3xl font-black text-slate-800 tracking-tighter mt-2">migo</span>
      </div>

      <div className="w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">Crea una cuenta</h2>

        {error && <div className="mb-6 p-4 text-sm font-semibold text-red-600 bg-red-50 rounded-2xl border border-red-100">{error}</div>}
        {success && <div className="mb-6 p-4 text-sm font-semibold text-green-600 bg-green-50 rounded-2xl border border-green-100">{success}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Campo Nombre Completo */}
          <div className="text-left">
            <label className="block text-xs font-bold text-slate-400 uppercase ml-4 mb-1">Nombre Completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full bg-slate-100 border-none rounded-full px-6 py-3 text-slate-700 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
              placeholder="Tu nombre aquí"
            />
          </div>

          {/* Campo Teléfono */}
          <div className="text-left">
            <label className="block text-xs font-bold text-slate-400 uppercase ml-4 mb-1">Teléfono</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full bg-slate-100 border-none rounded-full px-6 py-3 text-slate-700 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
              placeholder="1234567890"
            />
          </div>

          {/* Campo Correo electrónico */}
          <div className="text-left">
            <label className="block text-xs font-bold text-slate-400 uppercase ml-4 mb-1">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-100 border-none rounded-full px-6 py-3 text-slate-700 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
              placeholder="ejemplo@correo.com"
            />
          </div>

          {/* Campo Contraseña */}
          <div className="text-left">
            <label className="block text-xs font-bold text-slate-400 uppercase ml-4 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-slate-100 border-none rounded-full px-6 py-3 text-slate-700 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Botón Registrarse */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 text-white font-bold py-4 rounded-full mt-6 shadow-lg shadow-slate-200 hover:bg-slate-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        {/* Separador u opción de Google */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <p className="text-xs font-bold text-slate-400 uppercase">o regístrate con</p>
          <button className="w-12 h-12 flex items-center justify-center border-2 border-slate-100 rounded-full hover:bg-slate-50 transition-colors">
            <span className="text-xl font-black text-red-500">G</span>
          </button>
        </div>
      </div>

      {/* Enlace para iniciar sesión */}
      <div className="mt-8">
        <p className="text-sm text-slate-500 font-medium">
          ¿Ya tienes una cuenta? {' '}
          <Link to="/login" className="text-slate-800 font-bold underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
