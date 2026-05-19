import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAnimalById, updateAnimal, getSelectOptions } from "./fetchAnimales";

export default function EditarAnimal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [areas, setAreas] = useState([]);
  const [razas, setRazas] = useState([]);

  const [formData, setFormData] = useState({
    nombre: "",
    area_id: "",
    raza_id: "",
    estado: "",
    fecha_ingreso: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { areas, razas } = await getSelectOptions();
        setAreas(areas);
        setRazas(razas);

        const animalData = await getAnimalById(id);
        setFormData({
          nombre: animalData.nombre || "",
          area_id: animalData.area_id,
          raza_id: animalData.raza_id,
          estado: animalData.estado,
          fecha_ingreso: animalData.fecha_ingreso.split("T")[0],
        });
      } catch (error) {
        console.error("Error al cargar datos:", error.message);
        alert("Error al cargar la información del animal");
        navigate("/admin/animales");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateAnimal(id, formData);
      navigate(`/admin/animales/${id}`);
    } catch (error) {
      console.error("Error al actualizar:", error.message);
      alert("Error al actualizar el animal");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="p-6">Cargando formulario...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-black text-slate-800 mb-6">Editar Registro</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow border border-slate-200">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nombre del Animal</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="w-full border border-slate-300 rounded-md p-2" />
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
          <button type="button" onClick={() => navigate(`/admin/animales/${id}`)} className="px-4 py-2 text-slate-600 hover:text-slate-800 font-bold">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-bold disabled:opacity-50">
            {loading ? "Actualizando..." : "Actualizar Registro"}
          </button>
        </div>
      </form>
    </div>
  );
}