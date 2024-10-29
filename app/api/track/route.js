import { supabase } from "@/utils/supabase";
import { NextResponse } from "next/server";
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS(request) {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req) {
  const res = await req.json();
  const { domain, url, event } = res;
  if (!url.includes(domain))
    return NextResponse.json(
      {
        error:
          "The script points to a different domain than the current url. make sure thy match",
      },
      { headers: corsHeaders }
    );

  if (event === "session_start") {
    //adding new row to log a new visit with it's source
    await supabase
      .from("visits")
      .insert({ website_id: domain, source: source ?? "Direct " })
      .select();
  }

  if (event === "pageview") {
    await supabase.from("page_views").insert({ domain, url });
  }

  return NextResponse.json({ res }, { headers: corsHeaders });
}
