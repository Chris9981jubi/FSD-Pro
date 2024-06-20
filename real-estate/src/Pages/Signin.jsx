import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userslice';
import Oauth from '../components/Oauth';

const Signin = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData, [e.target.id]: e.target.value
    });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data.user));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='p-4 max-w-lg mx-auto'>
      <h1 className='text-2xl text-center font-semibold'>Sign-In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
        <input type='email' placeholder='Email' className='border p-2 rounded-lg' id="email" onChange={handleChange} />
        <input type='password' placeholder='Password' className='border p-2 rounded-lg' id="password" onChange={handleChange} />
        <button className='bg-slate-600 text-white p-3 rounded-lg uppercase hover:opacity-70'>
          {loading ? "Loading..." : "SUBMIT"}
        </button>
        <Oauth/>
      </form>
      <div>
        <p className='p-2'>
          Don't have an account?
        </p>
        <Link to={"/signup"}>
          <span className='text-blue-500 font-semibold cursor-pointer hover:opacity-70 border p-2 rounded-lg bg-slate-100'>Sign-Up</span>
        </Link>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  );
};

export default Signin;
