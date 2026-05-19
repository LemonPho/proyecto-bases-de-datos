-- Agregar columna de estatus a empleados.

CREATE TYPE empleado_estatus_enum AS ENUM (
    'activo',
    'inactivo',
    'vacaciones',
    'suspendido',
    'baja'
);

ALTER TABLE empleados
    ADD COLUMN estatus empleado_estatus_enum NOT NULL DEFAULT 'activo';
