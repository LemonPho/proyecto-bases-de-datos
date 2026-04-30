BEGIN;

-- =========================================================
-- 1) TABLAS NORMALISTAS / CATÁLOGO (10 CADA UNA)
-- =========================================================

-- direcciones (10)
INSERT INTO direcciones (calle, no_ext, no_int, colonia, ciudad, estado, pais)
SELECT
    'Calle ' || gs,
    (100 + gs)::text,
    CASE WHEN gs % 3 = 0 THEN gs::text ELSE NULL END,
    'Colonia ' || gs,
    CASE
        WHEN gs <= 4 THEN 'Guadalajara'
        WHEN gs <= 7 THEN 'Zapopan'
        ELSE 'Tlaquepaque'
    END,
    'Jalisco',
    'México'
FROM generate_series(1, 10) AS gs;

-- contactos (10)
INSERT INTO contactos (direccion_id, telefono, email, nombre, tipo_usuario)
SELECT
    d.id,
    LPAD((3310000000 + rn)::text, 10, '0'),
    (ARRAY['juan.perez', 'maria.g', 'carlos_l', 'ana.m', 'luis.rodriguez', 'laura_h', 'pedro.gomez', 'sofia.d', 'jorge_morales', 'marta.r'])[rn % 10 + 1] || '@correo.com',
    (ARRAY['Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez', 'Luis Rodríguez', 'Laura Hernández', 'Pedro Gómez', 'Sofía Díaz', 'Jorge Morales', 'Marta Romero'])[rn % 10 + 1],
    CASE
        WHEN rn <= 2 THEN 'refugio'
        WHEN rn <= 4 THEN 'empleado'
        WHEN rn <= 6 THEN 'adoptante'
        WHEN rn <= 8 THEN 'donante'
        ELSE 'rescatista'
    END
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn
    FROM direcciones
    LIMIT 10
) d;

-- cargos (10)
INSERT INTO cargos (nombre_cargo, descripcion)
SELECT
    (ARRAY['Veterinario', 'Asistente', 'Recepcionista', 'Limpieza', 'Entrenador', 'Cuidador', 'Administrador', 'Coordinador', 'Adopciones', 'Marketing'])[gs % 10 + 1],
    'Descripción detallada del puesto dentro del refugio'
FROM generate_series(1, 10) AS gs;

-- categorias_eventos (10)
INSERT INTO categorias_eventos (nombre_categoria)
SELECT (ARRAY['Recaudación', 'Campaña Adopción', 'Vacunación', 'Educación', 'Voluntariado', 'Socialización', 'Día Abierto', 'Entrenamiento', 'Aniversario', 'Caminata'])[gs % 10 + 1]
FROM generate_series(1, 10) AS gs;

-- especies (10) -> repetimos valores del ENUM porque solo tiene 6
INSERT INTO especies (nombre_especie)
SELECT val
FROM (
    VALUES
        ('perro'::especie_nombre_enum),
        ('gato'::especie_nombre_enum),
        ('ave'::especie_nombre_enum),
        ('reptil'::especie_nombre_enum),
        ('roedor'::especie_nombre_enum),
        ('otro'::especie_nombre_enum),
        ('perro'::especie_nombre_enum),
        ('gato'::especie_nombre_enum),
        ('ave'::especie_nombre_enum),
        ('otro'::especie_nombre_enum)
) AS t(val);

-- habilidades_voluntariado (10)
INSERT INTO habilidades_voluntariado (habilidad, descripcion)
SELECT
    'Habilidad ' || gs,
    'Descripción de habilidad ' || gs
FROM generate_series(1, 10) AS gs;

-- tipos_suministro (10)
INSERT INTO tipos_suministro (nombre_tipo, descripcion)
SELECT
    'Tipo suministro ' || gs,
    'Descripción de tipo suministro ' || gs
FROM generate_series(1, 10) AS gs;

