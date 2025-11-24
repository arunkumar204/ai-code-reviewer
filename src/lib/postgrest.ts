import { createClient } from "@supabase/supabase-js";

const POSTGREST_URL = process.env.POSTGREST_URL || "";
const POSTGREST_SCHEMA = process.env.POSTGREST_SCHEMA || "public";
const POSTGREST_API_KEY = process.env.POSTGREST_API_KEY || "";

export function createPostgrestClient() {
  // Create Supabase client
  const supabase = createClient(POSTGREST_URL, POSTGREST_API_KEY, {
    db: {
      schema: POSTGREST_SCHEMA,
    },
    global: {
      fetch: (...args) => {
        let [url, options] = args;

        if (url instanceof URL || typeof url === "string") {
          const urlObj = url instanceof URL ? url : new URL(url);
          const columns = urlObj.searchParams.get("columns");

          if (columns && columns.includes('"')) {
            const fixedColumns = columns.replace(/"/g, "");
            urlObj.searchParams.set("columns", fixedColumns);
            url = urlObj.toString();
          }
        }

        return fetch(url, {
          ...options,
        } as RequestInit);
      },
    },
  });

  return supabase;
}
