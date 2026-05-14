import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createAnimal, getSelectOptions } from "./fetchAnimales";

export default function CrearAnimal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [areas, setAreas] = useState([]);
  const [razas, setRazas] = useState([]);

  const [formData, setFormData] = useState({
    nombre: "",
    area_id: "",
    raza_id: "",
    estado: "resguardado", // Valor por defecto del ENUM
    fecha_ingreso: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const { areas, razas } = await getSelectOptions();
        setAreas(areas);
        setRazas(razas);
      } catch (error) {
        console.error("Error al cargar opciones:", error.message);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createAnimal(formData);
      navigate("/admin/animales");
    } catch (error) {
      console.error("Error al registrar:", error.message);
      alert("Error al registrar el animal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-black text-slate-800 mb-6">Registrar Nuevo Animal</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow border border-slate-200">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nombre del Animal</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md p-2"
              placeholder="Ej. Firulais (Opcional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Área del Refugio *</label>
              <select required name="area_id" value={formData.area_id} onChange={handleChange} className="w-full border border-slate-300 rounded-md p-2">
                <option value="">Seleccione un área...</option>
                {areas.map(a => <option key={a.id} value={a.id}>{a.nombre_area}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Raza *</label>
              <select required name="raza_id" value={formData.raza_id} onChange={handleChange} className="w-full border border-slate-300 rounded-md p-2">
                <option value="">Seleccione una raza...</option>
                {razas.map(r => <option key={r.id} value={r.id}>{r.nombre_raza}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Estado *</label>
              <select required name="estado" value={formData.estado} onChange={handleChange} className="w-full border border-slate-300 rounded-md p-2">
                <option value="sano">Sano</option>
                <option value="enfermo">Enfermo</option>
                <option value="en_tratamiento">En Tratamiento</option>
                <option value="recuperacion">Recuperación</option>
                <option value="adoptado">Adoptado</option>
                <option value="resguardado">Resguardado</option>
                <option value="fallecido">Fallecido</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Fecha de Ingreso *</label>
              <input type="date" required name="fecha_ingreso" value={formData.fecha_ingreso} onChange={handleChange} className="w-full border border-slate-300 rounded-md p-2" />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button type="button" onClick={() => navigate("/admin/animales")} className="px-4 py-2 text-slate-600 hover:text-slate-800 font-bold">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-bold disabled:opacity-50">
            {loading ? "Guardando..." : "Guardar Registro"}
          </button>
        </div>
      </form>
    </div>
  );
}