import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getAnimalById, deleteAnimal, agregarFoto, eliminarFoto } from "./fetchAnimales";

export default function AnimalDetalles() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para la galería
  const [nuevaFotoUrl, setNuevaFotoUrl] = useState("");
  const [uploadingFoto, setUploadingFoto] = useState(false);

  useEffect(() => {
    const fetchDetalles = async () => {
      try {
        const data = await getAnimalById(id);
        setAnimal(data);
      } catch (error) {
        console.error("Error al cargar detalles:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetalles();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.")) {
      try {
        await deleteAnimal(id);
        navigate("/admin/animales");
      } catch (error) {
        console.error("Error al eliminar:", error.message);
        alert("Hubo un error al intentar eliminar el registro.");
      }
    }
  };

  // --- Funciones de la Galería ---
  const handleAddFoto = async (e) => {
    e.preventDefault();
    if (!nuevaFotoUrl) return;
    
    setUploadingFoto(true);
    try {
      const nuevaFoto = await agregarFoto(id, nuevaFotoUrl);
      // Actualizamos el estado local agregando la nueva foto al arreglo para verla de inmediato
      setAnimal((prev) => ({
        ...prev,
        galeria_fotos: [...(prev.galeria_fotos || []), nuevaFoto]
      }));
      setNuevaFotoUrl(""); // Limpiamos el input
    } catch (error) {
      console.error("Error al agregar foto:", error.message);
      alert("No se pudo agregar la foto. Verifica que el enlace sea correcto.");
    } finally {
      setUploadingFoto(false);
    }
  };

  const handleRemoveFoto = async (fotoId) => {
    if (!window.confirm("¿Deseas eliminar esta foto de la galería?")) return;
    
    try {
      await eliminarFoto(fotoId);
      // Filtramos la foto eliminada del estado local
      setAnimal((prev) => ({
        ...prev,
        galeria_fotos: prev.galeria_fotos.filter((f) => f.id !== fotoId)
      }));
    } catch (error) {
      console.error("Error al eliminar foto:", error.message);
      alert("No se pudo eliminar la foto.");
    }
  };

  if (loading) return <div className="p-6">Cargando detalles...</div>;
  if (!animal) return <div className="p-6">No se encontró el registro del animal.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Link to="/admin/animales" className="text-blue-600 hover:underline font-bold text-sm">
          &larr; Volver al listado
        </Link>
        <div className="flex gap-4">
          <Link to={`/admin/animales/editar/${id}`} className="text-blue-600 font-bold text-sm hover:underline">
            Editar Registro
          </Link>
          <button onClick={handleDelete} className="text-red-600 font-bold text-sm hover:underline">
            Eliminar Registro
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-slate-200">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h1 className="text-3xl font-black text-slate-800">
            {animal.nombre || 'Sin nombre registrado'}
          </h1>
          <p className="text-slate-500 font-medium mt-1">ID: {animal.id}</p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Especie y Raza</h3>
            <p className="text-slate-800 font-medium text-lg">
              {animal.razas?.especies?.nombre_especie} - {animal.razas?.nombre_raza}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Estado Actual</h3>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
              {animal.estado.replace('_', ' ')}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Ubicación en Refugio</h3>
            <p className="text-slate-800 font-medium text-lg">{animal.areas_refugio?.nombre_area}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Fecha de Ingreso</h3>
            <p className="text-slate-800 font-medium text-lg">
              {new Date(animal.fecha_ingreso).toLocaleDateString('es-MX', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* =========================================
            SECCIÓN DE GALERÍA DE FOTOS
        ========================================= */}
        <div className="p-6 border-t border-slate-200 bg-white">
          <h2 className="text-xl font-black text-slate-800 mb-4">Galería de Fotos</h2>

          {/* Formulario para agregar nueva foto */}
          <form onSubmit={handleAddFoto} className="mb-6 flex gap-2">
            <input
              type="url"
              placeholder="Ej. https://images.unsplash.com/photo-perrito..."
              value={nuevaFotoUrl}
              onChange={(e) => setNuevaFotoUrl(e.target.value)}
              className="flex-1 border border-slate-300 rounded-md p-2 text-sm focus:outline-none focus:border-blue-500"
              required
            />
            <button
              type="submit"
              disabled={uploadingFoto}
              className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-900 font-bold text-sm disabled:opacity-50"
            >
              {uploadingFoto ? "Guardando..." : "Añadir Foto"}
            </button>
          </form>

          {/* Grid de imágenes */}
          {animal.galeria_fotos && animal.galeria_fotos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {animal.galeria_fotos.map((foto) => (
                <div key={foto.id} className="relative group rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-slate-100 aspect-square">
                  <img
                    src={foto.url_foto}
                    alt={`Foto de ${animal.nombre}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Error+de+Imagen"; }}
                  />
                  {/* Botón eliminar que aparece al pasar el mouse (hover) */}
                  <button
                    onClick={() => handleRemoveFoto(foto.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-md"
                    title="Eliminar foto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <p className="text-slate-500 text-sm">No hay fotos registradas para este animal.</p>
            </div>
          )}
        </div>
        {/* ========================================= */}

      </div>
    </div>
  );
}