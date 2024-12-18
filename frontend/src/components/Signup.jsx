// import React, { useState } from "react";
// import { Input } from "./ui/input";
// import { Label } from "./ui/label";
// import { Button } from "./ui/button";
// import axios from "axios";
// import { toast } from "sonner";
// import { Link, useNavigate } from "react-router-dom";
// import { Loader2 } from "lucide-react";

// const Signup = () => {
//   const [input, setInput] = useState({
//     username: "",
//     email: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const navigate=useNavigate();
//   const changeEventHandler = (e) => {
//     setInput({ ...input, [e.target.name]: e.target.value });
//   };
//   const signUpHandler = async (e) => {
//     e.preventDefault();
//     console.log(input);
//     try {
//       setLoading(true);
//       const res = await axios.post(
//         "http://localhost:8000/api/v1/user/register",
//         input,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//           withCredentials: true,
//         }
//       );
//       if (res.data.success) {
//         navigate("/login")
//         toast.success(res.data.message);
//         setInput({
//           username: "",
//           email: "",
//           password: "",
//         });
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.response.data.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div className="flex items-center w-screen h-screen justify-center bg-slate-700">
//       <form
//         onSubmit={signUpHandler}
//         className="shadow-lg flex flex-col gap-5 p-8 bg-slate-100 rounded-md"
//       >
//         <div>
//           <h1 className="text-center font-bold text-xl mb-5">SIGNUP TO SOCIALLY</h1>
//           <p className="text-sm text-center">
//             Sign up to see updates from your family & friends
//           </p>
//         </div>
//         <div>
//           <Label>Username</Label>
//           <Input
//             type="text"
//             name="username"
//             value={input.username}
//             onChange={changeEventHandler}
//             className="focus-visible:ring-transparent my-2 bg-slate-200"
//           />
//         </div>
//         <div>
//           <Label>Email</Label>
//           <Input
//             type="email"
//             name="email"
//             value={input.email}
//             onChange={changeEventHandler}
//             className="focus-visible:ring-transparent my-2 bg-slate-200"
//           />
//         </div>
//         <div>
//           <Label>Password</Label>
//           <Input
//             type="password"
//             name="password"
//             value={input.password}
//             onChange={changeEventHandler}
//             className="focus-visible:ring-transparent my-2 bg-slate-200"
//           />
//         </div>
//         {
//             loading?(
//                 <Button>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
//                     Please wait
//                 </Button>
//             ):(
//                 <Button type="submit">Signup</Button>
//             )
//         }
//         <span className="text-center">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></span>
//       </form>
//     </div>
//   );
// };

// export default Signup;

import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {user}=useSelector(store=>store.auth);
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  
  const signUpHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
        setInput({
          username: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=>{
    if(user){
      navigate("/");
    }
  },[])
  return (
    <div
  className="flex items-center justify-center w-full h-screen"
  style={{
    backgroundImage: "url('/bg-img.avif')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backdropFilter: "blur(10px)", 
  }}
>
<div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      <form
        onSubmit={signUpHandler}
        className="relative bg-white p-8 rounded-lg shadow-xl w-full sm:w-96 max-w-md"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-5">Sign Up to Socially</h1>
          <p className="text-sm text-gray-600">Sign up to see updates from your family & friends</p>
        </div>
        
        <div className="mb-4">
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            name="username"
            id="username"
            value={input.username}
            onChange={changeEventHandler}
            className="w-full px-4 py-2 mt-2 bg-gray-200 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            value={input.email}
            onChange={changeEventHandler}
            className="w-full px-4 py-2 mt-2 bg-gray-200 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          />
        </div>
        
        <div className="mb-6">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            value={input.password}
            onChange={changeEventHandler}
            className="w-full px-4 py-2 mt-2 bg-gray-200 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          />
        </div>

        <div className="mb-6 text-center">
          {
            loading ? (
              <Button className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full">Sign Up</Button>
            )
          }
        </div>

        <div className="text-center">
          <span className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 transition duration-200">Login</Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Signup;
