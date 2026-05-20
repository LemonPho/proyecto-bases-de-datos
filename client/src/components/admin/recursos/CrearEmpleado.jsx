import { useEffect, useState } from "react";
import {
  createEmpleado,
  getRefugios,
  getCargos,
  getContactos,
  createCargo,
  ESTATUS_EMPLEADO,
} from "./fetch";
import CrearContacto from "../shared/CrearContacto";

export default function CrearEmpleado({ isOpen, onClose, onCreated }) {
  const INITIAL_FORM = {
    contactoId: "",
    refugioId: "",
    cargoId: "",
    estatus: "activo",
    sueldo: "",
    nuevoCargoNombre: "",
    nuevoCargoDescripcion: "",
  };

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [contactos, setContactos] = useState([]);
  const [refugios, setRefugios] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreatingCargo, setIsCreatingCargo] = useState(false);
  const [isContactoModalOpen, setIsContactoModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadOptions();
      setFormData(INITIAL_FORM);
      setIsCreatingCargo(false);
      setErrorMessage("");
    }
  }, [isOpen]);

  async function loadOptions() {
    setLoadingOptions(true);
    try {
      const [contactosData, refugiosData, cargosData] = await Promise.all([
        getContactos(),
        getRefugios(),
        getCargos(),
      ]);
      setContactos(Array.isArray(contactosData) ? contactosData : []);
      setRefugios(Array.isArray(refugiosData) ? refugiosData : []);
      setCargos(Array.isArray(cargosData) ? cargosData : []);
    } catch (error) {
      console.error("Error cargando opciones:", error);
      setErrorMessage("Error al cargar las listas de selección.");
    } finally {
      setLoadingOptions(false);
    }
  }

  async function handleContactoCreated(nuevoContacto) {
    const data = await getContactos();
    setContactos(Array.isArray(data) ? data : []);
    if (nuevoContacto?.id) {
      setFormData((current) => ({ ...current, contactoId: nuevoContacto.id }));
    }
  }

  if (!isOpen) return null;

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setErrorMessage("");

    try {
      let cargoIdToUse = formData.cargoId;

      if (isCreatingCargo) {
        if (!formData.nuevoCargoNombre.trim()) {
          setErrorMessage("Debes escribir un nombre para el nuevo cargo.");
          setSaving(false);
          return;
        }

        const nuevoCargo = await createCargo(
          formData.nuevoCargoNombre,
          formData.nuevoCargoDescripcion
        );
        cargoIdToUse = nuevoCargo.id;
      }

      const response = await createEmpleado({
        contactoId: formData.contactoId,
        refugioId: formData.refugioId,
        cargoId: cargoIdToUse,
        estatus: formData.estatus,
        sueldo: formData.sueldo,
      });

      if (response.errorMessage) {
        setErrorMessage(response.errorMessage);
        return;
      }

      if (onCreated) onCreated(response.data);
      onClose();
    } catch (error) {
      console.error("Error inesperado creando empleado:", error);
      setErrorMessage(error.message || "Ocurrió un error inesperado.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-2xl overflow-y-auto max-h-[90vh] rounded-3xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800">
                Registrar empleado
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-400">
                Asigna un contacto existente como empleado de un refugio.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-full px-3 py-1 text-2xl font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5">
            {errorMessage && (
              <div className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {errorMessage}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-600">
                    Contacto del empleado
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsContactoModalOpen(true)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    + Crear contacto
                  </button>
                </div>
                <select
                  name="contactoId"
                  value={formData.contactoId}
                  onChange={handleChange}
                  required
                  disabled={loadingOptions}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-500"
                >
                  <option value="">Selecciona un contacto...</option>
                  {contactos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                      {c.email ? ` — ${c.email}` : ""}
                      {c.tipo_usuario ? ` (${c.tipo_usuario})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-slate-600">
                  Refugio
                </label>
                <select
                  name="refugioId"
                  value={formData.refugioId}
                  onChange={handleChange}
                  required
                  disabled={loadingOptions}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-500"
                >
                  <option value="">Selecciona un refugio...</option>
                  {refugios.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-600">Cargo</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingCargo(!isCreatingCargo);
                      setErrorMessage("");
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {isCreatingCargo
                      ? "Volver a seleccionar"
                      : "+ Crear nuevo cargo"}
                  </button>
                </div>

                {isCreatingCargo ? (
                  <div className="space-y-3">
                    <input
                      name="nuevoCargoNombre"
                      value={formData.nuevoCargoNombre}
                      onChange={handleChange}
                      required={isCreatingCargo}
                      placeholder="Nombre del cargo (ej. Veterinario)"
                      maxLength={50}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-500"
                    />
                    <input
                      name="nuevoCargoDescripcion"
                      value={formData.nuevoCargoDescripcion}
                      onChange={handleChange}
                      placeholder="Descripción (opcional)"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-500"
                    />
                  </div>
                ) : (
                  <select
                    name="cargoId"
                    value={formData.cargoId}
                    onChange={handleChange}
                    required={!isCreatingCargo}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-500"
                  >
                    <option value="">Selecciona un cargo...</option>
                    {cargos.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre_cargo}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-slate-600">
                  Estatus
                </label>
                <select
                  name="estatus"
                  value={formData.estatus}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-slate-500 capitalize"
                >
                  {ESTATUS_EMPLEADO.map((e) => (
                    <option key={e} value={e} className="capitalize">
                      {e}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-slate-600">
                  Sueldo (opcional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="sueldo"
                  value={formData.sueldo}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
                  placeholder="Ej. 8500.00"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
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
                className="rounded-full bg-slate-800 px-6 py-3 text-sm font-bold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Registrar empleado"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <CrearContacto
        isOpen={isContactoModalOpen}
        onClose={() => setIsContactoModalOpen(false)}
        onCreated={handleContactoCreated}
        defaultTipoUsuario="empleado"
      />
    </>
  );
}
