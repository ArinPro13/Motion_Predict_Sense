import { z } from "zod";

// Define the schema as an object with all of the env
// variables and their types
const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_BROKER_URL: z.string().url(),
});

// Validate `import.meta.env` against our schema
// and return the result
const env = envSchema.parse(import.meta.env);

// Export the result so we can use it in the project
export default env;
