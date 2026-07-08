import { createClient } from "@supabase/supabase-js";
import ws from "ws";

const SUPABASE_URL = "https://snmliocnhgbskwdvzbpc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNubWxpb2NuaGdic2t3ZHZ6YnBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MTU2NzYsImV4cCI6MjA5ODQ5MTY3Nn0.WRkFpxaQf6F67sEKGj9m6AQy8M4VUwRJ8bLhaRcPcxk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transport: ws as any,
  },
});
