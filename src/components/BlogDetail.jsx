import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BlogDetail = () => {
  const [blog, setBlog] = useState({});
  const { id } = useParams();

  const fetchBlog = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/blog/${id}`);
      const result = await res.json();
      setBlog(result.data);
      console.log("result", result);
    } catch (error) {
      console.error("Failed to fetch blog:", error);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  return (
    <div className='container'>
      <div className='d-flex justify-content-between pt-4 mb-4'>
        <h4>{blog.title}</h4>
        <a href='/' className='btn btn-dark'>Back to blogs</a>
      </div>
      <div className='row'>
        <div className='col-md-12'>
          <p>by <strong>{blog.author}</strong> on {blog.date}</p>
          {blog.image && (
            <img
              className='w-100 mb-3'
              src={`http://localhost:8000/uploads/blogs/${blog.image}`}
              alt={blog.title}
            />
          )}
          <div dangerouslySetInnerHTML={{ __html: blog.description }} />
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
