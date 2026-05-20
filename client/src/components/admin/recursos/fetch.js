import { supabase } from "../../../lib/supabase";

export const ESTATUS_EMPLEADO = [
  "activo",
  "inactivo",
  "vacaciones",
  "suspendido",
  "baja",
];

const SELECT_EMPLEADO = `
  id,
  refugio_id,
  cargo_id,
  contacto_id,
  estatus,
  refugio:refugio_id ( id, nombre ),
  cargo:cargo_id ( id, nombre_cargo, descripcion ),
  contacto:contacto_id (
    id,
    nombre,
    telefono,
    email,
    tipo_usuario
  ),
  sueldos ( id, sueldo )
`;

export async function getEmpleados() {
  const response = { data: [], errorMessage: "" };

  const { data, error } = await supabase
    .from("empleados")
    .select(SELECT_EMPLEADO);

  if (error) {
    console.error("Error cargando empleados:", error);
    response.errorMessage = "No se pudieron cargar los empleados.";
  } else {
    response.data = data || [];
  }

  return response;
}

export async function getEmpleadoById(id) {
  const response = { data: null, errorMessage: "" };

  const { data, error } = await supabase
    .from("empleados")
    .select(SELECT_EMPLEADO)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error cargando empleado:", error);
    response.errorMessage = "No se pudo cargar la información del empleado.";
  } else {
    response.data = data;
  }

  return response;
}

export async function createEmpleado(formData) {
  const response = { data: null, errorMessage: "" };

  const {
    contactoId,
    refugioId,
    cargoId,
    estatus,
    sueldo,
  } = formData;

  if (!contactoId) {
    response.errorMessage = "Debes seleccionar un contacto.";
    return response;
  }

  // 2. Crear empleado
  const { data: empleadoData, error: empleadoError } = await supabase
    .from("empleados")
    .insert({
      refugio_id: refugioId,
      cargo_id: cargoId,
      contacto_id: contactoId,
      estatus: estatus || "activo",
    })
    .select(SELECT_EMPLEADO)
    .single();

  if (empleadoError) {
    console.error("Error creando empleado:", empleadoError);
    response.errorMessage = "No se pudo crear el empleado.";
    return response;
  }

  // 3. Sueldo (opcional)
  if (sueldo) {
    const { error: sueldoError } = await supabase
      .from("sueldos")
      .insert({
        empleado_id: empleadoData.id,
        sueldo: parseFloat(sueldo),
      });

    if (sueldoError) {
      console.error("Error creando sueldo:", sueldoError);
      response.errorMessage =
        "El empleado se creó pero no se pudo registrar su sueldo.";
      return response;
    }
  }

  const refreshed = await getEmpleadoById(empleadoData.id);
  response.data = refreshed.data;
  return response;
}

export async function updateEmpleado(id, formData) {
  const response = { data: null, errorMessage: "" };

  const {
    contactoId,
    nombre,
    telefono,
    email,
    refugioId,
    cargoId,
    estatus,
    sueldoId,
    sueldo,
  } = formData;

  // 1. Contacto
  const { error: contactoError } = await supabase
    .from("contactos")
    .update({
      nombre,
      telefono: telefono || null,
      email: email || null,
    })
    .eq("id", contactoId);

  if (contactoError) {
    console.error("Error actualizando contacto:", contactoError);
    response.errorMessage = "No se pudo actualizar el contacto.";
    return response;
  }

  // 2. Empleado
  const { error: empleadoError } = await supabase
    .from("empleados")
    .update({
      refugio_id: refugioId,
      cargo_id: cargoId,
      estatus: estatus || "activo",
    })
    .eq("id", id);

  if (empleadoError) {
    console.error("Error actualizando empleado:", empleadoError);
    response.errorMessage = "No se pudo actualizar el empleado.";
    return response;
  }

  // 3. Sueldo (update si existe, insert si no)
  if (sueldo !== "" && sueldo !== null && sueldo !== undefined) {
    if (sueldoId) {
      const { error: sueldoError } = await supabase
        .from("sueldos")
        .update({ sueldo: parseFloat(sueldo) })
        .eq("id", sueldoId);

      if (sueldoError) {
        console.error("Error actualizando sueldo:", sueldoError);
        response.errorMessage = "No se pudo actualizar el sueldo.";
        return response;
      }
    } else {
      const { error: sueldoError } = await supabase
        .from("sueldos")
        .insert({
          empleado_id: id,
          sueldo: parseFloat(sueldo),
        });

      if (sueldoError) {
        console.error("Error creando sueldo:", sueldoError);
        response.errorMessage = "No se pudo registrar el sueldo.";
        return response;
      }
    }
  }

  const refreshed = await getEmpleadoById(id);
  if (refreshed.errorMessage) {
    response.errorMessage = refreshed.errorMessage;
    return response;
  }
  response.data = refreshed.data;
  return response;
}

// ── Catálogos ─────────────────────────────────────────────────────────────

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

export async function getRefugios() {
  const { data, error } = await supabase
    .from("refugios")
    .select("id, nombre")
    .order("nombre", { ascending: true });

  if (error) {
    console.error("Error obteniendo refugios:", error);
    return [];
  }
  return data || [];
}

export async function getCargos() {
  const { data, error } = await supabase
    .from("cargos")
    .select("id, nombre_cargo, descripcion")
    .order("nombre_cargo", { ascending: true });

  if (error) {
    console.error("Error obteniendo cargos:", error);
    return [];
  }
  return data || [];
}

export async function createCargo(nombreCargo, descripcion) {
  const { data, error } = await supabase
    .from("cargos")
    .insert({
      nombre_cargo: nombreCargo,
      descripcion: descripcion || null,
    })
    .select("id, nombre_cargo, descripcion")
    .single();

  if (error) {
    console.error("Error creando cargo:", error);
    throw new Error("No se pudo crear el cargo.");
  }

  return data;
}
