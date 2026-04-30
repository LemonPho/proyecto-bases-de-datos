import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar con las secciones del PDF */}
      <nav className="flex justify-between items-center p-6 bg-white shadow-sm">
        <div className="text-2xl font-bold text-slate-800">migo</div>
        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
          <a href="#">Animales</a> {/* [cite: 3] */}
          <a href="#">Sobre nosotras</a> {/* [cite: 4] */}
          <a href="#">Eventos</a> {/* [cite: 5] */}
          <a href="#">Contacto</a> {/* [cite: 6] */}
          
          {/* Sección de autenticación */}
          <div className="flex items-center gap-4 border-l pl-8 border-slate-200">
            {user ? (
              <>
                <Link to="/admin" className="font-bold text-slate-800 hover:text-slate-900 transition-colors">
                  {user.user_metadata?.nombre?.split(' ')[0] || 'Cuenta'}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                  title="Cerrar sesión"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                </button>
              </>
            ) : (
              <Link to="/login" className="font-bold text-slate-800 hover:text-slate-900 transition-colors">
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto flex flex-col md:flex-row items-center pt-20 px-6">
        <div className="md:w-1/2 space-y-6 text-left">
          <h1 className="text-6xl font-black text-slate-800">Encuentra un amigo</h1> {/* [cite: 7] */}
          <p className="text-lg text-slate-500 leading-relaxed max-w-md">
            Migo es un lugar donde animalitos callejeros, perdidos, abandonados, o rescatados son adoptados. [cite: 8]
          </p>
          <div className="flex gap-4 pt-4">
            <button className="bg-slate-800 text-white px-10 py-3 rounded-full font-bold">Saber más</button> {/* [cite: 9] */}
            <Link to="/registro" className="border-2 border-slate-800 text-slate-800 px-10 py-3 rounded-full font-bold">
              Registrate
            </Link> {/* [cite: 10] */}
          </div>
        </div>
        
        {/* Placeholder para la imagen del perro del PDF */}
        <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
          <div className="w-96 h-96 bg-green-100 rounded-[3rem] rotate-3 overflow-hidden shadow-xl flex items-center justify-center">
             <span className="text-slate-400 font-bold -rotate-3 text-center p-4">Imagen del perrito Migo [cite: 1]</span>
          </div>
        </div>
      </main>
    </div>
  );
}