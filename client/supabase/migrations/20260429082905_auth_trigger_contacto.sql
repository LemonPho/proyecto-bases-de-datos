-- Función para manejar la creación de un nuevo usuario en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    new_contacto_id UUID;
BEGIN
    -- Insertar el nuevo contacto usando los datos de auth.users y raw_user_meta_data
    INSERT INTO public.contactos (
        email,
        nombre,
        telefono,
        tipo_usuario
    ) VALUES (
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'nombre', 'Sin nombre'),
        NEW.raw_user_meta_data->>'telefono',
        'adoptante'
    ) RETURNING id INTO new_contacto_id;

    -- Insertar automáticamente en la tabla adoptantes
    INSERT INTO public.adoptantes (contacto_id)
    VALUES (new_contacto_id);

    RETURN NEW;
END;
$$;

-- Trigger para ejecutar la función cada que se inserta un usuario en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
