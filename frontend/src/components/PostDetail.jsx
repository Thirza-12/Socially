import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const PostDetailPage = () => {
  const { id } = useParams();  // Extract 'id' from URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error("Post ID is missing.");
      return;
    }
    
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/post/${id}`);
        console.log(res);
        
        if (res.data.success) {
          setPost(res.data.post);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  if (!post) return <div>Post not found.</div>;

  return (
    <div className="post-detail">
      <h1>{post.caption}</h1>
      <img src={post.image} alt="Post Image" className="w-full" />
    </div>
  );
};

export default PostDetailPage;
