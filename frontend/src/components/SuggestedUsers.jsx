// import React from 'react'
// import { useSelector } from 'react-redux'
// import { Link } from 'react-router-dom';
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
// import profilephoto from '../assets/profile.png'
// const SuggestedUsers = () => {
//     const { suggestedUsers } = useSelector(store => store.auth);
//     return (
//         <div className='my-10 w-full'>
//             <div className='flex items-center justify-between text-sm w-full'>
//                 <h1 className='font-semibold text-gray-500'>Suggested for you</h1>
//                 <span className='font-medium cursor-pointer'>See All</span>
//             </div>
//             {
//                 suggestedUsers.map((user) => {
//                     return (
//                         <div key={user?._id} className='flex items-center justify-between my-5'>
//                             <div className='flex items-center gap-3'>
//                                 <Link to={`/profile/${user?._id}`}>
//                                     <Avatar>
//                                         <AvatarImage src={user?.profilePicture} alt="post_image" className='object-cover' />
//                                         <AvatarFallback><img src={profilephoto} alt="" /></AvatarFallback>
//                                     </Avatar>
//                                 </Link>
//                                 <div className='flex flex-col '>
//                                     <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
//                                     <span className='text-gray-500 text-sm'>{user?.bio}</span>
//                                 </div>
//                             </div>
//                             <span className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]'>Follow</span>
//                         </div>
//                     )
//                 })
//             }
//         </div>
//     )
// }

// export default SuggestedUsers


import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import profilephoto from '../assets/profile.png'
import { toggleFollow, setSuggestedUsers } from '../redux/authSlice'
import axios from 'axios'

const SuggestedUsers = () => {
  const dispatch = useDispatch();
  const { suggestedUsers = [], following = [], user } = useSelector((store) => store.auth);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Shuffle and limit to 3 users on initial load
    const shuffledUsers = [...suggestedUsers].sort(() => 0.5 - Math.random());
    setDisplayedUsers(shuffledUsers.slice(0, 3));
  }, [suggestedUsers]);

  const handleFollowUnfollow = async (userId) => {
    dispatch(toggleFollow(userId)); // Optimistic UI update

    try {
      const response = await axios.post(
        `https://socially-yvkc.onrender.com/api/v1/user/followOrUnfollow/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        dispatch(toggleFollow(userId)); // Revert on failure
      }
    } catch (error) {
      console.error("Error following/unfollowing:", error);
      dispatch(toggleFollow(userId)); // Revert on error
    }
  };

  const toggleUsers = () => {
    if (showAll) {
      // Return to showing only 3 users
      const shuffledUsers = [...suggestedUsers].sort(() => 0.5 - Math.random());
      setDisplayedUsers(shuffledUsers.slice(0, 3));
    } else {
      // Show all users
      setDisplayedUsers(suggestedUsers);
    }
    setShowAll(!showAll); // Toggle state
  };

  return (
    <div className="my-10 w-full">
      <div className="flex items-center justify-between text-sm w-full">
        <h1 className="font-semibold text-gray-500">Suggested for you</h1>
        <span className="font-medium cursor-pointer" onClick={toggleUsers}>
          {showAll ? "Show Less" : "See All"}
        </span>
      </div>
      {displayedUsers.length > 0 ? (
        displayedUsers.map((user) => {
          const isFollowing = following.includes(user._id);

          return (
            <div key={user._id} className="flex items-center justify-between my-5">
              <div className="flex items-center gap-3">
                <Link to={`/profile/${user._id}`}>
                  <Avatar>
                    <AvatarImage
                      src={user?.profilePicture || profilephoto}
                      alt={`${user.username || "User"}'s profile`}
                      className="object-cover"
                    />
                    <AvatarFallback>{user?.username?.charAt(0).toUpperCase() || "?"}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex flex-col">
                  <h1 className="font-semibold text-sm">
                    <Link to={`/profile/${user._id}`}>{user.username}</Link>
                  </h1>
                  <span className="text-gray-500 text-sm">{user.bio || "No bio available"}</span>
                </div>
              </div>
              <span
                className={`text-xs font-bold cursor-pointer hover:text-[#3495d6] ${
                  isFollowing ? "text-gray-400" : "text-[#3BADF8]"
                }`}
                onClick={() => handleFollowUnfollow(user._id)}
              >
                {isFollowing ? "Following" : "Follow"}
              </span>
            </div>
          );
        })
      ) : (
        <p>No suggested users available.</p>
      )}
    </div>
  );
};

export default SuggestedUsers;

