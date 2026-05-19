import { Link } from "react-router-dom";
// 1. Importamos los íconos de Lucide
import { 
  Home, 
  CircleDollarSign, 
  PawPrint, 
  HeartHandshake, 
  Users, 
  PackageOpen, 
  Ambulance, 
  UserCog 
} from "lucide-react";

export default function AdminHome() {
  const AREAS = [
    { id: "refugio", label: "refugio", color: "bg-green-100" },
    { id: "finanzas", label: "finanzas", color: "bg-blue-100" },
    { id: "animales", label: "animales", color: "bg-orange-100" },
    { id: "adopciones", label: "adopciones", color: "bg-purple-100" },
    { id: "recursos", label: "recursos humanos", color: "bg-pink-100" },
    { id: "inventario", label: "inventario", color: "bg-yellow-100" },
    { id: "rescates", label: "rescates", color: "bg-red-100" },
    { id: "usuario", label: "usuarios", color: "bg-teal-100" },
  ];

  return (
    <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center bg-white p-10">
      <h2 className="text-3xl font-extrabold text-slate-800">
        ¡Bienvenido!
      </h2>

      <p className="mb-10 mt-2 font-medium italic text-slate-400">
        Selecciona el área o departamento:
      </p>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {AREAS.map((area) => {
          const IconComponent = area.Icon;

          return (
            <Link
              key={area.id}
              className={`${area.color} flex h-36 w-36 flex-col items-center justify-center gap-3 rounded-[2.5rem] shadow-sm transition-all hover:shadow-md active:scale-95`}
              to={`/admin/${area.id}`}
            >
              {/* 3. Renderizamos el ícono dinámicamente con estilos de Tailwind */}
              <IconComponent 
                className="h-10 w-10 text-slate-700 opacity-90" 
                strokeWidth={1.5} 
              />

              <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                {area.label}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 flex gap-8">
        <button className="font-bold text-slate-400 hover:text-slate-600">
          Cancelar
        </button>

        <button className="rounded-full bg-slate-800 px-12 py-2 font-bold text-white">
          Siguiente
        </button>
      </div>
    </div>
  );
}