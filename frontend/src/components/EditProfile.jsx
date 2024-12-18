// import React, { useRef, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
// import { Button } from './ui/button';
// import { Textarea } from './ui/textarea';
// import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// import axios from 'axios';
// import { Loader2 } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import { setAuthUser } from '@/redux/authSlice';

// const EditProfile = () => {
//     const imageRef = useRef();
//     const { user } = useSelector(store => store.auth);
//     const [loading, setLoading] = useState(false);
//     const [input, setInput] = useState({
//         profilePhoto: user?.profilePicture,
//         bio: user?.bio,
//         gender: user?.gender
//     });
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     const fileChangeHandler = (e) => {
//         const file = e.target.files?.[0];
//         if (file) setInput({ ...input, profilePhoto: file });
//     }

//     const selectChangeHandler = (value) => {
//         setInput({ ...input, gender: value });
//     }


//     const editProfileHandler = async () => {
//         console.log(input);
//         const formData = new FormData();
//         formData.append("bio", input?.bio);
//         formData.append("gender", input?.gender);
//         if(input.profilePhoto){
//             formData.append("profilePhoto", input?.profilePhoto);
//         }
//         try {
//             setLoading(true);
//             const res = await axios.post('http://localhost:8000/api/v1/user/profile/edit', formData,{
//                 headers:{
//                     'Content-Type':'multipart/form-data'
//                 },
//                 withCredentials:true
//             });
//             if(res.data.success){
//                 const updatedUserData = {
//                     ...user,
//                     bio:res.data.user?.bio,
//                     profilePicture:res.data.user?.profilePicture,
//                     gender:res.data.user.gender
//                 };
//                 dispatch(setAuthUser(updatedUserData));
//                 navigate(`/profile/${user?._id}`);
//                 toast.success(res.data.message);
//             }

//         } catch (error) {
//             console.log(error);
//             toast.error(error.response.data.messasge);
//         } finally{
//             setLoading(false);
//         }
//     }
//     return (
//         <div className='flex max-w-2xl mx-auto pl-10'>
//             <section className='flex flex-col gap-6 w-full my-8'>
//                 <h1 className='font-bold text-xl'>Edit Profile</h1>
//                 <div className='flex items-center justify-between  rounded-xl p-4'>
//                     <div className='flex items-center gap-3'>
//                         <Avatar>
//                             <AvatarImage src={user?.profilePicture} alt="post_image" />
//                             <AvatarFallback>CN</AvatarFallback>
//                         </Avatar>
//                         <div>
//                             <h1 className='font-bold text-sm'>{user?.username}</h1>
//                             <span className='text-gray-600'>{user?.bio || 'Bio here...'}</span>
//                         </div>
//                     </div>
//                     <input ref={imageRef} onChange={fileChangeHandler} type='file' className='hidden' />
//                     <Button onClick={() => imageRef?.current.click()} className='bg-[#0095F6] h-8 hover:bg-[#318bc7]'>Change photo</Button>
//                 </div>
//                 <div>
//                     <h1 className='font-bold text-xl mb-2'>Bio</h1>
//                     <Textarea value={input.bio} onChange={(e) => setInput({ ...input, bio: e.target.value })} name='bio' className="focus-visible:ring-transparent" />
//                 </div>
//                 <div>
//                     <h1 className='font-bold mb-2'>Gender</h1>
//                     <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
//                         <SelectTrigger className="w-full">
//                             <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectGroup>
//                                 <SelectItem value="Male">Male</SelectItem>
//                                 <SelectItem value="Female">Female</SelectItem>
//                             </SelectGroup>
//                         </SelectContent>
//                     </Select>
//                 </div>
//                 <div className='flex justify-end'>
//                     {
//                         loading ? (
//                             <Button className='w-fit bg-[#0095F6] hover:bg-[#2a8ccd]'>
//                                 <Loader2 className='mr-2 h-4 w-4 animate-spin' />
//                                 Please wait
//                             </Button>
//                         ) : (
//                             <Button onClick={editProfileHandler} className='w-fit bg-[#0095F6] hover:bg-[#2a8ccd]'>Submit</Button>
//                         )
//                     }
//                 </div>
//             </section>
//         </div>
//     )
// }

// export default EditProfile



import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { DialogHeader } from './ui/dialog';
import profile from '../assets/profile.png'
const EditProfile = () => {
    const imageRef = useRef();
    const { user } = useSelector((store) => store.auth);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null); // For dialog preview
    const [dialogOpen, setDialogOpen] = useState(false);
    const [input, setInput] = useState({
        profilePhoto: user?.profilePicture, // Local state for the page
        bio: user?.bio,
        gender: user?.gender,
        name: user?.name
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file)); // Set preview for dialog
            setDialogOpen(true); // Open dialog for confirmation
        }
    };

    const confirmImageHandler = () => {
        // Update the profile photo locally on the Edit Profile page
        setInput({ ...input, profilePhoto: imagePreview });
        setDialogOpen(false); // Close dialog
    };

    const cancelImageHandler = () => {
        // Discard the preview and close the dialog
        setImagePreview(null);
        setDialogOpen(false);
    };

    const selectChangeHandler = (value) => {
        setInput({ ...input, gender: value });
    };

    const editProfileHandler = async () => {
        const formData = new FormData();
        formData.append('bio', input?.bio);
        formData.append('gender', input?.gender);
        formData.append('name', input?.name);
        // If a new file is selected, append it
        if (imageRef.current?.files[0]) {
            formData.append('profilePhoto', imageRef.current.files[0]);
        }

        try {
            setLoading(true);
            const res = await axios.post(
                'http://localhost:8000/api/v1/user/profile/edit',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                const updatedUserData = {
                    ...user,
                    bio: res.data.user?.bio,
                    profilePicture: res.data.user?.profilePicture, // Update with backend URL
                    gender: res.data.user?.gender,
                    name: res.data.user?.name
                };
                dispatch(setAuthUser(updatedUserData)); // Update Redux state
                navigate(`/profile/${user?._id}`);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex max-w-2xl mx-auto pl-10">
            <section className="flex flex-col gap-6 w-full my-8">
                <h1 className="font-bold text-xl">Edit Profile</h1>
                <div className="flex items-center justify-between rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Avatar className='w-[80px] h-[80px]'>
                            <AvatarImage
                                src={input.profilePhoto} // Display local state
                                alt="profile_image"
                                className='object-cover h-full w-full rounded-full'
                            />
                            <AvatarFallback><img src={profile} alt="" className='object-cover'/></AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="font-bold text-lg">{user?.username}</h1>
                            <h1 className='font-semibold text-md '>{user?.name}</h1>
                            <span className="font-light text-sm">{user?.bio}</span>
                        </div>
                    </div>
                    <input ref={imageRef} onChange={fileChangeHandler} type="file" className="hidden" />
                    <Button
                        onClick={() => imageRef?.current.click()}
                        className="bg-slate-700 h-8 hover:bg-slate-800"
                    >
                        Change photo
                    </Button>
                </div>
                <div>
                    <h1 className="font-bold text-xl mb-2">Name</h1>
                    <Textarea
                        value={input.name}
                        onChange={(e) => setInput({ ...input, name: e.target.value })}
                        name="name"
                        className="focus-visible:ring-transparent"
                    />
                </div>
                <div>
                    <h1 className="font-bold text-xl mb-2">Bio</h1>
                    <Textarea
                        value={input.bio}
                        onChange={(e) => setInput({ ...input, bio: e.target.value })}
                        name="bio"
                        className="focus-visible:ring-transparent"
                    />
                </div>
                <div>
                    <h1 className="font-bold mb-2">Gender</h1>
                    <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex justify-end">
                    {loading ? (
                        <Button className="w-fit bg-slate-600 hover:bg-slate-700">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </Button>
                    ) : (
                        <Button onClick={editProfileHandler} className="w-fit bg-slate-700 hover:bg-slate-800">
                            Edit
                        </Button>
                    )}
                </div>
            </section>

            {/* Dialog for Image Preview */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Set Profile Photo</DialogTitle>
                    </DialogHeader>
                    {imagePreview && <img src={imagePreview} alt="Profile Preview" className="object-cover rounded-lg max-h-96 mx-auto" />}
                    <div className="flex justify-end gap-4 mt-4">
                        <Button
                            variant="ghost"
                            onClick={cancelImageHandler}
                            className="bg-gray-500 hover:bg-gray-500 text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={confirmImageHandler}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
export default EditProfile





