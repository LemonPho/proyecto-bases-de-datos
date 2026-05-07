import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getRefugioById, updateRefugio } from "./fetch";

export default function RefugioDetalles() {
  const { id } = useParams();

  const [refugio, setRefugio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editErrorMessage, setEditErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    nombreRefugio: "",
    contactoId: "",
    direccionId: "",
    nombreContacto: "",
    telefono: "",
    email: "",
    tipoUsuario: "",
    calle: "",
    noExt: "",
    noInt: "",
    colonia: "",
    ciudad: "",
    estado: "",
    pais: "",
  });

  useEffect(() => {
    fetchRefugio();
  }, [id]);

  async function fetchRefugio() {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await getRefugioById(id);

      if (response.errorMessage) {
        setErrorMessage(response.errorMessage);
        setRefugio(null);
      } else {
        setRefugio(response.data);
        loadFormData(response.data);
      }
    } catch (error) {
      console.error("Error inesperado cargando refugio:", error);
      setErrorMessage("Ocurrió un error inesperado cargando el refugio.");
      setRefugio(null);
    } finally {
      setLoading(false);
    }
  }

  function formatDireccion(direccion) {
    if (!direccion) return "Sin dirección registrada";

    const calle = `${direccion.calle} ${direccion.no_ext}${direccion.no_int ? ` Int. ${direccion.no_int}` : ""
      }`;

    return `${calle}, ${direccion.colonia}, ${direccion.ciudad}, ${direccion.estado}, ${direccion.pais}`;
  }

  function loadFormData(refugioData) {
    const contacto = refugioData.contacto;
    const direccion = contacto?.direccion;

    setFormData({
      nombreRefugio: refugioData.nombre || "",
      contactoId: contacto?.id || "",
      direccionId: direccion?.id || "",
      nombreContacto: contacto?.nombre || "",
      telefono: contacto?.telefono || "",
      email: contacto?.email || "",
      tipoUsuario: contacto?.tipo_usuario || "refugio",
      calle: direccion?.calle || "",
      noExt: direccion?.no_ext || "",
      noInt: direccion?.no_int || "",
      colonia: direccion?.colonia || "",
      ciudad: direccion?.ciudad || "",
      estado: direccion?.estado || "",
      pais: direccion?.pais || "México",
    });
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handleEditClick() {
    loadFormData(refugio);
    setEditErrorMessage("");
    setIsEditing(true);
  }

  function handleCancelEdit() {
    loadFormData(refugio);
    setEditErrorMessage("");
    setIsEditing(false);
  }

  async function handleSaveEdit(event) {
    event.preventDefault();

    setSaving(true);
    setEditErrorMessage("");

    try {
      const response = await updateRefugio(id, formData);

      if (response.errorMessage) {
        setEditErrorMessage(response.errorMessage);
        return;
      }

      setRefugio(response.data);
      loadFormData(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error inesperado actualizando refugio:", error);
      setEditErrorMessage("Ocurrió un error inesperado actualizando el refugio.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 text-center text-sm font-semibold text-slate-400 shadow-sm ring-1 ring-slate-200">
          Cargando información del refugio...
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-semibold text-red-500">
            {errorMessage}
          </p>

          <div className="mt-5 flex justify-center gap-3">
            <button
              type="button"
              onClick={fetchRefugio}
              className="rounded-full bg-slate-800 px-5 py-2 text-sm font-bold text-white hover:bg-slate-700"
            >
              Reintentar
            </button>

            <Link
              to="/admin/refugio"
              className="rounded-full px-5 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100"
            >
              Volver
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!refugio) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 text-center text-sm font-semibold text-slate-400 shadow-sm ring-1 ring-slate-200">
          No se encontró el refugio.
        </div>
      </div>
    );
  }

  const contacto = refugio.contacto;
  const direccion = contacto?.direccion;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              to="/admin/refugio"
              className="text-sm font-semibold text-slate-400 hover:text-slate-600"
            >
              ← Volver a refugios
            </Link>

            <h1 className="mt-3 text-3xl font-extrabold text-slate-800">
              {refugio.nombre}
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-400">
              Detalles generales del refugio.
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
                form="refugio-edit-form"
                disabled={saving}
                className="rounded-full bg-slate-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleSaveEdit}
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
              Editar refugio
            </button>
          )}
        </div>
        <form>
          {editErrorMessage && (
            <div className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {editErrorMessage}
            </div>
          )}
          <div className="grid gap-6 lg:grid-cols-3">
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
              <h2 className="text-lg font-extrabold text-slate-800">
                Información del refugio
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <InfoItem
                  label="Nombre del refugio"
                  value={refugio.nombre}
                  isEditing={isEditing}
                  name="nombreRefugio"
                  formValue={formData.nombreRefugio}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                />

                <InfoItem label="ID" value={refugio.id} />
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-extrabold text-slate-800">
                Resumen
              </h2>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-green-50 p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-green-700">
                    Estado
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-700">
                    Registrado
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Contacto
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {contacto?.nombre || "Sin contacto"}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-3">
              <h2 className="text-lg font-extrabold text-slate-800">
                Información de contacto
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <InfoItem
                  label="Nombre de contacto"
                  value={contacto?.nombre || "Sin contacto"}
                  isEditing={isEditing}
                  name="nombreContacto"
                  formValue={formData.nombreContacto}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                />

                <InfoItem
                  label="Teléfono"
                  value={contacto?.telefono || "Sin teléfono"}
                  isEditing={isEditing}
                  name="telefono"
                  formValue={formData.telefono}
                  onChange={handleInputChange}
                  maxLength={10}
                />

                <InfoItem
                  label="Email"
                  value={contacto?.email || "Sin email"}
                  isEditing={isEditing}
                  name="email"
                  formValue={formData.email}
                  onChange={handleInputChange}
                  type="email"
                  maxLength={100}
                />

                <InfoItem
                  label="Tipo de usuario"
                  value={contacto?.tipo_usuario || "Sin tipo"}
                  isEditing={isEditing}
                  name="tipoUsuario"
                  formValue={formData.tipoUsuario}
                  onChange={handleInputChange}
                  required
                  maxLength={20}
                />
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-3">
              <h2 className="text-lg font-extrabold text-slate-800">
                Dirección
              </h2>

              <p className="mt-2 text-sm font-medium text-slate-400">
                {formatDireccion(direccion)}
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <InfoItem
                  label="Calle"
                  value={direccion?.calle || "Sin calle"}
                  isEditing={isEditing}
                  name="calle"
                  formValue={formData.calle}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                />

                <InfoItem
                  label="No. exterior"
                  value={direccion?.no_ext || "Sin número"}
                  isEditing={isEditing}
                  name="noExt"
                  formValue={formData.noExt}
                  onChange={handleInputChange}
                  required
                  maxLength={10}
                />

                <InfoItem
                  label="No. interior"
                  value={direccion?.no_int || "Sin número interior"}
                  isEditing={isEditing}
                  name="noInt"
                  formValue={formData.noInt}
                  onChange={handleInputChange}
                  maxLength={10}
                />

                <InfoItem
                  label="Colonia"
                  value={direccion?.colonia || "Sin colonia"}
                  isEditing={isEditing}
                  name="colonia"
                  formValue={formData.colonia}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                />

                <InfoItem
                  label="Ciudad"
                  value={direccion?.ciudad || "Sin ciudad"}
                  isEditing={isEditing}
                  name="ciudad"
                  formValue={formData.ciudad}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                />

                <InfoItem
                  label="Estado"
                  value={direccion?.estado || "Sin estado"}
                  isEditing={isEditing}
                  name="estado"
                  formValue={formData.estado}
                  onChange={handleInputChange}
                  required
                  maxLength={30}
                />

                <InfoItem
                  label="País"
                  value={direccion?.pais || "Sin país"}
                  isEditing={isEditing}
                  name="pais"
                  formValue={formData.pais}
                  onChange={handleInputChange}
                  required
                  maxLength={30}
                />
              </div>
            </section>
          </div>
        </form>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  isEditing = false,
  name,
  formValue,
  onChange,
  required = false,
  type = "text",
  maxLength,
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <label className="text-xs font-black uppercase tracking-widest text-slate-400">
        {label}
      </label>

      {isEditing ? (
        <input
          type={type}
          name={name}
          value={formValue}
          onChange={onChange}
          required={required}
          maxLength={maxLength}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500"
        />
      ) : (
        <p className="mt-1 break-words text-sm font-bold text-slate-700">
          {value}
        </p>
      )}
    </div>
  );
}