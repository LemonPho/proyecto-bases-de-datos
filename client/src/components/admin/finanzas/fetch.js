import { supabase } from "../../../lib/supabase";

export const TIPOS_DONACION = ["monetaria", "especie", "servicio"];

const SELECT_DONACION = `
  id,
  monto_o_valor,
  tipo_donacion,
  detalle,
  donante_id,
  refugio_id,
  donante:donante_id (
    id,
    contacto:contacto_id ( id, nombre, email )
  ),
  refugio:refugio_id ( id, nombre )
`;

const SELECT_GASTO = `
  id,
  concepto,
  monto,
  fecha_gasto,
  refugio_id,
  compra_suministro_id,
  refugio:refugio_id ( id, nombre )
`;

// ── Donaciones ────────────────────────────────────────────────────────────

export async function getDonaciones() {
  const response = { data: [], errorMessage: "" };

  const { data, error } = await supabase
    .from("donaciones")
    .select(SELECT_DONACION)
    .order("id", { ascending: false });

  if (error) {
    console.error("Error cargando donaciones:", error);
    response.errorMessage = "No se pudieron cargar las donaciones.";
  } else {
    response.data = data || [];
  }

  return response;
}

export async function createDonacion(formData) {
  const response = { data: null, errorMessage: "" };
  const { donanteId, refugioId, montoOValor, tipoDonacion, detalle } = formData;

  const { data, error } = await supabase
    .from("donaciones")
    .insert({
      donante_id: donanteId,
      refugio_id: refugioId,
      monto_o_valor: montoOValor ? parseFloat(montoOValor) : null,
      tipo_donacion: tipoDonacion,
      detalle: detalle || null,
    })
    .select(SELECT_DONACION)
    .single();

  if (error) {
    console.error("Error creando donación:", error);
    response.errorMessage = "No se pudo registrar la donación.";
    return response;
  }

  response.data = data;
  return response;
}

export async function getDonacionById(id) {
  const response = { data: null, errorMessage: "" };

  const { data, error } = await supabase
    .from("donaciones")
    .select(SELECT_DONACION)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error cargando donación:", error);
    response.errorMessage = "No se pudo cargar la información de la donación.";
  } else {
    response.data = data;
  }

  return response;
}

export async function updateDonacion(id, formData) {
  const response = { data: null, errorMessage: "" };
  const { donanteId, refugioId, montoOValor, tipoDonacion, detalle } = formData;

  const { error } = await supabase
    .from("donaciones")
    .update({
      donante_id: donanteId,
      refugio_id: refugioId,
      monto_o_valor: montoOValor ? parseFloat(montoOValor) : null,
      tipo_donacion: tipoDonacion,
      detalle: detalle || null,
    })
    .eq("id", id);

  if (error) {
    console.error("Error actualizando donación:", error);
    response.errorMessage = "No se pudo actualizar la donación.";
    return response;
  }

  const updated = await getDonacionById(id);
  if (updated.errorMessage) {
    response.errorMessage = updated.errorMessage;
    return response;
  }
  response.data = updated.data;
  return response;
}

// ── Gastos operativos ─────────────────────────────────────────────────────

export async function getGastos() {
  const response = { data: [], errorMessage: "" };

  const { data, error } = await supabase
    .from("gastos_operativos")
    .select(SELECT_GASTO)
    .order("fecha_gasto", { ascending: false });

  if (error) {
    console.error("Error cargando gastos:", error);
    response.errorMessage = "No se pudieron cargar los gastos operativos.";
  } else {
    response.data = data || [];
  }

  return response;
}

export async function createGasto(formData) {
  const response = { data: null, errorMessage: "" };
  const { refugioId, concepto, monto, fechaGasto } = formData;

  const { data, error } = await supabase
    .from("gastos_operativos")
    .insert({
      refugio_id: refugioId,
      concepto,
      monto: parseFloat(monto),
      fecha_gasto: fechaGasto,
    })
    .select(SELECT_GASTO)
    .single();

  if (error) {
    console.error("Error creando gasto:", error);
    response.errorMessage = "No se pudo registrar el gasto.";
    return response;
  }

  response.data = data;
  return response;
}

export async function getGastoById(id) {
  const response = { data: null, errorMessage: "" };

  const { data, error } = await supabase
    .from("gastos_operativos")
    .select(SELECT_GASTO)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error cargando gasto:", error);
    response.errorMessage = "No se pudo cargar la información del gasto.";
  } else {
    response.data = data;
  }

  return response;
}

export async function updateGasto(id, formData) {
  const response = { data: null, errorMessage: "" };
  const { refugioId, concepto, monto, fechaGasto } = formData;

  const { error } = await supabase
    .from("gastos_operativos")
    .update({
      refugio_id: refugioId,
      concepto,
      monto: parseFloat(monto),
      fecha_gasto: fechaGasto,
    })
    .eq("id", id);

  if (error) {
    console.error("Error actualizando gasto:", error);
    response.errorMessage = "No se pudo actualizar el gasto.";
    return response;
  }

  const updated = await getGastoById(id);
  if (updated.errorMessage) {
    response.errorMessage = updated.errorMessage;
    return response;
  }
  response.data = updated.data;
  return response;
}

// ── Catálogos ─────────────────────────────────────────────────────────────

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

export async function getDonantes() {
  const { data, error } = await supabase
    .from("donantes")
    .select(`
      id,
      contacto:contacto_id ( id, nombre, email )
    `);

  if (error) {
    console.error("Error obteniendo donantes:", error);
    return [];
  }
  return data || [];
}
