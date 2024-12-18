// import React from 'react'
// import Post from './Post'
// import { useSelector } from 'react-redux'

// const Posts = () => {
//   const {posts} = useSelector(store=>store.post);
//   console.log(posts);
//   return (
//     <div>
//         {
//             posts.map((post) => <Post key={post._id} post={post}/>)
//         }
//     </div>
//   )
// }

// export default Posts
import React from 'react';
import Post from './Post';
import { useSelector } from 'react-redux';

const Posts = () => {
  const { posts } = useSelector((store) => store.post);
  console.log(posts);

  // Filter out posts with null or undefined values and ensure the author is not null
  const validPosts = posts.filter(post => post != null && post.author != null);
  console.log(validPosts);

  return (
    <div>
      {validPosts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Posts;




