import React, { useEffect, useState } from 'react';
import BlogCard from './BlogCard';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [keyword, setKeyword] = useState('');

  const fetchBlogs = async () => {
    const res = await fetch("http://localhost:8000/api/blogs");
    const result = await res.json();
    setBlogs(result.data);
    console.log(result);
  };

  const searchBlogs = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:8000/api/blogs?keyword=${keyword}`);
    const result = await res.json();
    setBlogs(result.data);
  };

  const resetSearch=()=>{
    fetchBlogs();
    setKeyword('');
  }

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className='container'>
      <div className='d-flex  align-items-center pt-4 mb-4'>
        <form onSubmit={searchBlogs} className='d-flex'>
          <input
            type='text'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className='form-control me-2'
            placeholder='Search Blogs'
          />
          <button className='ms-2 btn btn-dark'>Search</button>
        </form>
          <button onClick={()=>resetSearch()} className='ms-2 btn btn-success'>Reset</button>
        <a href='/create' className='ms-2 btn btn-primary'>Create</a>
      </div>
      <div className='row'>
        {blogs && blogs.map((blog) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            blogs={blogs}
            setBlogs={setBlogs}
          />
        ))}
      </div>
    </div>
  );
};

export default Blogs;
