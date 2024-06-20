import {set} from 'mongoose';
import React, { useState } from 'react';
import {Link, useNavigate} from "react-router-dom";
import Oauth from '../components/Oauth';



const Signup = () => {
  const [error , setError] = useState(null);
  const [loading, setLoading]= useState(false);
  const navigate= useNavigate();
    const [formData, setFormData] = useState({});

  const handlechange =(e)=>{
    setFormData({
     ...formData, [e.target.id]: e.target.value});
   console.log(formData)
  };
  const handlesubmit = async(e) => {
    e.preventDefault();
    try {
       const res= await fetch("/api/auth/signup",{
          method: "POST",
          headers:{
            "content-type":" application/json",
          },
          body: JSON.stringify(formData),
    });
    const data =await res.json();
    console.log(data);
    if (data.success==false){
        setLoading(false);
        setError(data.message);
        return;
    }
    setLoading(false);
    setError(null);
    navigate("/signin")
      
    } catch (error) {
      setLoading(false);
      setError(error.message);
      
    }
   
  }
  return (
    <div className='p-4 max-w-lg mx-auto'>
        <h1 className='text-2xl text-center font-semibold'>Signup</h1>
        <form onSubmit={handlesubmit} className='flex flex-col gap-5'>
        <input type='text' placeholder='Username' className='border p-2 rounded-lg' id="username"
        onChange={handlechange}/>
        <input type='e-mail' placeholder='E-mail' className='border p-2 rounded-lg' id="e-mail"
        onChange={handlechange}/>
        <input type='password' placeholder='Password' className='border p-2 rounded-lg' id="password" onChange={handlechange}/>
        <button className='bg-slate-600 text-white p-3 rounded-lg uppercase hover:opacity-70'>
          {loading? "Loading...":"SUBMIT"}</button><Oauth/>
        </form>
        <div>
          <p className=' p-2'>
            Already have an account?
          </p>
          <Link to={"/signin"}>
          <span className='text-blue-500 font-semibold cursor-pointer hover: opacity-70 border p-2 rounded-lg bg-slate-100'>Sign-In</span>
        </Link>
        </div>
        {error && <p className='text-red-500 m'>{error}</p>}
    </div>
  )
}

export default Signup
