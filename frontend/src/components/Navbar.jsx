// import React, { useState, useEffect } from "react";
// import {
//   Heart,
//   Home,
//   LogOut,
//   MessageCircle,
//   PlusSquare,
//   Search,
//   Moon,
//   Sun,
// } from "lucide-react"; // Importing moon and sun icons from Lucide
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { toast } from "sonner";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { setAuthUser } from "@/redux/authSlice";
// import CreatePost from "./CreatePost";
// import { setPosts, setSelectedPost } from "@/redux/postSlice";
// import { Link } from "react-router-dom";
// import profile from "../assets/profile.png";
// import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "./ui/dialog";
// import { Button } from "./ui/button";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const { user } = useSelector((store) => store.auth);
//   const [darkMode, setDarkMode] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [searchResults, setSearchResults] = useState([]);
//   const dispatch = useDispatch();
//   ///////////////////////////

//   const { likeNotification} = useSelector(
//     (store) => store.realTimeNotification
//   );
//   const { messageNotification} = useSelector(
//     (store) => store.realTimeNotification
//   );
//   // Check user's preference on page load
//   useEffect(() => {
//     const savedMode = localStorage.getItem("theme");
//     if (savedMode === "dark") {
//       setDarkMode(true);
//       document.documentElement.classList.add("dark");
//     } else {
//       setDarkMode(false);
//       document.documentElement.classList.remove("dark");
//     }
//   }, []);

//   // Toggle theme
//   const toggleDarkMode = () => {
//     setDarkMode((prev) => {
//       const newMode = !prev;
//       if (newMode) {
//         localStorage.setItem("theme", "dark");
//         document.documentElement.classList.add("dark");
//       } else {
//         localStorage.setItem("theme", "light");
//         document.documentElement.classList.remove("dark");
//       }
//       return newMode;
//     });
//   };


//   const navbarHandler = (textType) => {
//     if (textType === "Create") setOpen(true);
//     else if (textType === "Search") {
//       setSearchOpen(true);
//     } else if (textType === "Profile") {
//       navigate(`/profile/${user?._id}`);
//     } else if (textType === "Home") {
//       navigate("/");
//     } else if (textType === "Messages") {
//       navigate("/chat");
//     }
//   };

//   // Fetch users from the backend based on search query
//   const handleSearch = async (e) => {
//     setSearchQuery(e.target.value);
//     if (e.target.value.length >= 1) {
//       try {
//         const res = await axios.get(`http://localhost:8000/api/v1/user/search?query=${e.target.value}`);
//         setSearchResults(res.data.users);
//       } catch (error) {
//         toast.error("Error fetching search results.");
//       }
//     } else {
//       setSearchResults([]); // Clear suggestions if input length is < 3
//     }
//   };

//   const navbarItems = [
//     { icon: <Home />, text: "Home" },
//     { icon: <Search />, text: "Search" },
//     { icon: <MessageCircle />, text: "Messages" },
//     { icon: <Heart />, text: "Notifications" },
//     { icon: <PlusSquare />, text: "Create" },
//     {
//       icon: (
//         <Avatar className="w-8 h-8">
//           <AvatarImage
//             src={user?.profilePicture}
//             className="object-cover w-8 h-8"
//           />
//           <AvatarFallback>
//             <img src={profile} alt="" />
//           </AvatarFallback>
//         </Avatar>
//       ),
//       text: "Profile",
//     },
//   ];

//   return (
//     <div
//       className={`fixed top-0 left-0 h-full w-64 p-4 shadow-md z-50 transition-colors duration-150 ease-in-out ${
//         darkMode ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-800"
//       }`}
//     >
//       <div className="h-full flex flex-col">
//         <div className="flex flex-col space-y-6 ">
//           {/* Reduced margin-top here */}
//           <Link to="/">
//             <div className="mt-5 mb-5 flex items-end">
//               <span className="text-2xl px-4 py-0 rounded-md font-bold cursor-pointer">
//                 Socially
//               </span>
//             </div>
//           </Link>

//           {navbarItems.map((item, index) => (
//             <div
//               onClick={() => navbarHandler(item.text)}
//               key={index}
//               className={`flex items-center space-x-2 px-3 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
//                 darkMode ? "hover:bg-slate-500" : "hover:bg-slate-300"
//               }`}
//             >
//               <div>{item.icon}</div>
//               <span>{item.text}</span>

