"use client";

import Header from "@/components/Header";
import useUser from "@/hooks/useUser";
import { supabase } from "@/utils/supabase";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Analytics = () => {
  const { currentUser: user } = useUser();
  const router = useRouter();
  const { website } = useParams();
  console.log(website);
  const [loading, setLoading] = useState(false);
  const [pageViews, setPageViews] = useState([]);
  const [totalVisits, setTotalVisits] = useState([]);
  const [groupedPageViews, setGroupedPageViews] = useState([]);

  useEffect(() => {
    if (!user) return;
    if (user?.role !== "authenticated") router.push("/sign-in");

    const checkWebsiteCurrentUser = async () => {
      const { data, error } = await supabase
        .from("websites")
        .select()
        .eq("name", website)
        .eq("user_id", user?.id);

      data.length === 0
        ? router.push("/dashboard")
        : setTimeout(() => {
            fetchViews();
          }, 500);
    };

    checkWebsiteCurrentUser();
  }, [user]);

  const fetchViews = async () => {
    setLoading(true);
    try {
      const [viewResponse, visitsResponse] = await Promise.all([
        supabase.from("page_views").select().eq("domain", website),
        supabase.from("visits").select().eq("website_id", website),
      ]);

      // Add error handling for the responses
      if (viewResponse.error) throw viewResponse.error;
      if (visitsResponse.error) throw visitsResponse.error;

      // Ensure we have valid data before updating state
      const views = Array.isArray(viewResponse.data) ? viewResponse.data : [];
      const visits = Array.isArray(visitsResponse.data)
        ? visitsResponse.data
        : [];

      setPageViews(views);
      setGroupedPageViews(groupPageViews(views));
      setTotalVisits(visits);
    } catch (error) {
      console.error("Error fetching data:", error);
      // You might want to add error state handling here
    } finally {
      setLoading(false);
    }
  };

  //   const fetchViews = async () => {
  //     setLoading(true);
  //     try {
  //       const [viewResponse, visitsResponse] = await Promise.all([
  //         supabase.from("page_views").select().eq("domain", website),
  //         supabase.from("visits").select().eq("website_id", website),
  //       ]);
  //       const views = viewResponse.data;
  //       const visits = visitsResponse.data;
  //       setPageViews(views);
  //       setGroupedPageViews(groupPageViews(views));
  //       setTotalVisits(visits);
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  // group the page views with paths
  function groupPageViews(pageViews) {
    const groupedPageViews = {};

    pageViews.forEach(({ page }) => {
      // Extract the path from the page URL by removing the protocol and hostname
      const path = page.replace(/^(?:\/\/|[^/]+)*\//, "");

      // Increment the visit count for the page path
      groupedPageViews[path] = (groupedPageViews[path] || 0) + 1;
    });

    return Object.keys(groupedPageViews).map((page) => ({
      page: page,
      visits: groupedPageViews[page],
    }));
  }

  // handle the format of the numbers/counts
  const abbreviateNumber = (number) => {
    if (number === null) return 0;

    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K";
    } else {
      return number?.toString();
    }
  };

  if (loading) {
    return (
      <div className="bg-black text-white h-screen w-full flex flex-col items-start justify-start">
        <Header />
        <div
          className="min-h-screen w-full items-center justify-center
         flex text-white relative"
        >
          loading...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white h-screen w-full flex flex-col justify-start items-start">
      <Header />
      {pageViews?.length === 0 && !loading ? (
        <div className="w-full flex flex-col items-center justify-center space-y-6 relative z-40 h-screen px-4">
          <div className="relative z-40 w-full lg:w-2/3 bg-black border border-white/5 py-12 px-8 items-center justify-center flex flex-col text-white space-y-4">
            <p className="bg-green-600 rounded-full p-4 animate-pulse" />
            <p className="animate-pulse">Waiting for the first page view</p>
            <button className="button" onClick={() => window.location.reload()}>
              Refresh
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full justify-center items-center">
          <Tabs defaultValue="general" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="general">Account</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 px-4 gap-6">
                <div className="bg-black border-white/5 border text-white text-center">
                  <p className="text-white/70 font-medium py-8 w-full text-center border-b border-white/5">
                    Total Visits
                  </p>
                  <p className="py-12 text-3xl lg:text-4xl font-bold bg-[#050505]">
                    {totalVisits?.length}
                  </p>
                </div>
                <div className="bg-black border-white/5 border text-white text-center">
                  <p className="text-white/70 font-medium py-8 w-full text-center border-b border-white/5">
                    Page Views
                  </p>
                  <p className="py-12 text-3xl lg:text-4xl font-bold bg-[#050505]">
                    {abbreviateNumber(pageViews?.length)}
                  </p>
                </div>
              </div>

              <div className="w-full grid grid-cols-1 lg:grid-cols-2 mt-12 bg-black border-y border-white/5">
                {/* Top Pages */}
                <div className="flex flex-col bg-black z-40 h-full w-full">
                  <h1>Top Pages</h1>
                  {groupedPageViews.map((view, i) => (
                    <div
                      className="text-white w-full flex items-center justify-between px-6 border-b border-white/5"
                      key={i}
                    >
                      <p>{view.page}</p>
                      <p>{abbreviateNumber(view.visits)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="custom">Change your password here.</TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Analytics;
