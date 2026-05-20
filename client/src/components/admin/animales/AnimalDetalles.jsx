import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getAnimalById,
  updateAnimal,
  ESTADOS_ANIMAL,
  getAreasRefugio,
  getRazas,
} from "./fetch";

const ESTADO_COLORES = {
  sano: "bg-green-100 text-green-700",
  enfermo: "bg-red-100 text-red-700",
  en_tratamiento: "bg-amber-100 text-amber-700",
  recuperacion: "bg-blue-100 text-blue-700",
  adoptado: "bg-purple-100 text-purple-700",
  resguardado: "bg-slate-100 text-slate-700",
  fallecido: "bg-zinc-200 text-zinc-700",
};

export default function AnimalDetalles() {
  const { id } = useParams();

  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [editErrorMessage, setEditErrorMessage] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const [areas, setAreas] = useState([]);
  const [razas, setRazas] = useState([]);

  const [formData, setFormData] = useState({
    nombre: "",
    estado: "sano",
    fechaIngreso: "",
    areaId: "",
    razaId: "",
  });

  useEffect(() => {
    fetchAnimal();
  }, [id]);

  useEffect(() => {
    if (isEditing && areas.length === 0) {
      loadOptions();
    }
  }, [isEditing]);

  async function fetchAnimal() {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await getAnimalById(id);

      if (response.errorMessage) {
        setErrorMessage(response.errorMessage);
        setAnimal(null);
      } else {
        setAnimal(response.data);
        loadFormData(response.data);
      }
    } catch (error) {
      console.error("Error inesperado cargando animal:", error);
      setErrorMessage("Ocurrió un error inesperado cargando el animal.");
      setAnimal(null);
    } finally {
      setLoading(false);
    }
  }

  async function loadOptions() {
    setLoadingOptions(true);
    try {
      const [areasData, razasData] = await Promise.all([
        getAreasRefugio(),
        getRazas(),
      ]);
      setAreas(areasData || []);
      setRazas(razasData || []);
    } catch (error) {
      console.error("Error cargando opciones:", error);
    } finally {
      setLoadingOptions(false);
    }
  }

  function loadFormData(data) {
    if (!data) return;
    setFormData({
      nombre: data.nombre || "",
      estado: data.estado || "sano",
      fechaIngreso: data.fecha_ingreso || "",
      areaId: data.area_id || "",
      razaId: data.raza_id || "",
    });
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleEditClick() {
    loadFormData(animal);
    setEditErrorMessage("");
    setIsEditing(true);
  }

  function handleCancelEdit() {
    loadFormData(animal);
    setEditErrorMessage("");
    setIsEditing(false);
  }

  async function handleSaveEdit(event) {
    event.preventDefault();
    setSaving(true);
    setEditErrorMessage("");

    try {
      const response = await updateAnimal(id, formData);

      if (response.errorMessage) {
        setEditErrorMessage(response.errorMessage);
        return;
      }

      setAnimal(response.data);
      loadFormData(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error inesperado actualizando animal:", error);
      setEditErrorMessage("Ocurrió un error inesperado actualizando el animal.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 text-center text-sm font-semibold text-slate-400 shadow-sm ring-1 ring-slate-200">
          Cargando información del animal...
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
              onClick={fetchAnimal}
              className="rounded-full bg-slate-800 px-5 py-2 text-sm font-bold text-white hover:bg-slate-700"
            >
              Reintentar
            </button>
            <Link
              to="/admin/animales"
              className="rounded-full px-5 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100"
            >
              Volver
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 text-center text-sm font-semibold text-slate-400 shadow-sm ring-1 ring-slate-200">
          No se encontró el animal.
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
              to="/admin/animales"
              className="text-sm font-semibold text-slate-400 hover:text-slate-600"
            >
              ← Volver a animales
            </Link>

            <h1 className="mt-3 text-3xl font-extrabold text-slate-800">
              {animal.nombre || "Animal sin nombre"}
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-400">
              Información detallada del animal.
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
                form="animal-edit-form"
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
              Editar animal
            </button>
          )}
        </div>

        <form id="animal-edit-form" onSubmit={handleSaveEdit}>
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
                  label="Nombre"
                  value={animal.nombre || "Sin nombre"}
                  isEditing={isEditing}
                  name="nombre"
                  formValue={formData.nombre}
                  onChange={handleInputChange}
                  maxLength={50}
                />

                <InfoItem
                  label="Fecha de ingreso"
                  value={animal.fecha_ingreso}
                  isEditing={isEditing}
                  name="fechaIngreso"
                  formValue={formData.fechaIngreso}
                  onChange={handleInputChange}
                  type="date"
                  required
                />

                <InfoItem label="ID" value={animal.id} />
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-extrabold text-slate-800">Estado</h2>

              <div className="mt-6">
                {isEditing ? (
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500 capitalize"
                  >
                    {ESTADOS_ANIMAL.map((estado) => (
                      <option key={estado} value={estado} className="capitalize">
                        {estado.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-bold capitalize ${
                      ESTADO_COLORES[animal.estado] ?? "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {animal.estado.replace("_", " ")}
                  </span>
                )}
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-3">
              <h2 className="text-lg font-extrabold text-slate-800">
                Ubicación
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Refugio / Área
                  </label>
                  {isEditing ? (
                    <select
                      name="areaId"
                      value={formData.areaId}
                      onChange={handleInputChange}
                      required
                      disabled={loadingOptions}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500"
                    >
                      <option value="">Selecciona un área...</option>
                      {areas.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.refugio?.nombre || "Sin refugio"} —{" "}
                          {area.nombre_area}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {animal.area?.refugio?.nombre || "Sin refugio"} —{" "}
                      {animal.area?.nombre_area || "Sin área"}
                    </p>
                  )}
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Especie / Raza
                  </label>
                  {isEditing ? (
                    <select
                      name="razaId"
                      value={formData.razaId}
                      onChange={handleInputChange}
                      required
                      disabled={loadingOptions}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-slate-500"
                    >
                      <option value="">Selecciona la raza...</option>
                      {razas.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.nombre_raza}
                          {r.especie?.nombre_especie
                            ? ` (${r.especie.nombre_especie})`
                            : ""}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 text-sm font-bold text-slate-700 capitalize">
                      {animal.raza?.especie?.nombre_especie || "Sin especie"} —{" "}
                      {animal.raza?.nombre_raza || "Sin raza"}
                    </p>
                  )}
                </div>
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
