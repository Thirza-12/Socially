import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null, // Or from your auth state management
    suggestedUsers: [],
    userProfile: null,

    ////////////////
    selectedUser: null,
    following: [],
  },
  reducers: {
    // actions
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    updateUserProfile: (state, action) => {
      state.userProfile = {
        ...state.userProfile,
        followers: action.payload.followers,
        following: action.payload.following,
      };
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    
    ///////////////////////////////
    setSelectedUser:(state,action)=>{
        state.selectedUser=action.payload;
    },



    // /////////////////////////

    setFollowing: (state, action) => {
      state.following = action.payload
    },
    toggleFollow: (state, action) => {
      const userId = action.payload;
      
      // Ensure following is always an array
      if (!state.following) {
        state.following = [];
      }
    
      if (state.following.includes(userId)) {
        state.following = state.following.filter(id => id !== userId);
      } else {
        state.following.push(userId);
      }
    },
    

  },
});
export const {
  setAuthUser,
  setSuggestedUsers,
  setUserProfile,
  updateUserProfile,
  //////////////////
  setSelectedUser,
  //////////////////
  setFollowing,
  toggleFollow
} = authSlice.actions;
export default authSlice.reducer;
