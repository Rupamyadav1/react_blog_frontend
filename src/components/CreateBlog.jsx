import React, { useEffect } from 'react'
import { useState } from 'react';
import Editor from 'react-simple-wysiwyg';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';


const CreateBlog = () => {
   const [blog,setBlog] = useState([]);
  const [html, setHtml] = useState();
  const [imageId, setImageId] = useState();

  const navgiate = useNavigate();

  function onChange(e) {
    setHtml(e.target.value);

  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();

    formData.append("image", file);

    const res = await fetch("http://localhost:8000/api/save-temp-image", {
      method: "POST",
      body: formData
    });
    const result = await res.json();
    if (result.status == false) {
      alert(result.errors.image);
      e.target.value = null;
    }
    setImageId(result.image.id);

    console.log(result);

  }

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const formSubmit = async (data) => {
    const newData = { ...data, 'description': html, 'image_id': imageId }

    console.log(newData);
    const res = await fetch("http://localhost:8000/api/blogs", {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(newData)
    });
    toast("Blog added successfully");
    navgiate('/');

    useEffect(()=>{
      fetchBlog();

    },[])


  }

  return (


    <div className='container'>
      <div className='d-flex justify-content-between pt-5 mb-4'>
        <h4>Create Blog</h4>
        <a href='/' className='btn btn-dark'>Back</a>

      </div>
      <div className='card border-0 shadow-lg'>
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className='card-body'>
            <div className='mb-3'>
              <label htmlFor='' className='form-label'>Title</label>
              <input {...register('title', { 'required': true })} type='text'
                className={`form-control ${errors.title && 'is-invalid'}`} placeholder='Title' />
              {errors.title && <p className='invalid-feedback'>Title field is required</p>}
            </div>


            <div className='mb-3'>
              <label htmlFor='' className='form-label'>Short Description</label>
              <textarea {...register('shortDesc')} cols="30" rows="5" className='form-control' />
            </div>

            <div className='mb-3'>
              <label htmlFor='' className='form-label'>Description</label>
              <Editor value={html} onChange={onChange} containerProps={{ style: { height: '400px' } }} />
            </div>

            <div className='mb-3'>
              <label htmlFor='' className='form-label'>Image</label>
              <input type='file' onChange={handleFileChange} /><br />

            </div>

            <div className='mb-3'>
              <label htmlFor='' className='form-label'>Author</label>
              <input {...register('author', { 'required': true })} type='text'
                className={`form-control ${errors.author && 'is-invalid'}`} placeholder='Author' />
              {errors.author && <p className='invalid-feedback'>Author field is required</p>}


            </div>
            <button className='btn btn-dark'>Create</button>


          </div>
        </form>

      </div>

    </div>
  )
}

export default CreateBlog