-- vacunas (10)
INSERT INTO vacunas (
    nombre_vacuna, observaciones, tipo, dosis_requeridas,
    intervalo_dosis, es_obligatoria, fabricante
)
SELECT
    'Vacuna ' || gs,
    'Observaciones vacuna ' || gs,
    CASE (gs % 4)
        WHEN 0 THEN 'preventiva'::vacuna_tipo_enum
        WHEN 1 THEN 'refuerzo'::vacuna_tipo_enum
        WHEN 2 THEN 'tratamiento'::vacuna_tipo_enum
        ELSE 'otra'::vacuna_tipo_enum
    END,
    1 + (gs % 3),
    CASE
        WHEN gs % 3 = 0 THEN '30 días'
        WHEN gs % 3 = 1 THEN '6 meses'
        ELSE '1 año'
    END,
    (gs % 2 = 0),
    'Fabricante ' || gs
FROM generate_series(1, 10) AS gs;

-- refugios (10)
INSERT INTO refugios (nombre, contacto_id)
SELECT
    (ARRAY['Patitas Felices', 'Hogar Toby', 'Esperanza', 'Amigos Caninos', 'San Francisco', 'Huellitas', 'Casa del Gato', 'Santuario Animal', 'Nueva Vida', 'Protectores'])[rn % 10 + 1],
    id
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn
    FROM contactos
    LIMIT 10
) c;

-- areas_refugio (10)
INSERT INTO areas_refugio (refugio_id, nombre_area, capacidad_maxima)
SELECT
    r.id,
    'Área ' || rn,
    10 + rn * 2
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn
    FROM refugios
    LIMIT 10
) r;

-- adoptantes (10)
INSERT INTO adoptantes (contacto_id)
SELECT id
FROM contactos
ORDER BY id
LIMIT 10;

-- donantes (10)
INSERT INTO donantes (contacto_id)
SELECT id
FROM contactos
ORDER BY id
LIMIT 10;

-- rescatistas (10)
INSERT INTO rescatistas (contacto_id)
SELECT id
FROM contactos
ORDER BY id
LIMIT 10;

-- empleados (10)
INSERT INTO empleados (refugio_id, cargo_id, contacto_id)
SELECT
    (SELECT id FROM refugios ORDER BY random() LIMIT 1),
    (SELECT id FROM cargos ORDER BY random() LIMIT 1),
    c.id
FROM (
    SELECT id
    FROM contactos
    ORDER BY id
    LIMIT 10
) c;

-- voluntarios (10)
INSERT INTO voluntarios (habilidades_id, contacto_id)
SELECT
    (SELECT id FROM habilidades_voluntariado ORDER BY random() LIMIT 1),
    c.id
FROM (
    SELECT id
    FROM contactos
    ORDER BY id
    LIMIT 10
) c;

-- donantes_contactos (10)
INSERT INTO donantes_contactos (contacto_id, donante_id)
SELECT
    c.id,
    d.id
FROM
    (SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn FROM contactos LIMIT 10) c
JOIN
    (SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn FROM donantes LIMIT 10) d
ON c.rn = d.rn;

-- razas (10)
INSERT INTO razas (especie_id, nombre_raza)
SELECT
    (SELECT id FROM especies ORDER BY random() LIMIT 1),
    (ARRAY['Mestizo', 'Labrador Retriever', 'Pastor Alemán', 'Golden', 'Bulldog', 'Poodle', 'Beagle', 'Siamés', 'Persa', 'Angora'])[gs % 10 + 1]
FROM generate_series(1, 10) AS gs;

-- proveedores (10)
INSERT INTO proveedores (tipo_suministro_id, contacto_id)
SELECT
    (SELECT id FROM tipos_suministro ORDER BY random() LIMIT 1),
    c.id
FROM (
    SELECT id
    FROM contactos
    ORDER BY id
    LIMIT 10
) c;

-- =========================================================
-- 2) TABLAS TRANSACCIONALES (50 CADA UNA)
-- =========================================================

