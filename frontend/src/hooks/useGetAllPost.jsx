import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPost = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllPost = async () => {
      console.log("Fetching posts...");
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/post/all",
          { withCredentials: true }
        );
        if (res.data.success) {
          console.log("Fetched posts:", res.data.posts); // Log fetched posts here
          dispatch(setPosts(res.data.posts));
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchAllPost(); // Ensure this is called
  }, []); // Include dispatch in the dependency array
};

export default useGetAllPost;
