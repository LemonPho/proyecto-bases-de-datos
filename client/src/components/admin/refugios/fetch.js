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

  const {
    nombreRefugio,
    nombreContacto,
    telefono,
    email,
    calle,
    noExt,
    noInt,
    colonia,
    ciudad,
    estado,
    pais,
  } = formData;

  const { data: direccionData, error: direccionError } = await supabase
    .from("direcciones")
    .insert({
      calle,
      no_ext: noExt,
      no_int: noInt || null,
      colonia,
      ciudad,
      estado,
      pais,
    })
    .select("id")
    .single();

  if (direccionError) {
    console.error("Error creando dirección:", direccionError);
    response.errorMessage = "No se pudo crear la dirección del refugio.";
    return response;
  }

  const { data: contactoData, error: contactoError } = await supabase
    .from("contactos")
    .insert({
      direccion_id: direccionData.id,
      telefono,
      email,
      nombre: nombreContacto,
      tipo_usuario: "refugio",
    })
    .select("id")
    .single();

  if (contactoError) {
    console.error("Error creando contacto:", contactoError);
    response.errorMessage = "No se pudo crear el contacto del refugio.";
    return response;
  }

  const { data: refugioData, error: refugioError } = await supabase
    .from("refugios")
    .insert({
      nombre: nombreRefugio,
      contacto_id: contactoData.id,
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