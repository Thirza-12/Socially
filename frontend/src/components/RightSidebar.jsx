import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';
import profilephoto from '../assets/profile.png'
const RightSidebar = () => {
  const { user } = useSelector(store => store.auth);
  return (
    // <div className='w-1/4 my-10 pr-32'>
    //   <div className='flex items-center gap-2 '>
    //     <Link to={`/profile/${user?._id}`}>
    //       <Avatar>
    //         <AvatarImage src={user?.profilePicture} alt="post_image" className='object-cover' />
    //         <AvatarFallback><img src={profilephoto} alt="" /></AvatarFallback>
    //       </Avatar>
    //     </Link>
    //     <div className='flex flex-col justify-center'>
    //       <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
    //       <span className='text-gray-500 text-sm'>{user?.bio}</span>
    //     </div>
    //   </div>
    //   <SuggestedUsers/>
    // </div>
<div className='w-full sm:w-1/4 my-10 pr-32 hidden sm:block'>
  <div className='flex items-center gap-2'>
    <Link to={`/profile/${user?._id}`}>
      <Avatar>
        <AvatarImage src={user?.profilePicture} alt="post_image" className='object-cover' />
        <AvatarFallback><img src={profilephoto} alt="" /></AvatarFallback>
      </Avatar>
    </Link>
    <div className='flex flex-col justify-center'>
      <h1 className='font-semibold text-sm'>
        <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
      </h1>
      <span className='text-gray-500 text-sm'>{user?.bio}</span>
    </div>
  </div>

  <SuggestedUsers />
</div>


  )
}

export default RightSidebar