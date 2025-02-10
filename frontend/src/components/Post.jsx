import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreVertical, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart, FaBookmark } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts, setSelectedPost, toggleBookmark } from "@/redux/postSlice";
import profile from "../assets/profile.png";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts, bookmarkedPosts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes?.includes(user?._id) || false);
  const [comment, setComment] = useState(post.comments);
  const [postLike, setPostLike] = useState(post.likes?.length || 0);
  const dispatch = useDispatch();

  const isBookmarked = bookmarkedPosts?.includes(post._id);
  console.log();
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `https://socially-ee6z.onrender.com/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user?._id)
                  : [...p.likes, user?._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `https://socially-ee6z.onrender.com/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `https://socially-ee6z.onrender.com/api/v1/post/${post?._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) => {
          if (p._id === post._id) {
            return {
              ...p,
              comments: updatedCommentData,
              image: p.image,
            };
          }
          return p;
        });

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const bookmarkHandler = async () => {
    try {
      dispatch(toggleBookmark(post._id));
      const res = await axios.get(
        `https://socially-ee6z.onrender.com/api/v1/post/${post._id}/bookmark`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        dispatch(toggleBookmark(post._id));
        toast.error("Failed to bookmark the post.");
      }
    } catch (error) {
      dispatch(toggleBookmark(post._id));
      console.error(error);
      toast.error("An error occurred while bookmarking.");
    }
  };

  const shareHandler = () => {
    // Get the profile URL
    const profileUrl = `https://socially-ee6z.onrender.com/profile/${post.author?._id}`;

    // Check if the Web Share API is supported (for mobile devices)
    if (navigator.share) {
      navigator
        .share({
          title: `Check out ${post.author?.username}'s profile`,
          text: `Visit this profile: ${profileUrl}`,
          url: profileUrl,
        })
        .then(() => {
          // toast.success("Profile shared successfully!");
          console.log("Profile shared successfully");
        })
        .catch((error) => {
          toast.error("Error sharing profile");
          console.error("Share failed", error);
        });
    } else {
      // For desktop, provide manual options for sharing
      const shareOptions = `
      Share this profile:
      - Email: mailto:?subject=Check out this profile&body=Visit this profile: ${profileUrl}
      - Twitter: https://twitter.com/intent/tweet?text=Check out this profile: ${profileUrl}
      - Facebook: https://www.facebook.com/sharer/sharer.php?u=${profileUrl}
    `;
      prompt("Share Profile URL", shareOptions);
    }
  };

  return (
    <div className="my-0 sm:my-5 mx-auto flex flex-col p-2 bg-transparent sm:max-w-screen-sm ">
      <div className="w-full mx-auto ml-0 flex items-center gap-3">
        <Avatar>
          <AvatarImage
            src={post.author?.profilePicture}
            className="w-8 h-8 rounded-full object-cover"
          />
          <AvatarFallback>
            <img src={profile} alt="" className="w-8 h-8 rounded-full" />
          </AvatarFallback>
        </Avatar>
        <Link to={`/profile/${post.author?._id}`}>
          <h1 className="font-semibold text-sm sm:text-base">
            {post.author?.username}
          </h1>
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <MoreVertical className="cursor-pointer ml-auto" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {user && user?._id !== post?.author?._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4956]"
              >
                Unfollow
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={shareHandler}
              className="cursor-pointer w-fit text-[#008CFF]"
            >
              Share Profile
            </Button>
            {user && user?._id === post?.author?._id && (
              <Button
                variant="ghost"
                onClick={deletePostHandler}
                className="cursor-pointer w-fit text-[#ED4956]"
              >
                Delete Post
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Display Text (Caption) */}
      {/* Display Image if it exists */}
      {post?.image && (
        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <DialogTrigger asChild>
            <img
              src={post?.image}
              className="rounded-md mt-3 w-full sm:w-[600px] aspect-square object-cover cursor-pointer"
              alt="post-image"
            />
          </DialogTrigger>
          <DialogContent className="p-10">
            <img
              src={post?.image}
              className="rounded-md w-full h-full cursor-pointer"
              alt="dialog-post-image"
            />
          </DialogContent>
        </Dialog>
      )}

      {post?.caption && post?.image && (
        <p className="mt-2 text-sm text-gray-700 sm:text-base">
          <span className="font-medium mr-2 dark:text-slate-100">
            {post.author?.username}
          </span>
          <span className="dark:text-slate-100">{post?.caption}</span>
        </p>
      )}

      {post?.caption && !post?.image && (
        <p className="w-full mt-2 text-sm text-gray-700 sm:text-base ">
          <span className="dark:text-slate-200">{post?.caption}</span>
        </p>
      )}

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart
              onClick={likeOrDislikeHandler}
              size={"22px"}
              className="cursor-pointer text-red-600"
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikeHandler}
              size={"22px"}
              className="cursor-pointer"
            />
          )}
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            size={"22px"}
            className="cursor-pointer"
          />
          <Send
            size={"22px"}
            className="cursor-pointer"
            onClick={shareHandler}
          />
        </div>
        {isBookmarked ? (
          <FaBookmark
            onClick={bookmarkHandler}
            size={"22px"}
            className="cursor-pointer"
          />
        ) : (
          <Bookmark
            onClick={bookmarkHandler}
            size={"22px"}
            className="cursor-pointer"
          />
        )}
      </div>

      <span className="font-medium block mb-2">{postLike} likes</span>

      {/* Comments */}
      {comment.length > 0 && (
        <span
          className="text-gray-500 cursor-pointer"
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
        >
          View all {comment.length} comments
        </span>
      )}

      <CommentDialog open={open} setOpen={setOpen} />

      <div className="flex items-center mt-2">
        <input
          type="text"
          placeholder="Add a Comment.."
          className="outline-none text-sm w-full bg-transparent sm:w-4/5"
          value={text}
          onChange={changeEventHandler}
          onKeyDown={(e) => {
            if (e.key === "Enter" && text.trim()) {
              commentHandler();
            }
          }}
        />
        {text && (
          <span
            className="text-blue-500 cursor-pointer sm:ml-2"
            onClick={commentHandler}
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
