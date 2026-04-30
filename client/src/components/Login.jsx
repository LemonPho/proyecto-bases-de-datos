import logo from '../assets/logo.png';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Login exitoso
      navigate('/');

    } catch (error) {
      setError(error.message || 'Error al iniciar sesión');
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
        <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">Inicia Sesión</h2>

        {error && <div className="mb-6 p-4 text-sm font-semibold text-red-600 bg-red-50 rounded-2xl border border-red-100">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
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
              className="w-full bg-slate-100 border-none rounded-full px-6 py-3 text-slate-700 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Botón Entrar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 text-white font-bold py-4 rounded-full mt-6 shadow-lg shadow-slate-200 hover:bg-slate-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando...' : 'Entrar'}
          </button>
        </form>

        {/* Separador u opción de Google */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <p className="text-xs font-bold text-slate-400 uppercase">o inicia con</p>
          <button className="w-12 h-12 flex items-center justify-center border-2 border-slate-100 rounded-full hover:bg-slate-50 transition-colors">
            <span className="text-xl font-black text-red-500">G</span>
          </button>
        </div>
      </div>

      {/* Enlace para registrarse */}
      <div className="mt-8">
        <p className="text-sm text-slate-500 font-medium">
          ¿No tienes cuenta? {' '}
          <Link to="/registro" className="text-slate-800 font-bold underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
