import { createClient } from "@supabase/supabase-js";

// Get environment variables from .env.local
const fs = require("fs");
const dotenv = require("dotenv");
const envConfig = dotenv.parse(fs.readFileSync(".env.local"));

const supabaseUrl = envConfig.VITE_SUPABASE_URL;
const supabaseAnonKey = envConfig.VITE_SUPABASE_ANON_KEY;

console.log("Testing Supabase connection with:");
console.log("URL:", supabaseUrl);
console.log(
  "Key:",
  supabaseAnonKey ? "Key exists (not showing for security)" : "No key found"
);

//10402	1745932777492	-0.27	0.37	-0.87	121.33	129.41	-171.08	walking	walking-fast
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// age?: number | null;
//           created_at?: string;
//           email: string;
//           full_name: string;
//           height?: number | null;
//           id: string;
//           weight?: number | null;

async function testConnection() {
  try {
    // Test basic connection
    // const { data: getData, error: getError } = await supabase
    //   .from("profiles")
    //   .select("*")
    //   .limit(5);
    // if (getError) {
    //   console.error("Error fetching data:", getError);
    // } else {
    //   console.log("Successfully fetched data:", getData);
    // }

    // const { data: postData, error: postError } = await supabase
    //   .from("profiles")
    //   .insert({
    //     id: "db48a5bf-7371-4fc9-82c8-e55e8fe99703",
    //     email: "hello@example.com",
    //     full_name: "hello example",
    //     age: 25,
    //     height: 175,
    //     weight: 75,
    //     created_at: new Date().toISOString(),
    //   });
    // if (postError) {
    //   console.error("Error posting data:", postError);
    // } else {
    //   console.log("Successfully posted data:", postData);
    // }

    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: "hello@example.com",
        password: "hello123",
      });
    if (loginError) {
      console.error("Error logging in:", loginError);
    } else {
      console.log("Successfully logged in:", loginData);
    }
  } catch (e) {
    console.error("Unexpected error:", e);
  }
}

testConnection();
