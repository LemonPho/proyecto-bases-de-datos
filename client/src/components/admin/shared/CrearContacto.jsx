import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

const SELECT_CONTACTO = `
  id,
  nombre,
  telefono,
  email,
  tipo_usuario,
  direccion_id
`;

/**
 * Modal liviano que crea un contacto (y opcionalmente su dirección).
 * No interactúa con tablas de rol — para eso usar CrearUsuario.
 *
 * Props:
 *   isOpen, onClose, onCreated(contacto)
 *   defaultTipoUsuario: tipo asignado al nuevo contacto (default: 'otro')
 *   lockTipoUsuario: si true, el campo de tipo queda deshabilitado
 */
export default function CrearContacto({
  isOpen,
  onClose,
  onCreated,
  defaultTipoUsuario = "otro",
  lockTipoUsuario = false,
}) {
  const INITIAL_FORM = {
    nombre: "",
    telefono: "",
    email: "",
    tipoUsuario: defaultTipoUsuario,
    calle: "",
    noExt: "",
    noInt: "",
    colonia: "",
    ciudad: "",
    estado: "",
    pais: "México",
  };

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...INITIAL_FORM, tipoUsuario: defaultTipoUsuario });
      setErrorMessage("");
    }
  }, [isOpen, defaultTipoUsuario]);

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
      // 1. Crear dirección si se proporcionó calle
      let direccionId = null;

      if (formData.calle) {
        const { data: direccionData, error: direccionError } = await supabase
          .from("direcciones")
          .insert({
            calle: formData.calle,
            no_ext: formData.noExt,
            no_int: formData.noInt || null,
            colonia: formData.colonia,
            ciudad: formData.ciudad,
            estado: formData.estado,
            pais: formData.pais,
          })
          .select("id")
          .single();

        if (direccionError) {
          console.error("Error creando dirección:", direccionError);
          setErrorMessage("No se pudo crear la dirección.");
          return;
        }
        direccionId = direccionData.id;
      }

      // 2. Crear contacto
      const { data: contactoData, error: contactoError } = await supabase
        .from("contactos")
        .insert({
          nombre: formData.nombre,
          telefono: formData.telefono || null,
          email: formData.email || null,
          tipo_usuario: formData.tipoUsuario,
          direccion_id: direccionId,
        })
        .select(SELECT_CONTACTO)
        .single();

      if (contactoError) {
        console.error("Error creando contacto:", contactoError);
        setErrorMessage("No se pudo crear el contacto.");
        return;
      }

      if (onCreated) onCreated(contactoData);
      onClose();
    } catch (error) {
      console.error("Error inesperado creando contacto:", error);
      setErrorMessage("Ocurrió un error inesperado creando el contacto.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl overflow-y-auto max-h-[90vh] rounded-3xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">
              Crear contacto
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-400">
              Captura los datos básicos del contacto.
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

          <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">
            Datos personales
          </h3>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Nombre completo
              </label>
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                maxLength={50}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="Ej. Laura Pérez"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Teléfono
              </label>
              <input
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                maxLength={10}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="3312345678"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                maxLength={100}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="contacto@ejemplo.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Tipo de usuario
              </label>
              <input
                name="tipoUsuario"
                value={formData.tipoUsuario}
                onChange={handleChange}
                disabled={lockTipoUsuario}
                maxLength={20}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500 capitalize disabled:bg-slate-50 disabled:text-slate-500"
              />
            </div>
          </div>

          <h3 className="mb-3 mt-7 text-xs font-black uppercase tracking-widest text-slate-400">
            Dirección (opcional)
          </h3>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Calle
              </label>
              <input
                name="calle"
                value={formData.calle}
                onChange={handleChange}
                maxLength={50}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                No. exterior
              </label>
              <input
                name="noExt"
                value={formData.noExt}
                onChange={handleChange}
                maxLength={10}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                No. interior
              </label>
              <input
                name="noInt"
                value={formData.noInt}
                onChange={handleChange}
                maxLength={10}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Colonia
              </label>
              <input
                name="colonia"
                value={formData.colonia}
                onChange={handleChange}
                maxLength={50}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Ciudad
              </label>
              <input
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                maxLength={50}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                Estado
              </label>
              <input
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                maxLength={30}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-slate-600">
                País
              </label>
              <input
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                maxLength={30}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500"
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
              disabled={saving}
              className="rounded-full bg-slate-800 px-6 py-3 text-sm font-bold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Crear contacto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
