-- PostgreSQL schema for animal shelter database

-- ENUM TYPES

CREATE TYPE animal_estado_enum AS ENUM (
    'sano',
    'enfermo',
    'en_tratamiento',
    'recuperacion',
    'adoptado',
    'resguardado',
    'fallecido'
);

CREATE TYPE donacion_tipo_enum AS ENUM (
    'monetaria',
    'especie',
    'servicio'
);

CREATE TYPE solicitud_estatus_enum AS ENUM (
    'pendiente',
    'en_revision',
    'aprobada',
    'rechazada',
    'cancelada'
);

CREATE TYPE especie_nombre_enum AS ENUM (
    'perro',
    'gato',
    'ave',
    'reptil',
    'roedor',
    'otro'
);

CREATE TYPE vacuna_tipo_enum AS ENUM (
    'preventiva',
    'refuerzo',
    'tratamiento',
    'otra'
);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- BASE TABLES

CREATE TABLE direcciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calle VARCHAR(50) NOT NULL,
    no_ext VARCHAR(10) NOT NULL,
    no_int VARCHAR(10),
    colonia VARCHAR(50) NOT NULL,
    ciudad VARCHAR(50) NOT NULL,
    estado VARCHAR(30) NOT NULL,
    pais VARCHAR(30) NOT NULL
);

CREATE TABLE contactos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    direccion_id UUID,
    telefono VARCHAR(10),
    email VARCHAR(100),
    nombre VARCHAR(50) NOT NULL,
    tipo_usuario VARCHAR(20) NOT NULL,
    CONSTRAINT fk_contactos_direccion
        FOREIGN KEY (direccion_id) REFERENCES direcciones(id)
);

CREATE TABLE cargos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_cargo VARCHAR(50) NOT NULL,
    descripcion TEXT
);

CREATE TABLE categorias_eventos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_categoria VARCHAR(50) NOT NULL
);

CREATE TABLE especies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_especie especie_nombre_enum NOT NULL
);

CREATE TABLE habilidades_voluntariado (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habilidad VARCHAR(30) NOT NULL,
    descripcion TEXT
);

CREATE TABLE tipos_suministro (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_tipo VARCHAR(50) NOT NULL,
    descripcion TEXT
);

CREATE TABLE vacunas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_vacuna VARCHAR(100) NOT NULL,
    observaciones TEXT,
    tipo vacuna_tipo_enum NOT NULL,
    dosis_requeridas INTEGER NOT NULL,
    intervalo_dosis VARCHAR(20) NOT NULL,
    es_obligatoria BOOLEAN NOT NULL,
    fabricante VARCHAR(100)
);

-- =========================================================
-- REFUGIOS Y ESTRUCTURA
-- =========================================================

CREATE TABLE refugios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(50) NOT NULL,
    contacto_id UUID NOT NULL,
    CONSTRAINT fk_refugios_contacto
        FOREIGN KEY (contacto_id) REFERENCES contactos(id)
);

CREATE TABLE areas_refugio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    refugio_id UUID NOT NULL,
    nombre_area VARCHAR(50) NOT NULL,
    capacidad_maxima INTEGER NOT NULL,
    CONSTRAINT fk_areas_refugio_refugio
        FOREIGN KEY (refugio_id) REFERENCES refugios(id)
);

-- =========================================================
-- PERSONAS / ROLES
-- =========================================================

CREATE TABLE adoptantes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contacto_id UUID NOT NULL,
    CONSTRAINT fk_adoptantes_contacto
        FOREIGN KEY (contacto_id) REFERENCES contactos(id)
);

CREATE TABLE donantes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contacto_id UUID NOT NULL,
    CONSTRAINT fk_donantes_contacto
        FOREIGN KEY (contacto_id) REFERENCES contactos(id)
);

CREATE TABLE rescatistas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contacto_id UUID NOT NULL,
    CONSTRAINT fk_rescatistas_contacto
        FOREIGN KEY (contacto_id) REFERENCES contactos(id)
);

CREATE TABLE empleados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    refugio_id UUID NOT NULL,
    cargo_id UUID NOT NULL,
    contacto_id UUID NOT NULL,
    CONSTRAINT fk_empleados_refugio
        FOREIGN KEY (refugio_id) REFERENCES refugios(id),
    CONSTRAINT fk_empleados_cargo
        FOREIGN KEY (cargo_id) REFERENCES cargos(id),
    CONSTRAINT fk_empleados_contacto
        FOREIGN KEY (contacto_id) REFERENCES contactos(id)
);

CREATE TABLE voluntarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habilidades_id UUID,
    contacto_id UUID NOT NULL,
    CONSTRAINT fk_voluntarios_habilidad
        FOREIGN KEY (habilidades_id) REFERENCES habilidades_voluntariado(id),
    CONSTRAINT fk_voluntarios_contacto
        FOREIGN KEY (contacto_id) REFERENCES contactos(id)
);

