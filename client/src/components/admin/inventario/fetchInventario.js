import { supabase } from "../../../lib/supabase";


export async function get_Inventario() {
  const response = {
    data: [],
    errorMessage: "",
  };

  const { data, error } = await supabase
    .from("inventario_suministros")
    .select(`
      id,
      nombre_producto,
      cantidad_stock,
      refugio_id,
      tipo_suministro_id,
      refugios( id, nombre ),
      tipos_suministro ( id, nombre_tipo )
    `)
    .order("nombre_producto", { ascending: true });

  if (error) {
    console.error("Error cargando inventario:", error);
    response.errorMessage = "No se pudo cargar el inventario.";
  } else {
    response.data = data || [];
  }

  return response;
}

export async function createItemSuministro(formData) {
  const response = {
    data: null,
    errorMessage: "",
  };

  const {
    nombreProducto, 
    cantidadStock,
    refugioId,
    tipoSuministroId
  } = formData;

  const {data, error} = await supabase
  .from("inventario_suministros")
  .insert({
    nombre_producto : nombreProducto,
    cantidad_stock : parseInt(cantidadStock, 10),
    refugio_id : refugioId,
    tipo_suministro_id : tipoSuministroId,
  })
  .select(`
      id,
      nombre_producto,
      cantidad_stock,
      refugios (id, nombre),
      tipos_suministro (id, nombre_tipo)
    `)
  .single();

  if (error) {
    console.error("Error creando items:", error);
    response.errorMessage = "No se pudo registrar el producto en el inventario.";
    return response;
  }

  response.data = data;
  return response;
}


export async function getItemInventarioById(id) {
  const response = {data:null, errorMessage:"",};

  const {data, error} = await supabase
  .from("inventario_suministros")
  .select(`
      id,
      nombre_producto,
      cantidad_stock,
      refugio_id,
      tipo_suministro_id,
      refugios( id, nombre ),
      tipos_suministro ( id, nombre_tipo )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error cargando de item:", error);
    response.errorMessage = "No se pudo cargar la información del producto.";
  } else {
    response.data = data;
  }

  return response;
}

export async function updateItemInventario(id, formData) {
  const response = {data : null, errorMessage : ""};

  const {nombreProducto, cantidadStock, refugioId, tipoSuministroId } = formData;

  const { error } = await supabase
  .from("inventario_suministros")
  .update({
    nombre_producto : nombreProducto,
    cantidad_stock: parseInt(cantidadStock, 10),
    refugio_id: refugioId,
    tipo_suministro_id: tipoSuministroId,
  })
  .eq("id", id);

  
  if (error) {
    console.error("Error actualizando item: ", error);
    response.errorMessage = "No se pudo actualizar el producto.";
    return response;
  }

  const updateItem = await getItemInventarioById(id);

  if (updateItem.errorMessage) {
    response.errorMessage = updateItem.errorMessage;
    return response;
  }

  response.data = updateItem.data;
  return response;
}

// Función de obtención de los refugios
export async function getRefugios() {
  const { data, error } = await supabase
  .from("refugios")
  .select("id, nombre")
  .order("nombre", {ascending : true});

  if(error) {
    console.error("Error obteniendo refugios:", error);
    return [];
  }
  return data;
}

// Función de obtención de tipo de suministros
export async function getTipoSuministro() {
  const { data, error } = await supabase
  .from("tipos_suministro")
  .select("id, nombre_tipo")
  .order("nombre_tipo", { ascending : true})
  
  if(error) {
    console.error("Error obteniendo refugios:", error);
    return [];
  }
  return data;
}

// Función para añadir una nuevo tipo de suministro
export async function createTipoSuministro() {
  const { data, error } = await supabase
  .from("tipos_suministro")
  .insert({
    nombre_tipo : nombreTipo,
    descripcion : descripcion || null,
  })

  if (error) {
    console.error("Error creando tipo de suministro:", error)
    throw new Error("No se pudo crear la nueva categoría de suministro");
  }

  return data;
}