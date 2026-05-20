import { supabase } from "../../../lib/supabase";

export async function getRefugios() {
  const response = {
    data: [],
    errorMessage: "",
  };

  const { data, error } = await supabase
    .from("refugios")
    .select(`
      id,
      nombre,
      contacto:contacto_id (
        id,
        nombre,
        telefono,
        email,
        tipo_usuario,
        direccion:direccion_id (
          calle,
          no_ext,
          no_int,
          colonia,
          ciudad,
          estado,
          pais
        )
      )
    `)
    .order("nombre", { ascending: true });

  if (error) {
    console.error("Error cargando refugios:", error);
    response.errorMessage = "No se pudieron cargar los refugios.";
  } else {
    response.data = data || [];
  }

  return response;
}

export async function createRefugio(formData) {
  const response = {
    data: null,
    errorMessage: "",
  };

  const { nombreRefugio, contactoId } = formData;

  if (!contactoId) {
    response.errorMessage = "Debes seleccionar un contacto.";
    return response;
  }

  const { data: refugioData, error: refugioError } = await supabase
    .from("refugios")
    .insert({
      nombre: nombreRefugio,
      contacto_id: contactoId,
    })
    .select(`
      id,
      nombre,
      contacto:contacto_id (
        id,
        nombre,
        telefono,
        email,
        tipo_usuario,
        direccion:direccion_id (
          calle,
          no_ext,
          no_int,
          colonia,
          ciudad,
          estado,
          pais
        )
      )
    `)
    .single();

  if (refugioError) {
    console.error("Error creando refugio:", refugioError);
    response.errorMessage = "No se pudo crear el refugio.";
    return response;
  }

  response.data = refugioData;
  return response;
}

export async function getContactos() {
  const { data, error } = await supabase
    .from("contactos")
    .select("id, nombre, email, tipo_usuario")
    .order("nombre", { ascending: true });

  if (error) {
    console.error("Error obteniendo contactos:", error);
    return [];
  }
  return data || [];
}

export async function getRefugioById(id) {
  const response = {
    data: null,
    errorMessage: "",
  };

  const { data, error } = await supabase
    .from("refugios")
    .select(`
      id,
      nombre,
      contacto:contacto_id (
        id,
        nombre,
        telefono,
        email,
        tipo_usuario,
        direccion:direccion_id (
          id,
          calle,
          no_ext,
          no_int,
          colonia,
          ciudad,
          estado,
          pais
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error cargando refugio:", error);
    response.errorMessage = "No se pudo cargar la información del refugio.";
  } else {
    response.data = data;
  }

  return response;
}

export async function getAreasByRefugio(refugioId) {
  const response = { data: [], errorMessage: "" };

  const { data, error } = await supabase
    .from("areas_refugio")
    .select("id, refugio_id, nombre_area, capacidad_maxima")
    .eq("refugio_id", refugioId)
    .order("nombre_area", { ascending: true });

  if (error) {
    console.error("Error cargando áreas:", error);
    response.errorMessage = "No se pudieron cargar las áreas del refugio.";
  } else {
    response.data = data || [];
  }

  return response;
}

export async function createArea(formData) {
  const response = { data: null, errorMessage: "" };
  const { refugioId, nombreArea, capacidadMaxima } = formData;

  const { data, error } = await supabase
    .from("areas_refugio")
    .insert({
      refugio_id: refugioId,
      nombre_area: nombreArea,
      capacidad_maxima: parseInt(capacidadMaxima, 10),
    })
    .select("id, refugio_id, nombre_area, capacidad_maxima")
    .single();

  if (error) {
    console.error("Error creando área:", error);
    response.errorMessage = "No se pudo crear el área del refugio.";
    return response;
  }

  response.data = data;
  return response;
}

export async function updateArea(id, formData) {
  const response = { data: null, errorMessage: "" };
  const { nombreArea, capacidadMaxima } = formData;

  const { data, error } = await supabase
    .from("areas_refugio")
    .update({
      nombre_area: nombreArea,
      capacidad_maxima: parseInt(capacidadMaxima, 10),
    })
    .eq("id", id)
    .select("id, refugio_id, nombre_area, capacidad_maxima")
    .single();

  if (error) {
    console.error("Error actualizando área:", error);
    response.errorMessage = "No se pudo actualizar el área.";
    return response;
  }

  response.data = data;
  return response;
}

export async function deleteArea(id) {
  const response = { errorMessage: "" };

  const { error } = await supabase
    .from("areas_refugio")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error eliminando área:", error);
    if (error.code === "23503") {
      response.errorMessage =
        "No se puede eliminar el área porque tiene animales registrados.";
    } else {
      response.errorMessage = "No se pudo eliminar el área.";
    }
  }

  return response;
}

export async function updateRefugio(id, formData) {
  const response = {
    data: null,
    errorMessage: "",
  };

  const {
    nombreRefugio,
    contactoId,
    direccionId,
    nombreContacto,
    telefono,
    email,
    tipoUsuario,
    calle,
    noExt,
    noInt,
    colonia,
    ciudad,
    estado,
    pais,
  } = formData;

  const { error: refugioError } = await supabase
    .from("refugios")
    .update({
      nombre: nombreRefugio,
    })
    .eq("id", id);

  if (refugioError) {
    console.error("Error actualizando refugio:", refugioError);
    response.errorMessage = "No se pudo actualizar el refugio.";
    return response;
  }

  const { error: contactoError } = await supabase
    .from("contactos")
    .update({
      nombre: nombreContacto,
      telefono: telefono || null,
      email: email || null,
      tipo_usuario: tipoUsuario || "refugio",
    })
    .eq("id", contactoId);

  if (contactoError) {
    console.error("Error actualizando contacto:", contactoError);
    response.errorMessage = "No se pudo actualizar el contacto del refugio.";
    return response;
  }

  const { error: direccionError } = await supabase
    .from("direcciones")
    .update({
      calle,
      no_ext: noExt,
      no_int: noInt || null,
      colonia,
      ciudad,
      estado,
      pais,
    })
    .eq("id", direccionId);

  if (direccionError) {
    console.error("Error actualizando dirección:", direccionError);
    response.errorMessage = "No se pudo actualizar la dirección del refugio.";
    return response;
  }

  const updatedRefugio = await getRefugioById(id);

  if (updatedRefugio.errorMessage) {
    response.errorMessage = updatedRefugio.errorMessage;
    return response;
  }

  response.data = updatedRefugio.data;
  return response;
}