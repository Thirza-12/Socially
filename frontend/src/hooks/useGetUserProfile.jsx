import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log("Fetching posts...");
      try {
        const res = await axios.get(
          `https://socially-e6we.onrender.com/api/v1/user/${userId}/profile`,
          { withCredentials: true }
        );
        if (res.data.success) {
          console.log("Fetched posts:", res.data.user); // Log fetched posts here
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchUserProfile(); // Ensure this is called
  }, [userId]); // Include dispatch in the dependency array
};

export default useGetUserProfile;
// import { setUserProfile } from "@/redux/authSlice";
// import axios from "axios";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";

// const useGetUserProfile = (userId) => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       console.log("Fetching profile...");
//       try {
//         const res = await axios.get(
//           `http://localhost:8000/api/v1/user/${userId}/profile`,
//           { withCredentials: true }
//         );
//         if (res.data.success) {
//           console.log("Fetched user profile:", res.data.user); // Log fetched profile here
//           // Dispatch the user profile data to Redux store
//           dispatch(setUserProfile(res.data.user));
//         }
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//       }
//     };

//     fetchUserProfile(); // Ensure this is called on component mount or when userId changes
//   }, [userId, dispatch]); // Include dispatch in the dependency array

// };

// export default useGetUserProfile;
