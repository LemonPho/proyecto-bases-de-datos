import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAnimales } from "./fetchAnimales";

export default function AnimalesAdmin() {
  const [animales, setAnimales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimalesData = async () => {
      try {
        const data = await getAnimales();
        setAnimales(data);
      } catch (error) {
        console.error("Error al cargar animales:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimalesData();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-slate-800">Gestión de Animales</h1>
        <Link
          to="/admin/animales/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-bold"
        >
          + Registrar Animal
        </Link>
      </div>

      {loading ? (
        <p className="text-slate-500">Cargando datos...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto border border-slate-200">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-800 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Raza</th>
                <th className="px-6 py-4">Área</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Ingreso</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {animales.map((animal) => (
                <tr key={animal.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{animal.nombre || 'Sin nombre'}</td>
                  <td className="px-6 py-4">{animal.razas?.nombre_raza}</td>
                  <td className="px-6 py-4">{animal.areas_refugio?.nombre_area}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 px-2 py-1 rounded-full text-xs uppercase tracking-wider">
                      {animal.estado.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(animal.fecha_ingreso).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/admin/animales/${animal.id}`}
                      className="text-blue-600 hover:text-blue-800 font-bold"
                    >
                      Ver detalles
                    </Link>
                  </td>
                </tr>
              ))}
              {animales.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    No hay animales registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}