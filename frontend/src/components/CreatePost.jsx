import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose, // Only use DialogClose for closing
} from "@/components/ui/dialog.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";
import profile from '../assets/profile.png';
// const CreatePost = ({ open, setOpen }) => {
//   const imageRef = useRef();
//   const [file, setFile] = useState("");
//   const [caption, setCaption] = useState("");
//   const [imagePreview, setImagePreview] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { user } = useSelector((store) => store.auth);
//   const { posts } = useSelector((store) => store.post);

//   const dispatch = useDispatch();

//   const fileChangeHandler = async (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFile(file);
//       const dataurl = await readFileAsDataURL(file);
//       setImagePreview(dataurl);
//     }
//   };

//   const createPostHandler = async (e) => {
//     e.preventDefault(); // Prevent form submission
    
//     const formData = new FormData();
//     formData.append("caption", caption);
//     if (imagePreview) formData.append("image", file);
    
//     try {
//       setLoading(true);
//       const res = await axios.post(
//         "http://localhost:8000/api/v1/post/addpost",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//           withCredentials: true,
//         }
//       );
  
//       console.log("API Response:", res.data);
  
//       if (res.data.success) {
//         // Add isBookmarked explicitly as false
//         const newPost = { ...res.data.post, isBookmarked: false };
  
//         // Update Redux state with the new post
//         dispatch(setPosts([newPost, ...posts])); // Add the new post to the top of the posts array
  
//         toast.success(res.data.message);
//         setOpen(false); // Close the dialog on success
//       }
//     } catch (error) {
//       console.error("API Error:", error.response?.data || error.message);
//       toast.error(error.response?.data?.message || "Something went wrong!");
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   return (
//     <Dialog open={open} onOpenChange={(state) => setOpen(state)}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Create New Post</DialogTitle>
//           <DialogDescription>Share something with your friends!</DialogDescription>
//           {/* Only use Dialog.Close for closing */}
//           <DialogClose className="absolute top-2 right-2 text-gray-500 cursor-pointer">
//           </DialogClose>
//         </DialogHeader>
//         <div className="flex gap-2 items-center">
//           <Avatar>
//             <AvatarImage
//               src={user?.profilePicture}
//               alt="img"
//               className="w-12 h-12 rounded-full object-cover"
//             />
//             <AvatarFallback><img src={profile} alt="img" className="w-12 h-12 rounded-full object-cover" /></AvatarFallback>
//           </Avatar>
//           <div className="flex flex-col">
//             <h1 className="font-semibold text-sm">{user?.username}</h1>
//             <span className="text-gray-600 text-xs">{user?.bio}</span>
//           </div>
//         </div>
//         <Textarea
//           value={caption}
//           onChange={(e) => setCaption(e.target.value)}
//           className="focus-visible:ring-transparent border-none"
//           placeholder="Write a Caption..."
//         />
//         {imagePreview && (
//           <div className="w-3/4 mx-auto">
//             <img
//               src={imagePreview}
//               alt="preview"
//               className="object-cover rounded-md w-1/2 h-full mx-auto"
//             />
//           </div>
//         )}
//         <input
//           ref={imageRef}
//           type="file"
//           className="hidden"
//           onChange={fileChangeHandler}
//         />
//         <Button className="w-fit mx-auto" onClick={() => imageRef.current.click()}>
//           Select File from computer
//         </Button>
//         {imagePreview && (
//           loading ? (
//             <Button>
//               <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please wait
//             </Button>
//           ) : (
//             <Button onClick={createPostHandler} type="submit">
//               Post
//             </Button>
//           )
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CreatePost;

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);

  const dispatch = useDispatch();

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataurl = await readFileAsDataURL(file);
      setImagePreview(dataurl);
    }
  };

  const createPostHandler = async (e) => {
    e.preventDefault(); // Prevent form submission

    // Check if caption exists
    if (!caption.trim()) {
      toast.error("Caption is required to create a post.");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);

    try {
      setLoading(true);
      const res = await axios.post(
        "https://socially-ee6z.onrender.com/api/v1/post/addpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log("API Response:", res.data);

      if (res.data.success) {
        // Add isBookmarked explicitly as false
        const newPost = { ...res.data.post, isBookmarked: false };

        // Update Redux state with the new post
        dispatch(setPosts([newPost, ...posts])); // Add the new post to the top of the posts array

        toast.success(res.data.message);
        setOpen(false); // Close the dialog on success
        setCaption(""); // Clear the caption
        setImagePreview(""); // Clear the image preview
        setFile(""); // Clear the selected file
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(state) => setOpen(state)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>Share something with your friends!</DialogDescription>
          {/* Only use DialogClose for closing */}
          <DialogClose className="absolute top-2 right-2 text-gray-500 cursor-pointer">
          </DialogClose>
        </DialogHeader>
        <div className="flex gap-2 items-center">
          <Avatar>
            <AvatarImage
              src={user?.profilePicture}
              alt="img"
              className="w-12 h-12 rounded-full object-cover"
            />
            <AvatarFallback>
              <img
                src={profile}
                alt="img"
                className="w-12 h-12 rounded-full object-cover"
              />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h1 className="font-semibold text-sm">{user?.username}</h1>
            <span className="text-gray-600 text-xs">{user?.bio}</span>
          </div>
        </div>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none"
          placeholder="Write a Caption..."
        />
        {imagePreview && (
          <div className="w-3/4 mx-auto">
            <img
              src={imagePreview}
              alt="preview"
              className="object-cover rounded-md w-1/2 h-full mx-auto"
            />
          </div>
        )}
        <input
          ref={imageRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
        />
        <Button className="w-fit mx-auto" onClick={() => imageRef.current.click()}>
          Select File from computer
        </Button>
        <Button
          onClick={createPostHandler}
          type="submit"
          disabled={loading}
          className="w-fit mx-auto"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please wait
            </>
          ) : (
            "Post"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
