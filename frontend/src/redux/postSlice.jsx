// import { createSlice } from "@reduxjs/toolkit";
// const postSlice=createSlice({
//     name: 'post',
//     initialState:{
//         posts:[],
//         selectedPost: null,
//     },
//     reducers:{
//         // options
//         setPosts:(state,action)=>{
//             state.posts=action.payload;
//         },
//         setSelectedPost:(state,action)=>{
//             state.selectedPost=action.payload;
//         }
//     }
// })
// export const {setPosts, setSelectedPost}=postSlice.actions;
// export default postSlice.reducer;


// import { createSlice } from "@reduxjs/toolkit";

// const postSlice = createSlice({
//   name: "post",
//   initialState: {
//     posts: [],
//     selectedPost: null,
//     bookmarkedPosts: [], // Initialize as an empty array
//   },
//   reducers: {
//     setPosts: (state, action) => {
//       state.posts = action.payload;
//     },
//     setSelectedPost: (state, action) => {
//       state.selectedPost = action.payload;
//     },
//     toggleBookmark: (state, action) => {
//       const postId = action.payload;

//       // Debug log to inspect state before changes
//       console.log("State before toggle:", state);
//       console.log("Action payload (postId):", postId);

//       // Ensure `bookmarkedPosts` is defined
//       if (!state.bookmarkedPosts) {
//         state.bookmarkedPosts = [];
//       }

//       // Toggle bookmark logic
//       if (state.bookmarkedPosts.includes(postId)) {
//         // Remove from bookmarks
//         state.bookmarkedPosts = state.bookmarkedPosts.filter((id) => id !== postId);
//       } else {
//         // Add to bookmarks
//         state.bookmarkedPosts.push(postId);
//       }

//       // Debug log to inspect state after changes
//       console.log("State after toggle:", state);
//     },
//   },
// });

// export const { setPosts, setSelectedPost, toggleBookmark } = postSlice.actions;
// export default postSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    selectedPost: null,
    bookmarkedPosts: [], // Initialize as an empty array
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },
    setBookmarkedPosts: (state, action) => {
      state.bookmarkedPosts = action.payload; // Set the bookmarked posts from the backend
    },
    toggleBookmark: (state, action) => {
      const postId = action.payload;
      
      // Ensure `bookmarkedPosts` is defined
      if (!state.bookmarkedPosts) {
        state.bookmarkedPosts = [];
      }

      // Toggle bookmark logic
      if (state.bookmarkedPosts.includes(postId)) {
        // Remove from bookmarks
        state.bookmarkedPosts = state.bookmarkedPosts.filter((id) => id !== postId);
      } else {
        // Add to bookmarks
        state.bookmarkedPosts.push(postId);
      }
    },
  },
});

export const { setPosts, setSelectedPost, setBookmarkedPosts, toggleBookmark } = postSlice.actions;
export default postSlice.reducer;
