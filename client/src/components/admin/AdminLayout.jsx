import { Link, Outlet } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/admin">
            <img
            src={logo}
            className="h-10 w-auto"
          />
          </Link>

          <nav className="flex items-center gap-4 text-sm font-bold text-slate-500">
            <Link to="/admin" className="hover:text-slate-800">
              Inicio
            </Link>

            <Link to="/admin/refugio" className="hover:text-slate-800">
              Refugio
            </Link>

            <Link to="/admin/animales" className="hover:text-slate-800">
              Animales
            </Link>

            <Link to="/" className="hover:text-slate-800">
              Sitio público
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}