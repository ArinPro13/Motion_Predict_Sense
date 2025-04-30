import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bcruadamezzuczadbksn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjcnVhZGFtZXp6dWN6YWRia3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzYxNTcyNSwiZXhwIjoyMDU5MTkxNzI1fQ.nQlKsuFwkOXuP3lnJTN15w6u0pK_V26ah-VnwOy5W1k';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function insertSensorData(data) {
  
  const { error } = await supabase
    .from('sensor_data')
    .insert([{ ...data }]);

  if (error) console.error('Supabase insert error:', error.message);
}
