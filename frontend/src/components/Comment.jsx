import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import profile from "../assets/profile.png";
import { Link } from "react-router-dom";
const Comment = ({ comment }) => {
  console.log(comment);

  return (
    <div className="">
      <div className="flex gap-3 items-center w-fit">
        <Avatar>
          <AvatarImage
            src={comment?.author?.profilePicture}
            className="w-8 h-8 object-cover rounded-full"
          />
          <AvatarFallback>
            <img src={profile} alt="img" className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>
        <Link to={`/profile/${comment?.author?._id}`}>
          <div className="flex flex-col justify-center">
            <h1 className="font-semibold text-sm cursor-pointer">
              {comment?.author.username}
            </h1>
            <span className="font-normal text-sm">{comment?.text}</span>
          </div>
        </Link>
      </div>
      <hr className="w-full my-2" />
    </div>
  );
};

export default Comment;
