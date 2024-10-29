"use client";

import Header from "@/components/Header";
import useUser from "@/hooks/useUser";
import { supabase } from "@/utils/supabase";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const Settings = () => {
  const { currentUser: user } = useUser();
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    if (!user) return;
    if (user === "no user") redirect("/sign-in");
  }, [user]);

  const getUserAPI = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("user_id", user.id);
    if (data.length > 0) {
      setApiKey(data[0].api);
    }
    setLoading(false);
  };

  function generateApiKey(length = 32) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let apiKey = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      apiKey += characters[randomIndex];
    }
    return apiKey;
  }

  const handleApiKey = async () => {
    setLoading(true);
    if (loading || !user) return;
    const apiKey = generateApiKey();

    const { data, error } = await supabase
      .from("users")
      .insert({ api: apiKey, user_id: user.id })
      .select();
    if (error) console.log(error);
    setApiKey(apiKey);
    setLoading(false);
  };

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    alert("API Key copied successfully!");
  };

  useEffect(() => {
    if (!user || !supabase) return;
    getUserAPI();
  }, [user, supabase]);

  if (user === "no user") {
    <div>
      <Header />
      <div className="h-screen flex items-center justify-center w-full z-40 text-white">
        Redirecting....
      </div>
    </div>;
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-black">
      <Header />
      <div className="min-h-screen flex w-full items-center justify-center text-white">
        {!apiKey && !loading && (
          <button className="button" onClick={handleApiKey}>
            Generate API Key
          </button>
        )}
        {apiKey && (
          <div className="w-full mt-12 border-white/5 border bg-black space-y-12 lg:w-1/2 py-12 md:w-3/4">
            <div className="space-y-12 px-4">
              <p>Your API Key is :</p>
              <input
                type="text"
                disabled
                className="input-disabled"
                value={apiKey}
                readOnly
              />
              <button className="button" onClick={copyKey}>
                Copy
              </button>
            </div>

            <div className="space-y-4 border-t border-white/5 bg-black p-6">
              <h1 className="text-lg p-4 bg-[#0f0f0f70]">
                You can create custom events using our API as shown below:{" "}
              </h1>
              <div>
                <Coders />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;

export const Coders = () => {
  let codeString = `
 const url = "http://localhost:3000/api/events";
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer {{apiKey}}",
  };
  const eventData = {
    name: "",//* required
    domain: "", //* required
    description: "",//optional
  };

  const sendRequest = async () => {
    axios
      .post(url, eventData, { headers })
      .then()
      .catch((error) => {
        console.error("Error:", error);
      });
  };`;
  return (
    <SyntaxHighlighter language="javascript" style={dark}>
      {codeString}
    </SyntaxHighlighter>
  );
};
