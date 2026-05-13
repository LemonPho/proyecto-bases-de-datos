import { useState, useEffect } from "react";
import { 
  createItemSuministro,
  getRefugios,
  getTipoSuministro,
  createTipoSuministro,
 } from "./fetchInventario";
import { useAsyncError } from "react-router-dom";

export default function CrearitemInventario({ isOpen, onClose, onCreated }) {
  const INITIAL_FORM = {
    nombreProducto : "",
    cantidadStock: "",
    refugioId : "",
    tipoSuministroId: "",
    nuevoTipoNombre: "",
    nuevoTipoDescripcion: "",
  };

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [refugios, setRefugios] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false)
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreatingTipo, setIsCreatingTipo] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadOptions();
      setFormData(INITIAL_FORM);
      setIsCreatingTipo(false);
      setErrorMessage("");
    }
  }, [isOpen]);


  async function loadOptions() {
    setLoadingOptions(true);
    try {
      const [refugiosResponse, tiposResponse] = await Promise.all([
        getRefugios(),
        getTipoSuministro()
      ]);

      const arregloRefugios = refugiosResponse?.data || refugiosResponse || [];
      const arregloTipos = tiposResponse?.data || tiposResponse || [];

      setRefugios(arregloRefugios);
      setTipos(arregloTipos);

      setRefugios(Array.isArray(arregloRefugios) ? arregloRefugios : []);
      setTipos(Array.isArray(arregloTipos) ? arregloTipos : []);

    } catch (error) {
      console.error("Error cargando opciones:", error);
      setErrorMessage("Error al cargar las listas de selección");
    } finally {
      setLoadingOptions(false);
    }
  }

  if(!isOpen) return null;

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({...current, [name]: value}));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setErrorMessage("");

    try {
      let tipoIdToUse = formData.tipoSuministroId;

      if (isCreatingTipo) {
        if (!formData.nuevoTipoNombre.trim()) {
          setErrorMessage("Debes escribir un nombre para la nueva categoría.");
          setSaving(false);
          return;
        }

        const nuevoTipo = await createItemSuministro(
          formData.nuevoTipoNombre,
          formData.nuevoTipoDescripcion
        );

        tipoIdToUse = nuevoTipo.id;
      }

      const response = await createItemSuministro({
        ...formData,
        tipoSuministroId : tipoIdToUse
      });

      if (response.errorMessage) {
        setErrorMessage(response.errorMessage);
        return;
      }

      if (onCreated) onCreated(response.data);
      onClose();
    } catch (error) {
      console.error("Error en flujo de guardado:", error);
      setErrorMessage(error.message || "Ocurrio un error inesperado");
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex item-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">Añadir al inventario</h2>
            <p className="mt-1 text-sm font-medium text-slate-400">Registra un nuevo producto.</p>
          </div>
          <button onClick={onClose} disabled={saving} className="rounded-full px-3 py-1 text-2xl font-bold text-slate-400 hover:bg-slate-100">x</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5">
          {errorMessage && (
            <div className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {errorMessage}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Nombre del producto
              </label>
              <input 
                name="nombreProducto"
                value={formData.nombreProducto}
                onChange={handleChange}
                required
                maxLength={50}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="Ej. Alimento para cachorro 10kg"
              />
            </div>

             <div className="md:col-span2">
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Cantidad
              </label>
              <input 
                name="cantidadStock"
                value={formData.cantidadStock}
                onChange={handleChange}
                required
                maxLength={4}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="Ej. 50"
              />              
             </div>

             <div className="md:col-span-2">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-bold text-slate-600">Refugio</label>
                  <select 
                    name="refugioId"
                    value={formData.refugioId}
                    onChange={handleChange}
                    required
                    disabled={loadingOptions}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500 bg-white"
                  >
                    <option value="">Selecciona un refugio...</option>
                    {refugios.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nombre}
                      </option>
                    ))}
                  </select>
                  </div>
             </div>

             <div className="md:col-span-2 rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-600">Tipo de Suministro</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingTipo(!isCreatingTipo);
                      setErrorMessage("");
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {isCreatingTipo ? "Volver a seleccionar" : "+ Crear nueva categoría"}
                  </button>
              </div>

              {isCreatingTipo ? (
                <div className="space-y-3">
                  <input 
                    name="nuevoTipoNombre"
                    value={formData.nuevoTipoNombre}
                    onChange={handleChange}
                    required={isCreatingTipo}
                    placeholder="Nombre de la categoría (ej. Medicamento)"
                    maxLength={50}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500 bg-white"
                  />
                  <input 
                    name="nuevoTipoDescripcion"
                    value={formData.nuevoTipoDescripcion}
                    onChange={handleChange}
                    placeholder="Descripción (opcional)"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500 bg-white"
                  />
                </div>
              ) : (
                <select 
                  name="tipoSuministroId"
                  value={formData.tipoSuministroId}
                  onChange={handleChange}
                  required={!isCreatingTipo}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500 bg-white"
                >
                  <option value="">Selecciona la categoría...</option>
                  {tipos.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre_tipo}</option>
                  ))}
                </select>
              )}
             </div>
          </div>

          <div>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-full px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || loadingOptions}
              className="rounded-full px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}