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
      <div className="ml-auto mr-0 sm:mr-36">
        <Feed/>
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  );
};

export default Home;
