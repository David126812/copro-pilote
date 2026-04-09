import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ugobofezrtqdgskxwqvz.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_CY7kWKiMlD64kDqQipuAaQ_ywSn0_sb";

export const supabase = createClient(supabaseUrl, supabaseKey);
