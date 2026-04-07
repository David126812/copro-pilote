import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ugobofezrtqdgskxwqvz.supabase.co";
const supabaseKey = "sb_publishable_CY7kWKiMlD64kDqQipuAaQ_ywSn0_sb";

export const supabase = createClient(supabaseUrl, supabaseKey);
