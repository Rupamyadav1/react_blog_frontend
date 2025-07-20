import React, { useEffect, useState } from 'react';
import Editor from 'react-simple-wysiwyg';
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const[blog,setBlog]=useState([]);
  const [html, setHtml] = useState('');
  const [imageId, setImageId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch existing blog data
  const fetchBlog = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/blog/${id}`);
      const result = await res.json();

      if (result.status === true) {
        const blog = result.data;
        reset({
          title: blog.title,
          shortDesc: blog.shortDesc,
          author: blog.author
        });
        setBlog(result.data);
        setHtml(blog.description);
        setImageId(blog.image_id); // Preserve existing image
      }
    } catch (error) {
      console.error("Error fetching blog", error);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  const onChange = (e) => {
    setHtml(e.target.value);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:8000/api/save-temp-image", {
        method: "POST",
        body: formData
      });
      const result = await res.json();

      if (result.status === false) {
        alert(result.errors.image);
        e.target.value = null;
      } else {
        setImageId(result.image.id);
        console.log("Image uploaded", result);
      }
    } catch (error) {
      console.error("Image upload failed", error);
    }
  };

  const formSubmit = async (data) => {
    const updatedData = {
      ...data,
      description: html,
      image_id: imageId
    };

    try {
      const res = await fetch(`http://localhost:8000/api/blog/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      const responseData = await res.json();

      if (responseData.status === true) {
        toast.success("Blog updated successfully");
        navigate('/');
      } else {
        toast.error("Something went wrong");
      }

    } catch (error) {
      console.error("Error updating blog", error);
      toast.error("An error occurred");
    }
  };

  return (
    <div className='container mb-5'>
      <div className='d-flex justify-content-between pt-5 mb-4'>
        <h4>Edit Blog</h4>
        <a href='/' className='btn btn-dark'>Back</a>
      </div>
      <div className='card border-0 shadow-lg'>
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className='card-body'>
            <div className='mb-3'>
              <label className='form-label'>Title</label>
              <input {...register('title', { required: true })} type='text'
                className={`form-control ${errors.title && 'is-invalid'}`} placeholder='Title' />
              {errors.title && <p className='invalid-feedback'>Title field is required</p>}
            </div>

            <div className='mb-3'>
              <label className='form-label'>Short Description</label>
              <textarea {...register('shortDesc')} cols="30" rows="5" className='form-control' />
            </div>

            <div className='mb-3'>
              <label className='form-label'>Description</label>
              <Editor value={html} onChange={onChange} containerProps={{ style: { height: '400px' } }} />
            </div>

            <div className='mb-3'>
              <label className='form-label'>Image</label>
              <input type='file' onChange={handleFileChange} />
              <div>
               {
                (blog.image) && <img className='mt-3 w-50' src={`http://localhost:8000/uploads/blogs/${blog.image}`} alt='blog image' />
            }</div>
            </div>

            <div className='mb-3'>
              <label className='form-label'>Author</label>
              <input {...register('author', { required: true })} type='text'
                className={`form-control ${errors.author && 'is-invalid'}`} placeholder='Author' />
              {errors.author && <p className='invalid-feedback'>Author field is required</p>}
            </div>

            <div className='text-end'>
              <button className='btn btn-dark'>Update</button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditBlog;
