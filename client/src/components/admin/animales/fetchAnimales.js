import { supabase } from "../../../lib/supabase";

// Obtener todos los animales para la tabla principal
export const getAnimales = async () => {
  const { data, error } = await supabase
    .from("animales")
    .select(`
      id,
      nombre,
      estado,
      fecha_ingreso,
      razas (nombre_raza),
      areas_refugio (nombre_area)
    `)
    .order("fecha_ingreso", { ascending: false });

  if (error) throw error;
  return data;
};

// Obtener los detalles de un animal específico por ID
export const getAnimalById = async (id) => {
  const { data, error } = await supabase
    .from("animales")
    .select(`
      *,
      razas (nombre_raza, especies(nombre_especie)),
      areas_refugio (nombre_area),
      galeria_fotos (id, url_foto)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

// Insertar un nuevo animal
export const createAnimal = async (animalData) => {
  const { data, error } = await supabase
    .from("animales")
    .insert([animalData]);

  if (error) throw error;
  return data;
};

// Obtener los catálogos para los selectores del formulario (áreas y razas)
export const getSelectOptions = async () => {
  const [areasRes, razasRes] = await Promise.all([
    supabase.from("areas_refugio").select("id, nombre_area"),
    supabase.from("razas").select("id, nombre_raza")
  ]);

  if (areasRes.error) throw areasRes.error;
  if (razasRes.error) throw razasRes.error;

  return {
    areas: areasRes.data || [],
    razas: razasRes.data || []
  };
};

// Actualizar un animal existente
export const updateAnimal = async (id, animalData) => {
  const { data, error } = await supabase
    .from("animales")
    .update(animalData)
    .eq("id", id);

  if (error) throw error;
  return data;
};

// Eliminar un animal
export const deleteAnimal = async (id) => {
  const { error } = await supabase
    .from("animales")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
};

// Agregar una foto a la galería de un animal
export const agregarFoto = async (animalId, urlFoto) => {
  const { data, error } = await supabase
    .from("galeria_fotos")
    .insert([{ animal_id: animalId, url_foto: urlFoto }])
    .select(); // El .select() es para que nos devuelva el registro recién creado

  if (error) throw error;
  return data[0];
};

// Eliminar una foto de la galería
export const eliminarFoto = async (fotoId) => {
  const { error } = await supabase
    .from("galeria_fotos")
    .delete()
    .eq("id", fotoId);

  if (error) throw error;
  return true;
};