-- This table appears redundant in your model, but included as requested
CREATE TABLE donantes_contactos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contacto_id UUID NOT NULL,
    donante_id UUID NOT NULL,
    CONSTRAINT fk_donantes_contactos_contacto
        FOREIGN KEY (contacto_id) REFERENCES contactos(id),
    CONSTRAINT fk_donantes_contactos_donante
        FOREIGN KEY (donante_id) REFERENCES donantes(id)
);

-- =========================================================
-- ANIMALES
-- =========================================================

CREATE TABLE razas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    especie_id UUID NOT NULL,
    nombre_raza VARCHAR(50) NOT NULL,
    CONSTRAINT fk_razas_especie
        FOREIGN KEY (especie_id) REFERENCES especies(id)
);

CREATE TABLE animales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    area_id UUID NOT NULL,
    raza_id UUID NOT NULL,
    nombre VARCHAR(50),
    estado animal_estado_enum NOT NULL,
    fecha_ingreso DATE NOT NULL,
    CONSTRAINT fk_animales_area
        FOREIGN KEY (area_id) REFERENCES areas_refugio(id),
    CONSTRAINT fk_animales_raza
        FOREIGN KEY (raza_id) REFERENCES razas(id)
);

CREATE TABLE galeria_fotos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_id UUID NOT NULL,
    url_foto VARCHAR(200) NOT NULL,
    CONSTRAINT fk_galeria_fotos_animal
        FOREIGN KEY (animal_id) REFERENCES animales(id)
);

-- =========================================================
-- RESCATES
-- =========================================================

CREATE TABLE rescates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_id UUID NOT NULL,
    rescatista_id UUID NOT NULL,
    fecha_rescate DATE,
    lugar_rescate TEXT,
    CONSTRAINT fk_rescates_animal
        FOREIGN KEY (animal_id) REFERENCES animales(id),
    CONSTRAINT fk_rescates_rescatista
        FOREIGN KEY (rescatista_id) REFERENCES rescatistas(id)
);

-- =========================================================
-- ADOPCIONES
-- =========================================================

CREATE TABLE solicitudes_adopcion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_id UUID NOT NULL,
    adoptante_id UUID NOT NULL,
    fecha_solicitud DATE NOT NULL,
    estatus solicitud_estatus_enum NOT NULL,
    CONSTRAINT fk_solicitudes_adopcion_animal
        FOREIGN KEY (animal_id) REFERENCES animales(id),
    CONSTRAINT fk_solicitudes_adopcion_adoptante
        FOREIGN KEY (adoptante_id) REFERENCES adoptantes(id)
);

CREATE TABLE entrevistas_adopcion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitud_id UUID NOT NULL,
    empleado_id UUID NOT NULL,
    fecha_entrevista DATE NOT NULL,
    observaciones TEXT,
    CONSTRAINT fk_entrevistas_solicitud
        FOREIGN KEY (solicitud_id) REFERENCES solicitudes_adopcion(id),
    CONSTRAINT fk_entrevistas_empleado
        FOREIGN KEY (empleado_id) REFERENCES empleados(id)
);

CREATE TABLE adopciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitud_id UUID NOT NULL,
    fecha_adopcion DATE NOT NULL,
    contrato_firmado BOOLEAN NOT NULL,
    CONSTRAINT fk_adopciones_solicitud
        FOREIGN KEY (solicitud_id) REFERENCES solicitudes_adopcion(id),
    CONSTRAINT uq_adopciones_solicitud UNIQUE (solicitud_id)
);

CREATE TABLE contratos_adopcion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adopcion_id UUID NOT NULL,
    fecha_firma DATE NOT NULL,
    url_documento VARCHAR(200),
    CONSTRAINT fk_contratos_adopcion_adopcion
        FOREIGN KEY (adopcion_id) REFERENCES adopciones(id),
    CONSTRAINT uq_contratos_adopcion_adopcion UNIQUE (adopcion_id)
);

CREATE TABLE seguimiento_post_adopcion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adopcion_id UUID NOT NULL,
    empleado_id UUID NOT NULL,
    fecha_visita DATE NOT NULL,
    comentarios_bienestar TEXT,
    CONSTRAINT fk_seguimiento_adopcion
        FOREIGN KEY (adopcion_id) REFERENCES adopciones(id),
    CONSTRAINT fk_seguimiento_empleado
        FOREIGN KEY (empleado_id) REFERENCES empleados(id)
);

-- =========================================================
-- SALUD / HISTORIAL MÉDICO
-- =========================================================

