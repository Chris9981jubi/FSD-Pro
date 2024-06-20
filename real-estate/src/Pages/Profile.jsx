import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage"
import app from '../firebase';

const Profile = () => {
  const fileRef= useRef(null);
  const[file, setFile]= useState(undefined);
  const currentUser = useSelector((state)=>state.user);
  const [ filePerc, setFilePerc]= useState(0);
  const [fileUploadError, setFileUploadError]= useState(false);
  const [formData , setFormData]= useState({});


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
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className='flex flex-col gap-4'>
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
       <input type="text" placeholder='username' defaultValue={currentUser.username} id="username" className='border p-3 rounded-lg w-45 mx-auto'></input>
      <input type="text" placeholder='email' defaultValue={currentUser.username} id="e-mail" className='border p-3 rounded-lg w-45 mx-auto'></input>
      <input type="text" placeholder='password' defaultValue={currentUser.username} id="password" className='border p-3 rounded-lg w-45 mx-auto'></input>
      <button className='bg-slate-700 mx-auto text-white rounded-lg p-3 text-center hover: opacity-95'>SUBMIT
      </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>SignOut</span>
      </div>
     
    </div>
  )
}

export default Profile
