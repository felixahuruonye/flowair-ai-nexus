-- Give Felix unlimited trial (999999 credits)
UPDATE profiles 
SET credits_remaining = 999999 
WHERE user_id = '13481894-6b4b-4cb8-8f65-715ccaf85880';

-- Update default credits for new users to 10
ALTER TABLE profiles 
ALTER COLUMN credits_remaining SET DEFAULT 10;

-- Update the trigger function to set 10 credits for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, username, credits_remaining)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'username', NEW.email),
    10  -- Set default to 10 credits
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$function$;