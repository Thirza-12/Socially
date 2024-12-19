import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedusers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      console.log("Fetching posts...");
      try {
        const res = await axios.get(
          "https://socially-yvkc.onrender.com/api/v1/user/suggested",
          { withCredentials: true }
        );
        if (res.data.success) {
          console.log("Fetched posts:", res.data.posts); // Log fetched posts here
          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchSuggestedUsers(); // Ensure this is called
  }, []); // Include dispatch in the dependency array
};

export default useGetSuggestedusers;
