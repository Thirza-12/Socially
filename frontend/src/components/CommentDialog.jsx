import { Dialog, DialogContent } from "./ui/dialog";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";
import profile from "../assets/profile.png";
import { Send } from "lucide-react";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { selectedPost } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [comment, setComment] = useState([]);
  const { posts } = useSelector((state) => state.post);

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `https://socially-ee6z.onrender.com/api/v1/post/${selectedPost?._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setText("");
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: updatedCommentData }
            : p
        );
        dispatch(setPosts(updatedPostData));

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-4xl p-0 flex flex-col h-auto"
        aria-hidden-close
      >
        <div className="flex justify-between">
          {/* Left side: Image */}
          {selectedPost?.image ? (
            <div className="flex flex-col w-1/2 p-4">
              <img
                src={selectedPost?.image}
                alt="Comment Content"
                className="rounded-md w-full"
              />
            </div>
          ) : (
            <div className="flex items-start justify-center space-x-4 p-4">
              {/* If no image, right section will take 1/3 width */}

              <Avatar>
                <AvatarImage
                  src={selectedPost?.author?.profilePicture}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <AvatarFallback>
                  <img
                    src={profile}
                    alt="img"
                    className="w-8 h-8 rounded-full"
                  />
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <Link className="font-semibold">
                  {selectedPost?.author?.username}
                </Link>
                <span className="text-sm mt-1">{selectedPost?.caption}</span>
              </div>
            </div>
          )}

          {/* Right side: Profile, Caption, Comments, and Input */}
          <div
            className={`flex flex-col ${
              selectedPost?.image ? "w-1/2" : "w-2/3"
            } p-4`}
          >
            {/* Profile and Caption */}
            <div className="flex items-start mb-2 gap-3">
              <Avatar>
                <AvatarImage
                  src={selectedPost?.author?.profilePicture}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <AvatarFallback>
                  <img
                    src={profile}
                    alt="img"
                    className="w-8 h-8 rounded-full"
                  />
                </AvatarFallback>
              </Avatar>
              <div>
                <Link className="font-semibold">
                  {selectedPost?.author?.username}
                </Link>
                <span className="text-sm block">{selectedPost?.caption}</span>
              </div>
            </div>

            {/* Comments Section */}
            <hr className="w-full mb-2" />
            <div className="flex-1 overflow-y-auto max-h-[450px] w-full scrollbar-hide">
              {comment.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))}
            </div>

            {/* Comment Input */}
            <div className="w-full mt-2">
              <div className="flex items-end gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={changeEventHandler}
                  placeholder="Add a comment...."
                  className="outline-none border border-gray-300 bg-transparent w-3/4 p-2 rounded-lg"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && text.trim()) {
                      sendMessageHandler(); // Call the send message handler when Enter is pressed
                    }
                  }}
                />
                <Button
                  disabled={!text.trim()}
                  variant="outline"
                  onClick={sendMessageHandler}
                >
                  <Send />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