CREATE TABLE historial_medico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_id UUID NOT NULL,
    empleado_id UUID NOT NULL,
    fecha_consulta TIMESTAMP NOT NULL,
    diagnostico TEXT NOT NULL,
    CONSTRAINT fk_historial_medico_animal
        FOREIGN KEY (animal_id) REFERENCES animales(id),
    CONSTRAINT fk_historial_medico_empleado
        FOREIGN KEY (empleado_id) REFERENCES empleados(id)
);

CREATE TABLE tratamientos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    historial_id UUID NOT NULL,
    medicamento TEXT NOT NULL,
    instrucciones_medicas TEXT,
    CONSTRAINT fk_tratamientos_historial
        FOREIGN KEY (historial_id) REFERENCES historial_medico(id)
);

CREATE TABLE registro_vacunacion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    historial_id UUID NOT NULL,
    vacuna_id UUID NOT NULL,
    numero_dosis INTEGER NOT NULL,
    fecha_aplicacion DATE NOT NULL,
    CONSTRAINT fk_registro_vacunacion_historial
        FOREIGN KEY (historial_id) REFERENCES historial_medico(id),
    CONSTRAINT fk_registro_vacunacion_vacuna
        FOREIGN KEY (vacuna_id) REFERENCES vacunas(id)
);

-- =========================================================
-- DONACIONES, SUMINISTROS, GASTOS
-- =========================================================

CREATE TABLE proveedores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_suministro_id UUID NOT NULL,
    contacto_id UUID NOT NULL,
    CONSTRAINT fk_proveedores_tipo_suministro
        FOREIGN KEY (tipo_suministro_id) REFERENCES tipos_suministro(id),
    CONSTRAINT fk_proveedores_contacto
        FOREIGN KEY (contacto_id) REFERENCES contactos(id)
);

CREATE TABLE inventario_suministros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    refugio_id UUID NOT NULL,
    nombre_producto VARCHAR(50) NOT NULL,
    tipo_suministro_id UUID NOT NULL,
    cantidad_stock INTEGER,
    CONSTRAINT fk_inventario_refugio
        FOREIGN KEY (refugio_id) REFERENCES refugios(id),
    CONSTRAINT fk_inventario_tipo_suministro
        FOREIGN KEY (tipo_suministro_id) REFERENCES tipos_suministro(id)
);

CREATE TABLE compras_suministros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proveedor_id UUID NOT NULL,
    CONSTRAINT fk_compras_suministros_proveedor
        FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
);

CREATE TABLE gastos_operativos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    refugio_id UUID NOT NULL,
    compra_suministro_id UUID,
    concepto TEXT NOT NULL,
    monto NUMERIC NOT NULL,
    fecha_gasto DATE NOT NULL,
    CONSTRAINT fk_gastos_refugio
        FOREIGN KEY (refugio_id) REFERENCES refugios(id),
    CONSTRAINT fk_gastos_compra_suministro
        FOREIGN KEY (compra_suministro_id) REFERENCES compras_suministros(id)
);

CREATE TABLE donaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donante_id UUID NOT NULL,
    refugio_id UUID NOT NULL,
    monto_o_valor NUMERIC,
    tipo_donacion donacion_tipo_enum NOT NULL,
    detalle TEXT,
    CONSTRAINT fk_donaciones_donante
        FOREIGN KEY (donante_id) REFERENCES donantes(id),
    CONSTRAINT fk_donaciones_refugio
        FOREIGN KEY (refugio_id) REFERENCES refugios(id)
);

-- =========================================================
-- EVENTOS Y CAMPAnAS
-- =========================================================

CREATE TABLE eventos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    refugio_id UUID NOT NULL,
    categoria_id UUID NOT NULL,
    nombre_evento VARCHAR(50) NOT NULL,
    fecha_evento TIMESTAMP NOT NULL,
    descripcion TEXT,
    CONSTRAINT fk_eventos_refugio
        FOREIGN KEY (refugio_id) REFERENCES refugios(id),
    CONSTRAINT fk_eventos_categoria
        FOREIGN KEY (categoria_id) REFERENCES categorias_eventos(id)
);

CREATE TABLE campanas_adopcion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    refugio_id UUID NOT NULL,
    nombre_campana VARCHAR(100) NOT NULL,
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP,
    CONSTRAINT fk_campanas_adopcion_refugio
        FOREIGN KEY (refugio_id) REFERENCES refugios(id)
);

-- =========================================================
-- RRHH / TURNOS / SUELDOS
-- =========================================================

CREATE TABLE sueldos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empleado_id UUID NOT NULL,
    sueldo NUMERIC NOT NULL,
    CONSTRAINT fk_sueldos_empleado
        FOREIGN KEY (empleado_id) REFERENCES empleados(id)
);

