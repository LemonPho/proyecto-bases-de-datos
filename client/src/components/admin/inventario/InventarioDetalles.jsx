import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  getItemInventarioById, 
  updateItemInventario, 
  getRefugios, 
  getTipoSuministro 
} from "./fetchInventario";

export default function InventarioDetalles() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [errorMessage, setErrorMessage] = useState("");
  const [editErrorMessage, setEditErrorMessage] = useState("");
  
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  
  const [refugios, setRefugios] = useState([]);
  const [tipos, setTipos] = useState([]);

  const [formData, setFormData] = useState({
    nombreProducto: "",
    cantidadStock: "",
    refugioId: "",
    tipoSuministroId: "",
  });

  useEffect(() => {
    fetchItem();
  }, [id]);

  useEffect(() => {
    if (isEditing && refugios.length === 0) {
      loadOptions();
    }
  }, [isEditing]);

  async function fetchItem() {
    setLoading(true);
    setErrorMessage("");
    const response = await getItemInventarioById(id);
    
    if (response.errorMessage) {
      setErrorMessage(response.errorMessage);
    } else {
      setItem(response.data);
      loadFormData(response.data);
    }
    setLoading(false);
  }

  async function loadOptions() {
    setLoadingOptions(true);
    try {
      const [refugiosResponse, tiposResponse] = await Promise.all([
        getRefugios(),
        getTipoSuministro()
      ]);
      setRefugios(refugiosResponse?.data || refugiosResponse || []);
      setTipos(tiposResponse?.data || tiposResponse || []);
    } catch (error) {
      console.error("Error cargando opciones:", error);
    } finally {
      setLoadingOptions(false);
    }
  }


  function loadFormData(data) {
    if (!data) return;
    setFormData({
      nombreProducto: data.nombre_producto || "",
      cantidadStock: data.cantidad_stock !== null && data.cantidad_stock !== undefined ? data.cantidad_stock : "",
      refugioId: data.refugio_id || "",
      tipoSuministroId: data.tipo_suministro_id || "",
    });
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }


  function handleEditClick() {
    loadFormData(item);
    setEditErrorMessage("");
    setIsEditing(true);
  }

  function handleCancelEdit() {
    loadFormData(item);
    setEditErrorMessage("");
    setIsEditing(false);
  }

  async function handleSaveEdit(event) {
    event.preventDefault();

    const nombre = formData.nombreProducto.trim();
    if (!nombre) {
      return setEditErrorMessage("El nombre del producto no puede estar vacío.");
    }
    if (nombre.length > 50) {
      return setEditErrorMessage("El nombre del producto no puede exceder los 50 caracteres.");
    }
    
    const stock = parseInt(formData.cantidadStock, 10);
    if (isNaN(stock) || stock < 0 || stock > 9999) {
      return setEditErrorMessage("La cantidad debe ser un número entero válido (mayor a 0 y menor a 9999).");
    }

    if (!formData.refugioId) {
      return setEditErrorMessage("Debes seleccionar un refugio válido.");
    }

    if (!formData.tipoSuministroId) {
      return setEditErrorMessage("Debes seleccionar una categoría válida.");
    }


    setSaving(true);
    setEditErrorMessage("");

    const response = await updateItemInventario(id, {
      nombreProducto: nombre,
      cantidadStock: stock,
      refugioId: formData.refugioId,
      tipoSuministroId: formData.tipoSuministroId
    });
    
    if (!response.errorMessage) {
      setItem(response.data);
      loadFormData(response.data);
      setIsEditing(false);
    } else {
      setEditErrorMessage(response.errorMessage);
    }
    setSaving(false);
  }

  if (loading) return <div className="p-10 text-center text-slate-400 font-semibold">Cargando detalles...</div>;
  if (errorMessage) return <div className="p-10 text-center font-semibold text-red-500">{errorMessage}</div>;
  if (!item) return <div className="p-10 text-center text-slate-400 font-semibold">Producto no encontrado.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <Link to="/admin/inventario" className="text-sm font-semibold text-slate-400 hover:text-slate-600">
              ← Volver al inventario
            </Link>
            <h1 className="mt-3 text-3xl font-extrabold text-slate-800">{item.nombre_producto}</h1>
          </div>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button 
                  type="button"
                  onClick={handleCancelEdit} 
                  disabled={saving}
                  className="rounded-full px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  form="editar-inventario-form"
                  disabled={saving}
                  className="rounded-full bg-slate-800 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-slate-700"
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </>
            ) : (
              <button 
                type="button"
                onClick={handleEditClick} 
                className="rounded-full bg-slate-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition active:scale-95 hover:bg-slate-700"
              >
                Editar producto
              </button>
            )}
          </div>
        </div>

        {/* Añadimos un form que envuelve a la sección editable */}
        <form id="editar-inventario-form" onSubmit={handleSaveEdit} className="grid gap-6">
          
          {editErrorMessage && (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {editErrorMessage}
            </div>
          )}

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-extrabold text-slate-800 mb-6">Información General</h2>
            
            <div className="grid gap-5 md:grid-cols-2">
              <InfoItem 
                label="Nombre del Producto" 
                value={item.nombre_producto} 
                isEditing={isEditing} 
                name="nombreProducto" 
                formValue={formData.nombreProducto} 
                onChange={handleInputChange}
                required
                maxLength={50}
              />
              
              <InfoItem 
                label="Stock Disponible" 
                value={item.cantidad_stock} 
                isEditing={isEditing} 
                name="cantidadStock" 
                formValue={formData.cantidadStock} 
                type="number"
                min="0"
                required
                onChange={handleInputChange} 
              />

              <div className="rounded-2xl bg-slate-50 p-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Refugio</label>
                {isEditing ? (
                  <select
                    name="refugioId"
                    value={formData.refugioId}
                    onChange={handleInputChange}
                    disabled={loadingOptions}
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500"
                  >
                    <option value="">Selecciona un refugio...</option>
                    {refugios.map((r) => (
                      <option key={r.id} value={r.id}>{r.nombre}</option>
                    ))}
                  </select>
                ) : (
                  <p className="mt-1 text-sm font-bold text-slate-700">{item.refugios?.nombre || "No asignado"}</p>
                )}
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Categoría</label>
                {isEditing ? (
                  <select
                    name="tipoSuministroId"
                    value={formData.tipoSuministroId}
                    onChange={handleInputChange}
                    disabled={loadingOptions}
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500"
                  >
                    <option value="">Selecciona una categoría...</option>
                    {tipos.map((t) => (
                      <option key={t.id} value={t.id}>{t.nombre_tipo}</option>
                    ))}
                  </select>
                ) : (
                  <p className="mt-1 text-sm font-bold text-slate-700">{item.tipos_suministro?.nombre_tipo || "Sin categoría"}</p>
                )}
              </div>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}

// Ahora el componente InfoItem soporta min, required y maxLength
function InfoItem({ label, value, isEditing, name, formValue, onChange, type = "text", maxLength, min, required }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <label className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</label>
      {isEditing ? (
        <input 
          type={type} 
          name={name} 
          value={formValue} 
          onChange={onChange}
          maxLength={maxLength}
          min={min}
          required={required}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500" 
        />
      ) : (
        <p className="mt-1 text-sm font-bold text-slate-700">{value}</p>
      )}
    </div>
  );
}