-- animales (50)
INSERT INTO animales (area_id, raza_id, nombre, estado, fecha_ingreso)
SELECT
    (SELECT id FROM areas_refugio ORDER BY random() LIMIT 1),
    (SELECT id FROM razas ORDER BY random() LIMIT 1),
    (ARRAY['Max', 'Luna', 'Bella', 'Charlie', 'Milo', 'Lucy', 'Bailey', 'Cooper', 'Daisy', 'Sadie', 'Rocky', 'Buddy', 'Stella', 'Tucker', 'Bear', 'Zoey', 'Duke', 'Penny', 'Chloe', 'Oliver'])[gs % 20 + 1],
    CASE (gs % 7)
        WHEN 0 THEN 'sano'::animal_estado_enum
        WHEN 1 THEN 'enfermo'::animal_estado_enum
        WHEN 2 THEN 'en_tratamiento'::animal_estado_enum
        WHEN 3 THEN 'recuperacion'::animal_estado_enum
        WHEN 4 THEN 'adoptado'::animal_estado_enum
        WHEN 5 THEN 'resguardado'::animal_estado_enum
        ELSE 'fallecido'::animal_estado_enum
    END,
    CURRENT_DATE - (gs || ' days')::interval
FROM generate_series(1, 50) AS gs;

-- galeria_fotos (50)
INSERT INTO galeria_fotos (animal_id, url_foto)
SELECT
    a.id,
    'https://ejemplo.com/fotos/animal_' || rn || '.jpg'
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn
    FROM animales
    LIMIT 50
) a;

-- rescates (50)
INSERT INTO rescates (animal_id, rescatista_id, fecha_rescate, lugar_rescate)
SELECT
    a.id,
    (SELECT id FROM rescatistas ORDER BY random() LIMIT 1),
    CURRENT_DATE - ((rn + 10) || ' days')::interval,
    'Lugar de rescate ' || rn
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn
    FROM animales
    LIMIT 50
) a;

-- solicitudes_adopcion (50)
INSERT INTO solicitudes_adopcion (animal_id, adoptante_id, fecha_solicitud, estatus)
SELECT
    a.id,
    (SELECT id FROM adoptantes ORDER BY random() LIMIT 1),
    CURRENT_DATE - ((rn + 5) || ' days')::interval,
    CASE (rn % 5)
        WHEN 0 THEN 'pendiente'::solicitud_estatus_enum
        WHEN 1 THEN 'en_revision'::solicitud_estatus_enum
        WHEN 2 THEN 'aprobada'::solicitud_estatus_enum
        WHEN 3 THEN 'rechazada'::solicitud_estatus_enum
        ELSE 'cancelada'::solicitud_estatus_enum
    END
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn
    FROM animales
    LIMIT 50
) a;

-- entrevistas_adopcion (50)
INSERT INTO entrevistas_adopcion (solicitud_id, empleado_id, fecha_entrevista, observaciones)
SELECT
    s.id,
    (SELECT id FROM empleados ORDER BY random() LIMIT 1),
    CURRENT_DATE - ((rn + 2) || ' days')::interval,
    'Observaciones entrevista ' || rn
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn
    FROM solicitudes_adopcion
    LIMIT 50
) s;

-- adopciones (50)
INSERT INTO adopciones (solicitud_id, fecha_adopcion, contrato_firmado)
SELECT
    s.id,
    CURRENT_DATE - ((rn % 20) || ' days')::interval,
    (rn % 2 = 0)
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn
    FROM solicitudes_adopcion
    LIMIT 50
) s;

-- contratos_adopcion (50)
INSERT INTO contratos_adopcion (adopcion_id, fecha_firma, url_documento)
SELECT
    a.id,
    CURRENT_DATE - ((rn % 15) || ' days')::interval,
    'https://ejemplo.com/contratos/contrato_' || rn || '.pdf'
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn
    FROM adopciones
    LIMIT 50
) a;

-- seguimiento_post_adopcion (50)
INSERT INTO seguimiento_post_adopcion (adopcion_id, empleado_id, fecha_visita, comentarios_bienestar)
SELECT
    a.id,
    (SELECT id FROM empleados ORDER BY random() LIMIT 1),
    CURRENT_DATE - ((rn % 10) || ' days')::interval,
    'Seguimiento post adopción ' || rn
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn
    FROM adopciones
    LIMIT 50
) a;

-- historial_medico (50)
INSERT INTO historial_medico (animal_id, empleado_id, fecha_consulta, diagnostico)
SELECT
    a.id,
    (SELECT id FROM empleados ORDER BY random() LIMIT 1),
    NOW() - ((rn * 2) || ' days')::interval,
    'Diagnóstico médico ' || rn
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn
    FROM animales
    LIMIT 50
) a;

