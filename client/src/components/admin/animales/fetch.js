import { supabase } from "../../../lib/supabase";

export const ESTADOS_ANIMAL = [
  "sano",
  "enfermo",
  "en_tratamiento",
  "recuperacion",
  "adoptado",
  "resguardado",
  "fallecido",
];

const SELECT_ANIMAL = `
  id,
  nombre,
  estado,
  fecha_ingreso,
  area_id,
  raza_id,
  raza:raza_id (
    id,
    nombre_raza,
    especie:especie_id (
      id,
      nombre_especie
    )
  ),
  area:area_id (
    id,
    nombre_area,
    capacidad_maxima,
    refugio:refugio_id (
      id,
      nombre
    )
  )
`;

export async function getAnimales() {
  const response = {
    data: [],
    errorMessage: "",
  };

  const { data, error } = await supabase
    .from("animales")
    .select(SELECT_ANIMAL)
    .order("fecha_ingreso", { ascending: false });

  if (error) {
    console.error("Error cargando animales:", error);
    response.errorMessage = "No se pudieron cargar los animales.";
  } else {
    response.data = data || [];
  }

  return response;
}

export async function getAnimalById(id) {
  const response = {
    data: null,
    errorMessage: "",
  };

  const { data, error } = await supabase
    .from("animales")
    .select(SELECT_ANIMAL)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error cargando animal:", error);
    response.errorMessage = "No se pudo cargar la información del animal.";
  } else {
    response.data = data;
  }

  return response;
}

export async function createAnimal(formData) {
  const response = {
    data: null,
    errorMessage: "",
  };

  const { nombre, estado, fechaIngreso, areaId, razaId } = formData;

  const { data, error } = await supabase
    .from("animales")
    .insert({
      nombre: nombre || null,
      estado,
      fecha_ingreso: fechaIngreso,
      area_id: areaId,
      raza_id: razaId,
    })
    .select(SELECT_ANIMAL)
    .single();

  if (error) {
    console.error("Error creando animal:", error);
    response.errorMessage = "No se pudo registrar el animal.";
    return response;
  }

  response.data = data;
  return response;
}

export async function updateAnimal(id, formData) {
  const response = {
    data: null,
    errorMessage: "",
  };

  const { nombre, estado, fechaIngreso, areaId, razaId } = formData;

  const { error } = await supabase
    .from("animales")
    .update({
      nombre: nombre || null,
      estado,
      fecha_ingreso: fechaIngreso,
      area_id: areaId,
      raza_id: razaId,
    })
    .eq("id", id);

  if (error) {
    console.error("Error actualizando animal:", error);
    response.errorMessage = "No se pudo actualizar el animal.";
    return response;
  }

  const updated = await getAnimalById(id);
  if (updated.errorMessage) {
    response.errorMessage = updated.errorMessage;
    return response;
  }

  response.data = updated.data;
  return response;
}

export async function getAreasRefugio() {
  const { data, error } = await supabase
    .from("areas_refugio")
    .select(`
      id,
      nombre_area,
      refugio:refugio_id ( id, nombre )
    `)
    .order("nombre_area", { ascending: true });

  if (error) {
    console.error("Error obteniendo áreas:", error);
    return [];
  }
  return data || [];
}

export async function getRazas() {
  const { data, error } = await supabase
    .from("razas")
    .select(`
      id,
      nombre_raza,
      especie:especie_id ( id, nombre_especie )
    `)
    .order("nombre_raza", { ascending: true });

  if (error) {
    console.error("Error obteniendo razas:", error);
    return [];
  }
  return data || [];
}

export async function getEspecies() {
  const { data, error } = await supabase
    .from("especies")
    .select("id, nombre_especie")
    .order("nombre_especie", { ascending: true });

  if (error) {
    console.error("Error obteniendo especies:", error);
    return [];
  }
  return data || [];
}

export async function createEspecie(nombreEspecie) {
  const { data, error } = await supabase
    .from("especies")
    .insert({ nombre_especie: nombreEspecie })
    .select("id, nombre_especie")
    .single();

  if (error) {
    console.error("Error creando especie:", error);
    if (error.code === "23505") {
      throw new Error("Ya existe una especie con ese nombre.");
    }
    throw new Error("No se pudo crear la nueva especie.");
  }

  return data;
}

export async function createRaza(nombreRaza, especieId) {
  const { data, error } = await supabase
    .from("razas")
    .insert({
      nombre_raza: nombreRaza,
      especie_id: especieId,
    })
    .select(`
      id,
      nombre_raza,
      especie:especie_id ( id, nombre_especie )
    `)
    .single();

  if (error) {
    console.error("Error creando raza:", error);
    throw new Error("No se pudo crear la nueva raza.");
  }

  return data;
}
