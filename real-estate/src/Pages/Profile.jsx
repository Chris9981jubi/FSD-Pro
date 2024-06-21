import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage"
import app from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserFailure, deleteUserSuccess, signOutUserStart, signOutUserFailure, signOutUserSuccess } from '../redux/user/userslice';
import { useDispatch } from 'react-redux';
import {Link} from "react-router-dom";

const Profile = () => {
  const fileRef= useRef(null);
  const[file, setFile]= useState(undefined);
  const currentUser = useSelector((state)=>state.user);
  const [ filePerc, setFilePerc]= useState(0);
  const [fileUploadError, setFileUploadError]= useState(false);
  const [formData , setFormData]= useState({});
  const [showListingsErrors, setShowListingsErrors]=useState(false);
  const [userListings , setUserListings]=useState([]);
  const dispatch = useDispatch();

  console.log(formData)

  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload =(file)=>{
    const storage = getStorage(app);
    const fileName = new Date().getTime()+ file.name;
    const storageRef = ref (storage, fileName);

    const uploadTask= uploadBytesResumable(storageRef, file);

    
    uploadTask.on(
      'state_changed',
      (snapshot)=>{
        const progress =(snapshot.bytesTransferred/ snapshot.totalBytes)*100;
        setFilePerc(Math.round(progress));
      },
      (error)=>{
        setFileUploadError(error);
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
          setFormData({...FormData, avatar: downloadURL})
        })
      }
    )
  };
  const handleChange= (e)=>{
    setFormData({...formData, [e.target.id]:e.target.value})
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try{
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method: 'POST',
        headers:{
          "content-Type":"application/json",
        },
        body:JSON.stringify(formData),
      });
      const data= await res.json();
      if(data.success===false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess:(true);
    }catch(error){

    }
  };
  const handleDeleteUser= async()=>{
    try{
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',

      });
      const data= await res.json();
      if(data.success===false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));

    }catch(error){
      dispatch(deleteUserFailure (error.message))
    }
  };
  const handleSignoutUser= async()=>{
    try{
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      if (data.success === false){
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    }catch(error){
      dispatch(signOutUserSuccess(data));
    }
  };
  const handleShowListings= async()=>{
    try{
      setShowListingsErrors(false);
      const res= await fetch(`/api/user/listings/${currentUser._id}`);
      const data= await ref.json();
       if(data.success === false){
        setShowListingsErrors(true);
        return;
       }
       setUserListings(data)

    }catch(error){
      setShowListingsErrors(true)
    }

  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
        onChange={(e)=> setFile(e.target.files[0])}
        type="file"
        ref={fileRef}
        hidden
        accept='image/*' />
      <img
      onClick={()=>fileRef.current.click()}
      src={"https://static-00.iconduck.com/assets.00/profile-circle-icon-512x512-zxne30hp.png" || formData.avatar} alt='avatar' className='rounded-full h-24 w-24 object-cover mx-auto '></img>
      <p className='text-sm self-center'>{fileUploadError ? (
        <span>Error! (image must be less than 2mb)</span>
      ): filePerc> 0 && filePerc<100?(
        <span>{`uploading ${filePerc}%`}</span>
      ): filePerc ===100?(
        <span>Image Succesfully uploaded</span>
      ):(
        ''
      )}</p>
       <input type="text" placeholder='username' defaultValue={currentUser.username} onChange={handleChange} id="username" className='border p-3 rounded-lg w-45 mx-auto'></input>
      <input type="text" placeholder='email' defaultValue={currentUser.email} onChange={handleChange} id="e-mail" className='border p-3 rounded-lg w-45 mx-auto'></input>
      <input type="text" placeholder='password'id="password" onChange={handleChange} className='border p-3 rounded-lg w-45 mx-auto'></input>
      <button className='bg-slate-700 mx-auto text-white rounded-lg p-3 text-center hover: opacity-95'>UPDATE
      </button>
      <Link className = "bg-blue-700 mx-auto rounded-lg p-3 text-white hover:opacity-95"to={"/create-listing"}>
      create Listing
      </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser}className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignoutUser}className='text-red-700 cursor-pointer'>SignOut</span>

        <button onClick={handleShowListings} className='text-blue-800'>SHOW LISTINGS</button>
        <p className={showListingsErrors ? "ERROR ACCESSING LISTINGS":""}></p>
      </div>
     
    </div>
  )
}

export default Profile
