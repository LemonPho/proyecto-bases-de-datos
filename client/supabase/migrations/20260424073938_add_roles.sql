-- ROLES BASE
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'rol_visitante') THEN
        CREATE ROLE rol_visitante;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'rol_empleado') THEN
        CREATE ROLE rol_empleado;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'rol_admin') THEN
        CREATE ROLE rol_admin;
    END IF;
END;
$$;

-- PERMISOS PARA VISITANTE
-- Solo lectura de información pública

GRANT USAGE ON SCHEMA public TO rol_visitante;

GRANT SELECT ON
    animales,
    refugios,
    areas_refugio,
    razas,
    especies,
    galeria_fotos,
    eventos,
    categorias_eventos,
    campanas_adopcion
TO rol_visitante;

-- PERMISOS PARA EMPLEADO
-- Puede consultar e insertar/actualizar datos operativos

GRANT USAGE ON SCHEMA public TO rol_empleado;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO rol_empleado;

GRANT INSERT, UPDATE ON
    animales,
    galeria_fotos,
    rescates,
    solicitudes_adopcion,
    entrevistas_adopcion,
    adopciones,
    contratos_adopcion,
    seguimiento_post_adopcion,
    historial_medico,
    tratamientos,
    registro_vacunacion,
    inventario_suministros,
    compras_suministros,
    gastos_operativos,
    donaciones,
    eventos,
    campanas_adopcion,
    turnos_voluntariado
TO rol_empleado;

-- PERMISOS PARA ADMIN
-- Control total

GRANT USAGE ON SCHEMA public TO rol_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO rol_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO rol_admin;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO rol_admin;

-- USUARIOS LOGIN

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'usuario_web') THEN
        CREATE USER usuario_web WITH PASSWORD 'web123';
    ELSE
        ALTER USER usuario_web WITH PASSWORD 'web123';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'empleado1') THEN
        CREATE USER empleado1 WITH PASSWORD 'empleado123';
    ELSE
        ALTER USER empleado1 WITH PASSWORD 'empleado123';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin1') THEN
        CREATE USER admin1 WITH PASSWORD 'admin123';
    ELSE
        ALTER USER admin1 WITH PASSWORD 'admin123';
    END IF;
END;
$$;

GRANT rol_visitante TO usuario_web;
GRANT rol_empleado TO empleado1;
GRANT rol_admin TO admin1;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON TABLES TO rol_visitante;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON TABLES TO rol_empleado;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT INSERT, UPDATE ON TABLES TO rol_empleado;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO rol_admin;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON SEQUENCES TO rol_admin;