-- tratamientos (50)
INSERT INTO tratamientos (historial_id, medicamento, instrucciones_medicas)
SELECT
    h.id,
    'Medicamento ' || rn,
    'Instrucciones médicas ' || rn
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn
    FROM historial_medico
    LIMIT 50
) h;

-- registro_vacunacion (50)
INSERT INTO registro_vacunacion (historial_id, vacuna_id, numero_dosis, fecha_aplicacion)
SELECT
    h.id,
    (SELECT id FROM vacunas ORDER BY random() LIMIT 1),
    1 + (rn % 3),
    CURRENT_DATE - ((rn % 40) || ' days')::interval
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn
    FROM historial_medico
    LIMIT 50
) h;

-- inventario_suministros (50)
INSERT INTO inventario_suministros (refugio_id, nombre_producto, tipo_suministro_id, cantidad_stock)
SELECT
    (SELECT id FROM refugios ORDER BY random() LIMIT 1),
    'Producto ' || gs,
    (SELECT id FROM tipos_suministro ORDER BY random() LIMIT 1),
    5 + (gs % 25)
FROM generate_series(1, 50) AS gs;

-- compras_suministros (50)
INSERT INTO compras_suministros (proveedor_id)
SELECT
    (SELECT id FROM proveedores ORDER BY random() LIMIT 1)
FROM generate_series(1, 50);

-- gastos_operativos (50)
INSERT INTO gastos_operativos (refugio_id, compra_suministro_id, concepto, monto, fecha_gasto)
SELECT
    (SELECT id FROM refugios ORDER BY random() LIMIT 1),
    c.id,
    'Gasto operativo ' || rn,
    ROUND((100 + random() * 5000)::numeric, 2),
    CURRENT_DATE - ((rn % 30) || ' days')::interval
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn
    FROM compras_suministros
    LIMIT 50
) c;

-- donaciones (50)
INSERT INTO donaciones (donante_id, refugio_id, monto_o_valor, tipo_donacion, detalle)
SELECT
    (SELECT id FROM donantes ORDER BY random() LIMIT 1),
    (SELECT id FROM refugios ORDER BY random() LIMIT 1),
    ROUND((100 + random() * 10000)::numeric, 2),
    CASE (gs % 3)
        WHEN 0 THEN 'monetaria'::donacion_tipo_enum
        WHEN 1 THEN 'especie'::donacion_tipo_enum
        ELSE 'servicio'::donacion_tipo_enum
    END,
    'Detalle de donación ' || gs
FROM generate_series(1, 50) AS gs;

-- eventos (50)
INSERT INTO eventos (refugio_id, categoria_id, nombre_evento, fecha_evento, descripcion)
SELECT
    (SELECT id FROM refugios ORDER BY random() LIMIT 1),
    (SELECT id FROM categorias_eventos ORDER BY random() LIMIT 1),
    'Evento ' || gs,
    NOW() + ((gs % 20) || ' days')::interval,
    'Descripción del evento ' || gs
FROM generate_series(1, 50) AS gs;

-- campanas_adopcion (50)
INSERT INTO campanas_adopcion (refugio_id, nombre_campana, fecha_inicio, fecha_fin)
SELECT
    (SELECT id FROM refugios ORDER BY random() LIMIT 1),
    'Campana ' || gs,
    NOW() - ((gs % 15) || ' days')::interval,
    NOW() + ((gs % 15 + 5) || ' days')::interval
FROM generate_series(1, 50) AS gs;

-- sueldos (50)
INSERT INTO sueldos (empleado_id, sueldo)
SELECT
    (SELECT id FROM empleados ORDER BY random() LIMIT 1),
    ROUND((8000 + random() * 12000)::numeric, 2)
FROM generate_series(1, 50);

-- turnos_voluntariado (50)
INSERT INTO turnos_voluntariado (voluntario_id, refugio_id, inicio_turno, fin_turno)
SELECT
    (SELECT id FROM voluntarios ORDER BY random() LIMIT 1),
    (SELECT id FROM refugios ORDER BY random() LIMIT 1),
    NOW() + ((gs % 10) || ' days')::interval,
    NOW() + ((gs % 10) || ' days')::interval + interval '4 hours'
FROM generate_series(1, 50) AS gs;

COMMIT;