import React from 'react'
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth"
import app from '../firebase';
import { useDispatch} from 'react-redux';
import { signInSuccess } from '../redux/user/userslice';
import { useNavigate } from 'react-router-dom';

const Oauth = () => {
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const handleGoogleCLick= async()=>{
        try {
            const provider = new GoogleAuthProvider();
            const auth= getAuth(app);

            const result = await signInWithPopup(auth, provider);

            const res = await fetch ("/api/auth/google",{
                method: 'Post',
                headers:{
                    "Content-type":"application/json",
                },
                body: JSON.stringify({
                    name:result.user.displayName,
                    email: result.user.email,
                    photo:result.user.photoURL,
                }),

           });
            const data = await res.json();
            console.log(data)
          dispatch(signInSuccess(data));
          navigate("/")
            
        } catch (error) {
            console.log('Could not signIn with google', error)  
        }
        
    };
  return (
    <button type= "button" className='bg-green-700 rounded-lg p-3 uppercase hover:opacity-80'>
      continue with google
    </button>
  )
}

export default Oauth
