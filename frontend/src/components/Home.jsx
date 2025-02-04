import React from "react";
import { Outlet } from "react-router-dom";
import Feed from "./Feed";
import useGetAllPost from "@/hooks/useGetAllPost";
import RightSidebar from "./RightSidebar";
import useGetSuggestedusers from "@/hooks/useGetSuggestedUsers";

const Home = () => {
  useGetAllPost();
  useGetSuggestedusers();
  return (
    <div className="flex justify-between">
      <div className="mx-auto">
        <Feed/>
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  );
};

export default Home;