CREATE TABLE turnos_voluntariado (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voluntario_id UUID NOT NULL,
    refugio_id UUID NOT NULL,
    inicio_turno TIMESTAMP NOT NULL,
    fin_turno TIMESTAMP NOT NULL,
    CONSTRAINT fk_turnos_voluntario
        FOREIGN KEY (voluntario_id) REFERENCES voluntarios(id),
    CONSTRAINT fk_turnos_refugio
        FOREIGN KEY (refugio_id) REFERENCES refugios(id),
    CONSTRAINT chk_turnos_fechas CHECK (fin_turno > inicio_turno)
);

-- =========================================================
-- OPTIONAL INDEXES FOR FKs
-- =========================================================

CREATE INDEX idx_contactos_direccion_id ON contactos(direccion_id);

CREATE INDEX idx_refugios_contacto_id ON refugios(contacto_id);
CREATE INDEX idx_areas_refugio_refugio_id ON areas_refugio(refugio_id);

CREATE INDEX idx_adoptantes_contacto_id ON adoptantes(contacto_id);
CREATE INDEX idx_donantes_contacto_id ON donantes(contacto_id);
CREATE INDEX idx_rescatistas_contacto_id ON rescatistas(contacto_id);
CREATE INDEX idx_empleados_refugio_id ON empleados(refugio_id);
CREATE INDEX idx_empleados_cargo_id ON empleados(cargo_id);
CREATE INDEX idx_empleados_contacto_id ON empleados(contacto_id);
CREATE INDEX idx_voluntarios_habilidades_id ON voluntarios(habilidades_id);
CREATE INDEX idx_voluntarios_contacto_id ON voluntarios(contacto_id);

CREATE INDEX idx_donantes_contactos_contacto_id ON donantes_contactos(contacto_id);
CREATE INDEX idx_donantes_contactos_donante_id ON donantes_contactos(donante_id);

CREATE INDEX idx_razas_especie_id ON razas(especie_id);
CREATE INDEX idx_animales_area_id ON animales(area_id);
CREATE INDEX idx_animales_raza_id ON animales(raza_id);
CREATE INDEX idx_galeria_fotos_animal_id ON galeria_fotos(animal_id);

CREATE INDEX idx_rescates_animal_id ON rescates(animal_id);
CREATE INDEX idx_rescates_rescatista_id ON rescates(rescatista_id);

CREATE INDEX idx_solicitudes_adopcion_animal_id ON solicitudes_adopcion(animal_id);
CREATE INDEX idx_solicitudes_adopcion_adoptante_id ON solicitudes_adopcion(adoptante_id);
CREATE INDEX idx_entrevistas_adopcion_solicitud_id ON entrevistas_adopcion(solicitud_id);
CREATE INDEX idx_entrevistas_adopcion_empleado_id ON entrevistas_adopcion(empleado_id);
CREATE INDEX idx_seguimiento_post_adopcion_adopcion_id ON seguimiento_post_adopcion(adopcion_id);
CREATE INDEX idx_seguimiento_post_adopcion_empleado_id ON seguimiento_post_adopcion(empleado_id);

CREATE INDEX idx_historial_medico_animal_id ON historial_medico(animal_id);
CREATE INDEX idx_historial_medico_empleado_id ON historial_medico(empleado_id);
CREATE INDEX idx_tratamientos_historial_id ON tratamientos(historial_id);
CREATE INDEX idx_registro_vacunacion_historial_id ON registro_vacunacion(historial_id);
CREATE INDEX idx_registro_vacunacion_vacuna_id ON registro_vacunacion(vacuna_id);

CREATE INDEX idx_proveedores_tipo_suministro_id ON proveedores(tipo_suministro_id);
CREATE INDEX idx_proveedores_contacto_id ON proveedores(contacto_id);
CREATE INDEX idx_inventario_suministros_refugio_id ON inventario_suministros(refugio_id);
CREATE INDEX idx_inventario_suministros_tipo_suministro_id ON inventario_suministros(tipo_suministro_id);
CREATE INDEX idx_compras_suministros_proveedor_id ON compras_suministros(proveedor_id);
CREATE INDEX idx_gastos_operativos_refugio_id ON gastos_operativos(refugio_id);
CREATE INDEX idx_gastos_operativos_compra_suministro_id ON gastos_operativos(compra_suministro_id);
CREATE INDEX idx_donaciones_donante_id ON donaciones(donante_id);
CREATE INDEX idx_donaciones_refugio_id ON donaciones(refugio_id);

CREATE INDEX idx_eventos_refugio_id ON eventos(refugio_id);
CREATE INDEX idx_eventos_categoria_id ON eventos(categoria_id);
CREATE INDEX idx_campanas_adopcion_refugio_id ON campanas_adopcion(refugio_id);

CREATE INDEX idx_sueldos_empleado_id ON sueldos(empleado_id);
CREATE INDEX idx_turnos_voluntariado_voluntario_id ON turnos_voluntariado(voluntario_id);
CREATE INDEX idx_turnos_voluntariado_refugio_id ON turnos_voluntariado(refugio_id);