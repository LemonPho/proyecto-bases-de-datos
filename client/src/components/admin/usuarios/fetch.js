import { supabase } from "../../../lib/supabase";

// Tipos de usuario válidos y su tabla de rol correspondiente
export const TIPOS_USUARIO = ["adoptante", "empleado", "voluntario", "donante", "rescatista", "refugio"];

const TABLA_POR_TIPO = {
  adoptante: "adoptantes",
  donante: "donantes",
  rescatista: "rescatistas",
  voluntario: "voluntarios",
};

export async function getUsuarios() {
  const response = {
    data: [],
    errorMessage: "",
  };

  const { data, error } = await supabase
    .from("contactos")
    .select(`
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
    `)
    .order("nombre", { ascending: true });

  if (error) {
    console.error("Error cargando usuarios:", error);
    response.errorMessage = "No se pudieron cargar los usuarios.";
  } else {
    response.data = data || [];
  }

  return response;
}

export async function getUsuarioById(id) {
  const response = {
    data: null,
    errorMessage: "",
  };

  const { data, error } = await supabase
    .from("contactos")
    .select(`
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
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error cargando usuario:", error);
    response.errorMessage = "No se pudo cargar la información del usuario.";
  } else {
    response.data = data;
  }

  return response;
}

export async function createUsuario(formData) {
  const response = {
    data: null,
    errorMessage: "",
  };

  const {
    nombre,
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

  // 1. Crear dirección si se proporcionó calle
  let direccionId = null;

  if (calle) {
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
      response.errorMessage = "No se pudo crear la dirección del usuario.";
      return response;
    }

    direccionId = direccionData.id;
  }

  // 2. Crear contacto
  const { data: contactoData, error: contactoError } = await supabase
    .from("contactos")
    .insert({
      nombre,
      telefono: telefono || null,
      email: email || null,
      tipo_usuario: tipoUsuario,
      direccion_id: direccionId,
    })
    .select("id")
    .single();

  if (contactoError) {
    console.error("Error creando contacto:", contactoError);
    response.errorMessage = "No se pudo crear el usuario.";
    return response;
  }

  // 3. Insertar en la tabla de rol si aplica
  const tablaRol = TABLA_POR_TIPO[tipoUsuario];

  if (tablaRol) {
    const { error: rolError } = await supabase
      .from(tablaRol)
      .insert({ contacto_id: contactoData.id });

    if (rolError) {
      console.error(`Error asignando rol en ${tablaRol}:`, rolError);
      response.errorMessage = `El usuario fue creado pero no se pudo asignar el rol de ${tipoUsuario}.`;
      return response;
    }
  }

  // 4. Devolver el usuario recién creado con todos sus datos
  const usuarioCreado = await getUsuarioById(contactoData.id);

  if (usuarioCreado.errorMessage) {
    response.errorMessage = usuarioCreado.errorMessage;
    return response;
  }

  response.data = usuarioCreado.data;
  return response;
}

export async function updateUsuario(id, formData) {
  const response = {
    data: null,
    errorMessage: "",
  };

  const {
    nombre,
    telefono,
    email,
    tipoUsuario,
    tipoUsuarioAnterior,
    direccionId,
    calle,
    noExt,
    noInt,
    colonia,
    ciudad,
    estado,
    pais,
  } = formData;

  // 1. Actualizar o crear dirección
  if (direccionId) {
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
      response.errorMessage = "No se pudo actualizar la dirección del usuario.";
      return response;
    }
  } else if (calle) {
    // No tenía dirección, se crea una nueva
    const { data: nuevaDireccion, error: direccionError } = await supabase
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
      response.errorMessage = "No se pudo crear la dirección del usuario.";
      return response;
    }

    // Asociar la nueva dirección al contacto
    await supabase
      .from("contactos")
      .update({ direccion_id: nuevaDireccion.id })
      .eq("id", id);
  }

  // 2. Actualizar contacto
  const { error: contactoError } = await supabase
    .from("contactos")
    .update({
      nombre,
      telefono: telefono || null,
      email: email || null,
      tipo_usuario: tipoUsuario,
    })
    .eq("id", id);

  if (contactoError) {
    console.error("Error actualizando contacto:", contactoError);
    response.errorMessage = "No se pudo actualizar el usuario.";
    return response;
  }

  // 3. Si el tipo de usuario cambió, actualizar tablas de rol
  if (tipoUsuario !== tipoUsuarioAnterior) {
    const tablaAnterior = TABLA_POR_TIPO[tipoUsuarioAnterior];
    const tablaNueva = TABLA_POR_TIPO[tipoUsuario];

    // Eliminar del rol anterior
    if (tablaAnterior) {
      const { error: deleteError } = await supabase
        .from(tablaAnterior)
        .delete()
        .eq("contacto_id", id);

      if (deleteError) {
        console.error(`Error eliminando rol anterior (${tablaAnterior}):`, deleteError);
        response.errorMessage = "No se pudo cambiar el rol del usuario.";
        return response;
      }
    }

    // Insertar en el nuevo rol
    if (tablaNueva) {
      const { error: insertError } = await supabase
        .from(tablaNueva)
        .insert({ contacto_id: id });

      if (insertError) {
        console.error(`Error asignando nuevo rol (${tablaNueva}):`, insertError);
        response.errorMessage = "El usuario fue actualizado pero no se pudo reasignar el rol.";
        return response;
      }
    }
  }

  const usuarioActualizado = await getUsuarioById(id);

  if (usuarioActualizado.errorMessage) {
    response.errorMessage = usuarioActualizado.errorMessage;
    return response;
  }

  response.data = usuarioActualizado.data;
  return response;
}
