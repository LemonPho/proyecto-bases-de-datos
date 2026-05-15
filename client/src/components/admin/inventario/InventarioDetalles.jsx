import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getItemInventarioById,
  updateItemInventario,
  getRefugios,
  getTipoSuministro,
  createTipoSuministro,
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

  const [isCreatingTipo, setIsCreatingTipo] = useState(false);

  const [formData, setFormData] = useState({
    nombreProducto: "",
    cantidadStock: "",
    refugioId: "",
    tipoSuministroId: "",
    nuevoTipoNombre: "",
    nuevoTipoDescripcion: "",
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
      nuevoTipoNombre: "",
      nuevoTipoDescripcion: "",
    });
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }


  function handleEditClick() {
    loadFormData(item);
    setIsCreatingTipo(false);
    setEditErrorMessage("");
    setIsEditing(true);
  }

  function handleCancelEdit() {
    loadFormData(item);
    setIsCreatingTipo(false);
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

    if (!isCreatingTipo && !formData.tipoSuministroId) {
      return setEditErrorMessage("Debes seleccionar una categoría válida.");
    }

    if (isCreatingTipo && !formData.nuevoTipoNombre.trim()) {
      return setEditErrorMessage("Debes escribir un nombre para la nueva categoría.");
    }

    setSaving(true);
    setEditErrorMessage("");

    try {
      let tipoIdToUse = formData.tipoSuministroId;

      if (isCreatingTipo) {
        const nuevoTipo = await createTipoSuministro(
          formData.nuevoTipoNombre,
          formData.nuevoTipoDescripcion
        );
        tipoIdToUse = nuevoTipo.id;
        setTipos((prev) => [...prev, nuevoTipo]);
      }

      const response = await updateItemInventario(id, {
        nombreProducto: nombre,
        cantidadStock: stock,
        refugioId: formData.refugioId,
        tipoSuministroId: tipoIdToUse,
      });

      if (!response.errorMessage) {
        setItem(response.data);
        loadFormData(response.data);
        setIsCreatingTipo(false);
        setIsEditing(false);
      } else {
        setEditErrorMessage(response.errorMessage);
      }
    } catch (error) {
      console.error("Error guardando cambios:", error);
      setEditErrorMessage(error.message || "Ocurrió un error inesperado.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 text-center text-sm font-semibold text-slate-400 shadow-sm ring-1 ring-slate-200">
          Cargando detalles del producto...
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-semibold text-red-500">{errorMessage}</p>
          <div className="mt-5 flex justify-center gap-3">
            <button
              type="button"
              onClick={fetchItem}
              className="rounded-full bg-slate-800 px-5 py-2 text-sm font-bold text-white hover:bg-slate-700"
            >
              Reintentar
            </button>
            <Link
              to="/admin/inventario"
              className="rounded-full px-5 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100"
            >
              Volver
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 text-center text-sm font-semibold text-slate-400 shadow-sm ring-1 ring-slate-200">
          Producto no encontrado.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              to="/admin/inventario"
              className="text-sm font-semibold text-slate-400 hover:text-slate-600"
            >
              ← Volver al inventario
            </Link>

            <h1 className="mt-3 text-3xl font-extrabold text-slate-800">
              {item.nombre_producto}
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-400">
              Detalles del producto en inventario.
            </p>
          </div>

          {isEditing ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={saving}
                className="rounded-full px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                form="editar-inventario-form"
                disabled={saving}
                className="rounded-full bg-slate-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleEditClick}
              className="rounded-full bg-slate-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-700 active:scale-95"
            >
              Editar producto
            </button>
          )}
        </div>

        <form id="editar-inventario-form" onSubmit={handleSaveEdit}>
          {editErrorMessage && (
            <div className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {editErrorMessage}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
              <h2 className="text-lg font-extrabold text-slate-800">
                Información general
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <InfoItem
                  label="Nombre del producto"
                  value={item.nombre_producto}
                  isEditing={isEditing}
                  name="nombreProducto"
                  formValue={formData.nombreProducto}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                />

                <InfoItem
                  label="Stock disponible"
                  value={item.cantidad_stock}
                  isEditing={isEditing}
                  name="cantidadStock"
                  formValue={formData.cantidadStock}
                  type="number"
                  min="0"
                  required
                  onChange={handleInputChange}
                />

                <InfoItem label="ID" value={item.id} />
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-extrabold text-slate-800">
                Resumen
              </h2>

              <div className="mt-6 space-y-4">
                <div
                  className={`rounded-2xl p-4 ${
                    item.cantidad_stock > 0 ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <p
                    className={`text-xs font-black uppercase tracking-widest ${
                      item.cantidad_stock > 0 ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    Estado
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {item.cantidad_stock > 0 ? "En stock" : "Sin stock"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Categoría
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {item.tipos_suministro?.nombre_tipo || "Sin categoría"}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-3">
              <h2 className="text-lg font-extrabold text-slate-800">
                Refugio asignado
              </h2>

              <div className="mt-6">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Refugio
                  </label>
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
                        <option key={r.id} value={r.id}>
                          {r.nombre}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {item.refugios?.nombre || "No asignado"}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-slate-800">
                  Categoría
                </h2>

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingTipo(!isCreatingTipo);
                      setEditErrorMessage("");
                    }}
                    className="text-xs font-bold text-blue-600 transition-colors hover:text-blue-800"
                  >
                    {isCreatingTipo
                      ? "Volver a seleccionar"
                      : "+ Crear nueva categoría"}
                  </button>
                )}
              </div>

              <div className="mt-6">
                {isEditing ? (
                  isCreatingTipo ? (
                    <div className="space-y-3 rounded-2xl bg-slate-50 p-4">
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                          Nombre de la nueva categoría
                        </label>
                        <input
                          name="nuevoTipoNombre"
                          value={formData.nuevoTipoNombre}
                          onChange={handleInputChange}
                          required
                          maxLength={50}
                          placeholder="Ej. Medicamento"
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                          Descripción (opcional)
                        </label>
                        <input
                          name="nuevoTipoDescripcion"
                          value={formData.nuevoTipoDescripcion}
                          onChange={handleInputChange}
                          placeholder="Descripción breve de la categoría"
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                        Categoría
                      </label>
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
                          <option key={t.id} value={t.id}>
                            {t.nombre_tipo}
                          </option>
                        ))}
                      </select>
                    </div>
                  )
                ) : (
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Categoría
                    </label>
                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {item.tipos_suministro?.nombre_tipo || "Sin categoría"}
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
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