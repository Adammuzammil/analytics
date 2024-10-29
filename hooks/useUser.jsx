"use client";

import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";

const useUser = () => {
  const [currentUser, setCurrentUser] = useState("");

  const fetchUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user ?? "no user");
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    if (!supabase) return;
    fetchUser();
  }, [supabase]);

  return { currentUser };
};

export default useUser;
