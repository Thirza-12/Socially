import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleMoreIcon } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';
import profile from '../assets/profile.png';
import { useParams, useNavigate } from 'react-router-dom'; // Import necessary hooks
import { Link } from 'react-router-dom';
const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
  const { onlineUsers, messages } = useSelector(store => store.chat);
  const dispatch = useDispatch();
  const { id } = useParams(); // Extract the user ID from the URL
  const navigate = useNavigate(); // For navigation
  
  // Function to send a message
  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(`http://localhost:8000/api/v1/message/send/${receiverId}`, { textMessage }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Reset selectedUser when there is no userId in the URL
  useEffect(() => {
    if (!id) {
      dispatch(setSelectedUser(null)); // Clear selected user when at /chat
    } else {
      // If there's an ID in the URL, find the selected user and set it
      const foundUser = suggestedUsers.find(user => user._id === id);
      if (foundUser) {
        dispatch(setSelectedUser(foundUser)); // Set the selected user
      } else {
        navigate('/chat'); // Redirect if no user with that ID
      }
    }
  }, [id, suggestedUsers, navigate, dispatch]);

  return (
<div className='flex ml-0  sm:ml-[18%] h-[98vh]'>
  {/* Suggested Users List (Hidden on small screens when a user is selected) */}
  <section className={`w-full md:w-1/4 my-8 ${selectedUser ? 'hidden sm:block' : ''}`}>
    <h1 className='font-bold mb-4 px-3 text-xl'>{user?.username}</h1>
    <hr className='mb-4 border-gray-300' />
    <div className='overflow-y-auto h-[80vh]'>
      {
        suggestedUsers.map((suggestedUser) => {
          const isOnline = onlineUsers.includes(suggestedUser?._id);
          return (
            <Link 
              key={suggestedUser?._id} 
              to={`/chat/${suggestedUser?._id}`} // Navigate to /chat/:id
              className='bg-transparent flex gap-3 items-center p-3 hover:bg-[#f5f5f5] dark:hover:bg-[#2c2c2c] cursor-pointer'
            >
              <Avatar className='w-14 h-14'>
                <AvatarImage src={suggestedUser?.profilePicture} className='object-cover' />
                <AvatarFallback><img src={profile} alt="" /></AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <span className='font-medium'>{suggestedUser?.username}</span>
                <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'} `}>{isOnline ? 'online' : 'offline'}</span>
              </div>
            </Link>
          );
        })
      }
    </div>
  </section>

  {/* Chat Section */}
  {selectedUser ? (
    <section className='flex-1 border-l border-l-gray-300 flex flex-col h-full'>
      <div className='flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-transparent z-10'>
        <Avatar>
          <AvatarImage src={selectedUser?.profilePicture} alt='profile' className='object-cover' />
          <AvatarFallback><img src={profile} alt="" /></AvatarFallback>
        </Avatar>
        <div className='flex flex-col'>
          <span>{selectedUser?.username}</span>
        </div>
      </div>
      <Messages selectedUser={selectedUser} />
      <div 
  className='flex items-center p-4 border-t border-t-gray-300 fixed bottom-18 left-0 w-full bg-transparent dark:bg-slate-800 sm:relative sm:bottom-0'
>
  <Input 
    value={textMessage} 
    onChange={(e) => setTextMessage(e.target.value)} 
    type="text" 
    className='flex-1 mr-2 focus-visible:ring-transparent' 
    placeholder="Messages..." 
  />
  <Button onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button>
</div>

    </section>
  ) : (
    <div className=' sm:flex   w-full hidden flex-col items-center justify-center mx-auto'>
      <MessageCircleMoreIcon className='w-32 h-32 my-4' />
      <h1 className='font-medium'>Your messages</h1>
      <span>Send a message to start a chat.</span>
    </div>
  )}

</div>


  );
}

export default ChatPage;
