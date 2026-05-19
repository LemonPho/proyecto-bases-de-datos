-- Cambiar la columna nombre_especie de enum a VARCHAR(50) para permitir
-- nombres de especie arbitrarios en lugar de un conjunto cerrado.

ALTER TABLE especies
    ALTER COLUMN nombre_especie TYPE VARCHAR(50)
    USING nombre_especie::text;

-- El enum ya no se usa en ninguna otra tabla, se puede eliminar.
DROP TYPE IF EXISTS especie_nombre_enum;
