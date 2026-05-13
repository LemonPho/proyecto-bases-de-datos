import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { get_Inventario } from "./fetchInventario";
import CrearItemInventario from "./CrearItemInventario";

export default function InventarioAdmin() {
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);


  useEffect(() => {
    fetchInventario();
  }, []);

  async function fetchInventario() {
    setErrorMessage("");
    setLoading(true);
    const response = await get_Inventario();
    setLoading(false);
    setErrorMessage(response.errorMessage)
    setInventario(response.data)
  }


return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <Link to="/admin" className="text-sm font-semibold text-slate-400 hover:text-slate-600">
                        ← Volver al dashboard
                    </Link>
                    <h1 className="mt-3 text-3xl font-extrabold text-slate-800">
                        Inventario de Suministros
                    </h1>
                    <p className="mt-1 text-sm font-medium text-slate-400">
                        Gestiona los productos y suministros de los refugios
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="rounded-full bg-slate-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-700 active:scale-95"
                >
                    + Nuevo producto
                </button>
            </div>

            <div>
                {loading ? (
                    <div className="p-8 text-center text-sm font-semibold text-slate-400"> Cargando inventario...</div>
                ) : errorMessage ? (
                    <div className="p-8 text-center">
                        <p className="text-sm font-semibold text-red-500">{errorMessage}</p>
                        <button onClick={fetchInventario} className="mt-4 rounded-full bg-slate-800 px-5 py-2 text-sm font-bold text-white hover:bg-slate-700">
                            Reintentar
                        </button>
                    </div>
                ) : inventario.length === 0 ? (
                    <div className="p-8 text-center text-sm font-semibold text-slate-400">No hay productos registrados.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead className="bg-slate-100 text-xs uppercase tracking-widest text-slate-500">
                                <tr>
                                    <th className="px-6 py-4 font-black">Productos</th>
                                    <th className="px-6 py-4 font-black">Stock</th>
                                    <th className="px-6 py-4 font-black">Tipo</th>
                                    <th className="px-6 py-4 font-black">Refugio</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {inventario.map((item) => (
                                    <tr key={item.id} className="transition hover:bg-blue-50">
                                        <td className="px-6 py-4">
                                            <Link to={`/admin/inventario/${item.id}`} className="font-extrabold text-slate-800 hover:text-blue-700">
                                                {item.nombre_producto}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-slate-600">{item.cantidad_stock}</td>
                                        <td className="px-6 py-4 font-semibold text-slate-600">{item.tipos_suministro?.nombre_tipo || "N/A"}</td>
                                        <td className="px-6 py-4 font-semibold text-slate-600">{item.refugios?.nombre || "N/A"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
        <CrearItemInventario 
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onCreated={() => fetchInventario()}
        />
    </div>
);
}