import {FaSearch} from "react-icons/fa"
import { Link } from "react-router-dom"
import React from 'react'
import { useSelector } from "react-redux"

const Header = () => {

  const {currentUser}= useSelector((state)=>state.user);
  return (
    <header className='bg-slate-200'>
        <div className='flex justify justify-between items'>
            <Link to="/">
            <h1 className='font-bold flex flex-wrap '>
            <span className='text-green-400'>Mycircle</span>
            <span className='text-slate-700'>Estate</span>
            </h1>
            </Link>
        
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
            <input type="text" placeholder="search....." className='bg-transparent focus:outline-none'/>
            <FaSearch className="text-slate-500"/>
        </form>
        <ul className="flex gap-4">
            <Link to="/">
            <li className="text-slate-600 hover:underline cursor-pointer">Home</li></Link>
           
            <Link to="/about">
            <li className="text-slate-600 hover:underline cursor-pointer">About</li></Link>
            
            <Link to= "/profile">
            {currentUser?(
              <img src={currentUser.avatar} alt="avatar" className=""/>
            ):(
              <li className="text-slate-600 hover:underline cursor-pointer">SignIn</li>
            )}
            </Link>
           
        </ul>
        </div>
    </header>
  )
}

export default Header
