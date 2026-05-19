import { supabase } from "../../../lib/supabase";

const SELECT_RESCATE = `
  id,
  fecha_rescate,
  lugar_rescate,
  animal_id,
  rescatista_id,
  animal:animal_id (
    id,
    nombre,
    estado,
    raza:raza_id (
      nombre_raza,
      especie:especie_id ( nombre_especie )
    )
  ),
  rescatista:rescatista_id (
    id,
    contacto:contacto_id ( id, nombre, telefono, email )
  )
`;

export async function getRescates() {
  const response = { data: [], errorMessage: "" };

  const { data, error } = await supabase
    .from("rescates")
    .select(SELECT_RESCATE)
    .order("fecha_rescate", { ascending: false });

  if (error) {
    console.error("Error cargando rescates:", error);
    response.errorMessage = "No se pudieron cargar los rescates.";
  } else {
    response.data = data || [];
  }

  return response;
}

export async function getRescateById(id) {
  const response = { data: null, errorMessage: "" };

  const { data, error } = await supabase
    .from("rescates")
    .select(SELECT_RESCATE)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error cargando rescate:", error);
    response.errorMessage = "No se pudo cargar la información del rescate.";
  } else {
    response.data = data;
  }

  return response;
}

export async function createRescate(formData) {
  const response = { data: null, errorMessage: "" };
  const { animalId, rescatistaId, fechaRescate, lugarRescate } = formData;

  const { data, error } = await supabase
    .from("rescates")
    .insert({
      animal_id: animalId,
      rescatista_id: rescatistaId,
      fecha_rescate: fechaRescate || null,
      lugar_rescate: lugarRescate || null,
    })
    .select(SELECT_RESCATE)
    .single();

  if (error) {
    console.error("Error creando rescate:", error);
    response.errorMessage = "No se pudo registrar el rescate.";
    return response;
  }

  response.data = data;
  return response;
}

export async function updateRescate(id, formData) {
  const response = { data: null, errorMessage: "" };
  const { animalId, rescatistaId, fechaRescate, lugarRescate } = formData;

  const { error } = await supabase
    .from("rescates")
    .update({
      animal_id: animalId,
      rescatista_id: rescatistaId,
      fecha_rescate: fechaRescate || null,
      lugar_rescate: lugarRescate || null,
    })
    .eq("id", id);

  if (error) {
    console.error("Error actualizando rescate:", error);
    response.errorMessage = "No se pudo actualizar el rescate.";
    return response;
  }

  const updated = await getRescateById(id);
  if (updated.errorMessage) {
    response.errorMessage = updated.errorMessage;
    return response;
  }

  response.data = updated.data;
  return response;
}

export async function getAnimales() {
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

export async function getRescatistas() {
  const { data, error } = await supabase
    .from("rescatistas")
    .select(`
      id,
      contacto:contacto_id ( id, nombre, email )
    `);

  if (error) {
    console.error("Error obteniendo rescatistas:", error);
    return [];
  }
  return data || [];
}