//               {item.text === "Notifications" &&
//                 likeNotification.length >= 0 && (
//                   <Dialog>
//                     <DialogTrigger asChild>
//                     {likeNotification.length==0?
//                     (
//                       <Button
//                         size="icon"
//                         className="hidden rounded-full h-4 w-4 absolute top-2/4 left-8 bg-red-600 hover:bg-red-600"
//                       >
//                         {likeNotification.length}
//                       </Button>
//                     ):(
//                       <Button
//                         size="icon"
//                         className="rounded-full h-4 w-4 absolute top-2/4 left-8 bg-red-600 hover:bg-red-600"
//                       >
//                         {likeNotification.length}
//                       </Button>
//                     )
//                     }
//                     </DialogTrigger>
//                     <DialogContent className='w-auto'>
//                       <div className="p-2">
//                         {likeNotification.length === 0 ? (
//                           <p> No new Notifications</p>
//                         ) : (
//                           likeNotification.map((notification) => {
//                             return (
//                               <div
//                                 key={notification.userId}
//                                 className="flex items-center gap-3 pb-3"
//                               >
//                                 <Avatar>
//                                   <AvatarImage
//                                     src={
//                                       notification.userDetails?.profilePicture
//                                     }
//                                     className="object-cover"
//                                   />
//                                   <AvatarFallback><img src={profile} alt="" /></AvatarFallback>
//                                 </Avatar>
//                                 <p className="text-sm">
//                                   <span className="font-bold">
//                                     {notification.userDetails?.username}
//                                   </span>{" "}
//                                   liked your post
//                                 </p>
//                               </div>
//                             );
//                           })
//                         )}
//                       </div>
//                     </DialogContent>
//                   </Dialog>
//                 )}
//             </div>
//           ))}
          
//           {/* Dark Mode Toggle Button */}
//           <div
//             onClick={toggleDarkMode}
//             className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 ${
//               darkMode ? "hover:bg-slate-500" : "hover:bg-slate-300"
//             }`}
//           >
//             <div>{darkMode ? <Sun size={18} /> : <Moon size={18} />}</div>
//             {darkMode ? <span>Light Mode</span> : <span>Dark Mode</span>}
//           </div>
//         </div>
//       </div>

//       {/* Search Dialog */}
//       <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
//         <DialogContent>
//           <DialogTitle>Search Users</DialogTitle>
//           <input
//             type="text"
//             placeholder="Search users by name or username"
//             value={searchQuery}
//             onChange={handleSearch}
//             className="border rounded p-2 w-full mb-4 bg-transparent"
//           />
//           <ul>
//             {searchResults.map((suggestedUser) => (
//               <li
//                 key={suggestedUser._id}
//                 onClick={() => {
//                   navigate(`/profile/${suggestedUser._id}`);
//                   setSearchOpen(false);
//                 }} // Navigate to the clicked user's profile
//                 className="py-2 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
//               >
//                 <div className="flex items-center space-x-3">
//                   <Avatar className="w-8 h-8">
//                     <AvatarImage
//                       src={suggestedUser?.profilePicture}
//                       className="object-cover w-8 h-8"
//                     />
//                     <AvatarFallback>
//                       <img src={profile} alt="" />
//                     </AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <p className="font-medium">{suggestedUser.name}</p>
//                     <p className="text-sm text-light">
//                       {suggestedUser.username}
//                     </p>
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </DialogContent>
//       </Dialog>

//       <CreatePost open={open} setOpen={setOpen} />
//     </div>
//   );
// };

// export default Navbar;

