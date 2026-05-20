import { supabase } from "../../../lib/supabase";

export const ESTATUS_SOLICITUD = [
  "pendiente",
  "en_revision",
  "aprobada",
  "rechazada",
  "cancelada",
];

const SELECT_SOLICITUD = `
  id,
  fecha_solicitud,
  estatus,
  animal_id,
  adoptante_id,
  animal:animal_id (
    id,
    nombre,
    estado,
    raza:raza_id (
      id,
      nombre_raza,
      especie:especie_id ( id, nombre_especie )
    )
  ),
  adoptante:adoptante_id (
    id,
    contacto:contacto_id ( id, nombre, email, telefono )
  ),
  adopcion:adopciones (
    id,
    fecha_adopcion,
    contrato_firmado
  )
`;

export async function getSolicitudes() {
  const response = { data: [], errorMessage: "" };

  const { data, error } = await supabase
    .from("solicitudes_adopcion")
    .select(SELECT_SOLICITUD)
    .order("fecha_solicitud", { ascending: false });

  if (error) {
    console.error("Error cargando solicitudes:", error);
    response.errorMessage = "No se pudieron cargar las solicitudes de adopción.";
  } else {
    response.data = data || [];
  }

  return response;
}

export async function getSolicitudById(id) {
  const response = { data: null, errorMessage: "" };

  const { data, error } = await supabase
    .from("solicitudes_adopcion")
    .select(SELECT_SOLICITUD)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error cargando solicitud:", error);
    response.errorMessage = "No se pudo cargar la solicitud de adopción.";
  } else {
    response.data = data;
  }

  return response;
}

export async function createSolicitud(formData) {
  const response = { data: null, errorMessage: "" };
  const { animalId, adoptanteId, fechaSolicitud, estatus } = formData;

  const { data, error } = await supabase
    .from("solicitudes_adopcion")
    .insert({
      animal_id: animalId,
      adoptante_id: adoptanteId,
      fecha_solicitud: fechaSolicitud,
      estatus,
    })
    .select(SELECT_SOLICITUD)
    .single();

  if (error) {
    console.error("Error creando solicitud:", error);
    response.errorMessage = "No se pudo crear la solicitud de adopción.";
    return response;
  }

  response.data = data;
  return response;
}

export async function updateSolicitud(id, formData) {
  const response = { data: null, errorMessage: "" };
  const { animalId, adoptanteId, fechaSolicitud, estatus } = formData;

  const { error } = await supabase
    .from("solicitudes_adopcion")
    .update({
      animal_id: animalId,
      adoptante_id: adoptanteId,
      fecha_solicitud: fechaSolicitud,
      estatus,
    })
    .eq("id", id);

  if (error) {
    console.error("Error actualizando solicitud:", error);
    response.errorMessage = "No se pudo actualizar la solicitud.";
    return response;
  }

  const updated = await getSolicitudById(id);
  if (updated.errorMessage) {
    response.errorMessage = updated.errorMessage;
    return response;
  }

  response.data = updated.data;
  return response;
}

export async function formalizarAdopcion(solicitudId, fechaAdopcion, contratoFirmado) {
  const response = { data: null, errorMessage: "" };

  const { data, error } = await supabase
    .from("adopciones")
    .insert({
      solicitud_id: solicitudId,
      fecha_adopcion: fechaAdopcion,
      contrato_firmado: contratoFirmado,
    })
    .select("id, fecha_adopcion, contrato_firmado")
    .single();

  if (error) {
    console.error("Error formalizando adopción:", error);
    response.errorMessage = "No se pudo formalizar la adopción.";
    return response;
  }

  response.data = data;
  return response;
}

export async function getAnimalesDisponibles() {
  const { data, error } = await supabase
    .from("animales")
    .select(`
      id,
      nombre,
      estado,
      raza:raza_id ( nombre_raza )
    `)
    .order("nombre", { ascending: true });

  if (error) {
    console.error("Error obteniendo animales:", error);
    return [];
  }
  return data || [];
}

export async function getAdoptantes() {
  const { data, error } = await supabase
    .from("adoptantes")
    .select(`
      id,
      contacto:contacto_id ( id, nombre, email )
    `);

  if (error) {
    console.error("Error obteniendo adoptantes:", error);
    return [];
  }
  return data || [];
}
