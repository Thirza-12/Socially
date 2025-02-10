
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Heart, LogOut, MessageCircle } from "lucide-react";
import profile from "../assets/profile.png";
import { Dialog, DialogContent } from "./ui/dialog"; 
import axios from "axios";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";
import { setPosts, setSelectedPost } from "@/redux/postSlice";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState("posts");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const { userProfile, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const [followersCount, setFollowersCount] = useState(
    userProfile?.followers.includes(user?._id) || 0 
  );
  const dispatch = useDispatch(); 

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpenDialog(true);
  };

  useEffect(() => {
    if (userProfile?.followers?.includes(user?._id)) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  }, [userProfile, user?._id]);

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  const handleFollowUnfollow = async () => {
    try {
        const response = await axios.post(
            `https://socially-ee6z.onrender.com/api/v1/user/followOrUnfollow/${userProfile._id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
                withCredentials: true,
            }
        );

        if (response.data.success) {
            if (isFollowing) {
                setIsFollowing(false);
                setFollowersCount((prev) => prev - 1);
            } else {
                setIsFollowing(true);
                setFollowersCount((prev) => prev + 1);
            }
        }
    } catch (error) {
        console.error("Error following/unfollowing:", error);
    }
};

  const handleMessage = async () => {
    if (userProfile?._id) {
      navigate(`/chat/${userProfile._id}`);
    } else {
      console.log("User ID is not available");
    }
  };

  const logoutHandler = async () => {
    try {
      const res = await axios.get("https://socially-ee6z.onrender.com/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null)); 
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login"); 
        toast.success(res.data.message); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while logging out");
    }
  };

  return (
    <div className="flex max-w-5xl justify-center mx-auto">
      <div className="flex flex-col gap-10 p-8">
        {/* Profile Header */}
        <div className="flex mx-auto">
          <section className="mr-10 md:ml-0">
            <Avatar
              className="h-32 w-32 cursor-pointer"
              onClick={() => handleImageClick(userProfile?.profilePicture)}
            >
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profilephoto"
                className="object-cover"
              />
              <AvatarFallback>
                <img src={profile} alt="profilephoto" className="h-32 w-32" />
              </AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="w-full flex flex-col gap-5">
              <div className="w-fit gap-5 flex justify-between items-center">
                <span className="font-bold">{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button
                        variant="secondary"
                        className="hover:bg-gray-200 h-8"
                      >
                        Edit profile
                      </Button>
                    </Link>
                    <LogOut
                        variant="secondary"
                        className="hover:bg-gray-100 h-8 cursor-pointer"
                        onClick={logoutHandler}
                    >
                      LogOut
                    </LogOut>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button
                      variant="secondary"
                      className="h-8"
                      onClick={handleFollowUnfollow} // Trigger Unfollow
                    >
                      Unfollow
                    </Button>
                    <Button variant="secondary" className="h-8">
                      Message
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="bg-[#0095F6] hover:bg-[#3192d2] h-8"
                      onClick={handleFollowUnfollow} // Trigger Follow
                    >
                      Follow
                    </Button>
                    <Button
                      className="bg-[#2c2c2c] hover:bg-[#5b5a5a] h-8"
                      onClick={handleMessage} // Trigger Follow
                    >
                      Message
                    </Button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts.length}{" "}
                  </span>
                  posts
                </p>
                <p>
                  <span className="font-semibold">{followersCount} </span>
                  followers
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.following.length}{" "}
                  </span>
                  following
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">{userProfile?.name}</span>
                <span className="font-sm text-sm">{userProfile?.bio}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Posts and Saved Tabs */}
        <div className="mx-auto w-full md:w-[800px] border-t border-t-gray-200">
          {/* Tabs */}
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("saved")}
            >
              SAVED
            </span>
          </div>
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            {displayedPost?.length > 0 ? (
              displayedPost.map((post) => {
                if (post.image) {
                  return (
                    <div
                      key={post?._id}
                      className="relative group cursor-pointer"
                      onClick={() => handleImageClick(post.image)}
                    >
                      <img
                        src={post.image}
                        alt="postimage"
                        className="rounded-sm w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center text-white space-x-4">
                          <button className="flex items-center gap-2 hover:text-gray-300">
                            <Heart />
                            <span>{post?.likes.length}</span>
                          </button>
                          <button className="flex items-center gap-2 hover:text-gray-300">
                            <MessageCircle />
                            <span>{post?.comments.length}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                } else if (post.caption) {
                  return (
                    <div
                      key={post?._id}
                      className="cursor-pointer flex flex-col items-start p-4 border border-gray-200 rounded-md shadow-sm relative overflow-hidden"
                    >
                      <p className="text-center text-black dark:text-black">{post.caption}</p>
                      <div className="absolute inset-0 flex items-center justify-center dark:bg-white dark:hover:bg-[#2c2c2c] bg-black bg-opacity-0 transition-opacity duration-300 hover:bg-opacity-50">
                        <div className="flex items-center text-white space-x-4">
                          <button className="flex items-center gap-2 hover:text-gray-300">
                            <Heart />
                            <span>{post?.likes.length}</span>
                          </button>
                          <button className="flex items-center gap-2 hover:text-gray-300">
                            <MessageCircle />
                            <span>{post?.comments.length}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })
            ) : (
              <div className="col-span-3 text-center text-gray-500">
                No items to display.
              </div>
            )}
          </div>
        </div>

        {/* Dialog for Image */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="p-8 max-w-md mx-auto">
            <img
              src={selectedImage || profile}
              alt={selectedImage ? "Selected Image" : "Profile"}
              className="w-full h-auto rounded-lg"
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Profile;
