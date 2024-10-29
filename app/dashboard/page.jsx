"use client";

import Header from "@/components/Header";
import useUser from "@/hooks/useUser";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const { currentUser: user } = useUser();
  const [websites, setWebsites] = useState([]);

  useEffect(() => {
    if (!user) return;
    if (user === "no user") redirect("/sign-in");
  }, [user]);

  const fetchWebsites = async () => {
    const { data, error } = await supabase
      .from("websites")
      .select()
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (data) setWebsites(data);

    if (error) console.error(error);
  };

  useEffect(() => {
    if (!user || !supabase) return;
    fetchWebsites();
  }, [user, supabase]);

  return (
    <div className="bg-black min-h-screen flex flex-col   relative w-full">
      <Header />
      <div className="w-full flex flex-col  items-start justify-end">
        <div
          className="w-full items-center justify-end flex p-6
       border-b border-white/5 z-40"
        >
          <Link href={"/add"} prefetch>
            <button className="button">Add website</button>
          </Link>
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4
       w-full p-6 gap-10 z-40 "
        >
          {websites.map((site, i) => (
            <Link key={site.id} href={`/analytics/${site.name}`}>
              <div
                className="border border-white/5 rounded-md py-12 px-6
             text-white bg-black w-full cursor-pointer smooth
              hover:border-white/20 hover:bg-[#050505]"
              >
                <h2>{site?.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
