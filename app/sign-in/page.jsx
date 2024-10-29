"use client";

import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SignIn = () => {
  const router = useRouter();
  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const catchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(user);

    if (user) {
      if (user.role === "authenticated") router.push("/dashboard");
    }
  };

  useEffect(() => {
    if (!supabase) return;
    catchUser();
  }, [supabase]);

  return (
    <div className="min-h-screen items-center justify-center flex w-full bg-black">
      <button onClick={handleSignIn} className="button">
        Sign in with Google
      </button>
    </div>
  );
};

export default SignIn;
