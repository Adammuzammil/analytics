"use client";

import useUser from "@/hooks/useUser";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Add = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [site, setSite] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser: user } = useUser();

  const addWebsite = async () => {
    if (site.trim() === "" || loading) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("websites")
      .insert({ name: site.trim(), user_id: user.id })
      .select();
    setLoading(false);
    setStep(2);
  };

  const checkDomainAvailability = async () => {
    if (site.trim() === "" || loading) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("websites")
      .select("name")
      .eq("name", site.trim());

    if (error) {
      console.error("Error checking domain availability:", error);
      setError("An error occurred. Please try again.");
      setLoading(false);
      return;
    }

    if (data.length > 0) {
      // If the site already exists
      setError("Domain has already been added.");
    } else {
      setError("");
      addWebsite();
    }

    setLoading(false);
  };

  useEffect(() => {
    const invalidPattern = /[:/]/;
    if (site.trim().match(invalidPattern)) {
      setError("Please enter the domain only, e.g: google.com");
    } else {
      setError("");
    }
  }, [site]);

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center flex-col">
      <div className="flex items-center flex-col justify-center p-12 w-full z-0 border-y border-white/5 bg-black text-white">
        {step === 1 ? (
          <div className="w-full flex flex-col items-center justify-center space-y-10">
            <span className="w-full lg:w-[50%] group">
              <p className="text-white/40 pb-4 group-hover:text-white smooth">
                Domain
              </p>
              <input
                type="text"
                className="input"
                value={site}
                onChange={(e) => setSite(e.target.value.trim().toLowerCase())}
              />
              {error ? (
                <p className="text-xs pt-2 font-light text-red-400">{error}</p>
              ) : (
                <p className="text-xs pt-2 font-light text-white/20">
                  Enter the domain or subdomain without {"www"}
                </p>
              )}
            </span>
            {error === "" && (
              <button className="button" onClick={checkDomainAvailability}>
                {loading ? "Adding..." : " Add website"}
              </button>
            )}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center space-y-10">
            <span className="w-full lg:w-[50%]">
              <textarea
                type="text"
                className="input
               text-white/20 cursor-pointer"
                disabled
                value={`<script defer data-domain="${site}"
                src="http://localhost:3000/tracking-script.js"></script>`}
              />
              <p className="text-xs text-white/20 pt-2 font-light">
                Paste this snippet in the <b>{"<head>"} of your websites</b>
              </p>
            </span>
            <button
              onClick={() => router.push(`w/${site.trim()}`)}
              className="button"
            >
              Added
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Add;
