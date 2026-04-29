// src/components/Register.jsx
import { Link } from 'react-router-dom';
import logo from '/Users/alli/proyecto-bases-de-datos/client/src/assets'

export default function Register() {
  return (
    <>
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <img src={logo} alt="Logo" className="w-40 h-auto" />
      </div>

      <div className="mb-8">
        <span className="text-3xl font-black text-slate-800 tracking-tighter">migo</span>
      </div>

      <div className="w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-8">Crea una cuenta</h2> [cite: 14]

        <form className="space-y-4">
          {/* Campo Nombre Completo */}
          <div className="text-left">
            <label className="block text-xs font-bold text-slate-400 uppercase ml-4 mb-1">Nombre Completo</label> [cite: 15]
            <input
              type="text"
              className="w-full bg-slate-100 border-none rounded-full px-6 py-3 text-slate-700 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
              placeholder="Tu nombre aquí"
            />
          </div>

          {/* Campo Correo electrónico */}
          <div className="text-left">
            <label className="block text-xs font-bold text-slate-400 uppercase ml-4 mb-1">Correo electrónico</label> [cite: 16]
            <input
              type="email"
              className="w-full bg-slate-100 border-none rounded-full px-6 py-3 text-slate-700 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
              placeholder="ejemplo@correo.com"
            />
          </div>

          {/* Campo Contraseña */}
          <div className="text-left">
            <label className="block text-xs font-bold text-slate-400 uppercase ml-4 mb-1">Contraseña</label> [cite: 17]
            <input
              type="password"
              className="w-full bg-slate-100 border-none rounded-full px-6 py-3 text-slate-700 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Botón Registrarse */}
          <button
            type="submit"
            className="w-full bg-slate-800 text-white font-bold py-4 rounded-full mt-6 shadow-lg shadow-slate-200 hover:bg-slate-700 active:scale-95 transition-all"
          >
            Registrarse
          </button> [cite: 18]
        </form>

        {/* Separador u opción de Google */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <p className="text-xs font-bold text-slate-400 uppercase">o regístrate con</p>
          <button className="w-12 h-12 flex items-center justify-center border-2 border-slate-100 rounded-full hover:bg-slate-50 transition-colors">
            <span className="text-xl font-black text-red-500">G</span> [cite: 19]
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
    </>
  );
}