import React, { useState, useEffect } from "react";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  Moon,
  Sun,
} from "lucide-react"; // Importing icons
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Link } from "react-router-dom";
import profile from "../assets/profile.png";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [darkMode, setDarkMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const dispatch = useDispatch();

  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  const { messageNotification } = useSelector(
    (store) => store.realTimeNotification
  );

  // Check user's preference on page load
  useEffect(() => {
    const savedMode = localStorage.getItem("theme");
    if (savedMode === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle theme
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        localStorage.setItem("theme", "dark");
        document.documentElement.classList.add("dark");
      } else {
        localStorage.setItem("theme", "light");
        document.documentElement.classList.remove("dark");
      }
      return newMode;
    });
  };

  const navbarHandler = (textType) => {
    if (textType === "Create") setOpen(true);
    else if (textType === "Search") {
      setSearchOpen(true);
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chat");
    }
  };

  // Fetch users from the backend based on search query
  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length >= 1) {
      try {
        const res = await axios.get(`https://socially-ee6z.onrender.com/api/v1/user/search?query=${e.target.value}`);
        setSearchResults(res.data.users);
      } catch (error) {
        toast.error("Error fetching search results.");
      }
    } else {
      setSearchResults([]); // Clear suggestions if input length is < 3
    }
  };

  const navbarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={user?.profilePicture}
            className="object-cover w-8 h-8"
          />
          <AvatarFallback>
            <img src={profile} alt="" />
          </AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
  ];

  return (
    <div
      className={`fixed top-0 left-0 sm:left-0 sm:top-0 sm:w-64 sm:h-full sm:flex sm:flex-col sm:space-y-6 sm:shadow-md z-50 transition-colors duration-150 ease-in-out ${
        darkMode ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-800"
      }`}
    >
      <div className="h-full flex flex-col justify-between">


        {/* Desktop Navbar */}
        <div className="hidden sm:block flex-grow">
          <Link to="/">
            <div className="mt-5 mb-5">
              <span className="text-2xl flex items-center space-x-4 px-5 py-2 rounded-md font-bold cursor-pointer">
                Socially
              </span>
            </div>
          </Link>

          <div className="flex flex-col space-y-6">
            {navbarItems.map((item, index) => (
              <div
                onClick={() => navbarHandler(item.text)}
                key={index}
                className={`flex items-center space-x-2 px-5 py-5 rounded-lg cursor-pointer transition-all duration-300 hover:bg-slate-300 dark:hover:bg-slate-500`}
              >
                <div>{item.icon}</div>
                <span>{item.text}</span>

                {item.text === "Notifications" &&
                  likeNotification.length >= 0 && (
                    <Dialog>
                      <DialogTrigger asChild>
                        {likeNotification.length === 0 ? (
                          <Button
                            size="icon"
                            className="hidden rounded-full h-4 w-4 absolute top-2/4 left-8 bg-red-600 hover:bg-red-600"
                          >
                            {likeNotification.length}
                          </Button>
                        ) : (
                          <Button
                            size="icon"
                            className="rounded-full h-4 w-4 absolute top-2/4 left-8 bg-red-600 hover:bg-red-600"
                          >
                            {likeNotification.length}
                          </Button>
                        )}
                      </DialogTrigger>
                      <DialogContent className="w-auto">
                        <div className="p-2">
                          {likeNotification.length === 0 ? (
                            <p>No new Notifications</p>
                          ) : (
                            likeNotification.map((notification) => (
                              <div key={notification.userId} className="flex items-center gap-3 pb-3">
                                <Avatar>
                                  <AvatarImage
                                    src={notification.userDetails?.profilePicture}
                                    className="object-cover"
                                  />
                                  <AvatarFallback>
                                    <img src={profile} alt="" />
                                  </AvatarFallback>
                                </Avatar>
                                <p className="text-sm">
                                  <span className="font-bold">
                                    {notification.userDetails?.username}
                                  </span>{" "}
                                  liked your post
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
              </div>
            ))}

            {/* Dark Mode Toggle Button */}
            <div
              onClick={toggleDarkMode}
              className={`flex items-center space-x-2 px-5 py-2 rounded-lg cursor-pointer transition-all duration-300 hover:bg-slate-300 dark:hover:bg-slate-500`}
            >
              <div>{darkMode ? <Sun size={18} /> : <Moon size={18} />}</div>
              {darkMode ? <span>Light Mode</span> : <span>Dark Mode</span>}
            </div>
          </div>
        </div>

        {/* Bottom Navbar for Mobile */}
        <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-slate-800 shadow-lg z-10">
          <div className="flex justify-around items-center py-3 px-4">
            {navbarItems.map((item, index) => (
              <div
                onClick={() => navbarHandler(item.text)}
                key={index}
                className="flex flex-col items-center space-y-1 cursor-pointer transition-all duration-300 hover:bg-slate-300 dark:hover:bg-slate-500"
              >
                <div>{item.icon}</div>
                <span className="text-xs">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent>
          <DialogTitle>Search Users</DialogTitle>
          <input
            type="text"
            placeholder="Search users by name or username"
            value={searchQuery}
            onChange={handleSearch}
            className="border rounded p-2 w-full mb-4 bg-transparent"
          />
          <ul>
            {searchResults.map((suggestedUser) => (
              <li
                key={suggestedUser._id}
                onClick={() => {
                  navigate(`/profile/${suggestedUser._id}`);
                  setSearchOpen(false);
                }}
                className="py-2 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={suggestedUser?.profilePicture}
                      className="object-cover w-8 h-8"
                    />
                    <AvatarFallback>
                      <img src={profile} alt="" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{suggestedUser.name}</p>
                    <p className="text-sm text-light">
                      {suggestedUser.username}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>

      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default Navbar;
