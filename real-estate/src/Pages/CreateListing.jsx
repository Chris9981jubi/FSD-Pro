import {useState, useRef} from 'react'
import {getDownloadURL, getStorage, uploadBytesResumable,ref} from 'firebase/storage';
import app from "../firebase.js"
import {current} from "@reduxjs/toolkit"
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Createlisting = () => {
    const [files,setFiles]=useState([]);
    const [formData, setFormData]=useState({
        imageUrls:[],
        name:"",
        description:"",
        address:"",
        type:"rent",
        bedrooms:1,
        bathrooms:1,
        regularprice:50,
        discountedprice:0,
        offer:false,
        parkingspot:false,
        furnished: false,
    });
    const [imageUploadError, setImageUploadError]= useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError]= useState(false);
    const [loading, setLoading]=useState(false);
    const currentUser = useSelector((state)=>state.user);
    const navigate=useNavigate()
   
    const handleImageSubmit =()=>{
        if(files.length>0 && files.length<5){
            setUploading(true);
            setImageUploadError(false)
            const promises = [];
        
        for(let i=0; i<files.length; i++){
            promises.push(storeImage(files[i]));
        } 
        Promise.all(promises)
        .then((urls)=>{
            setFormData({
                ...formData,
                imageUrls:formData.imageUrls.concat(urls),
            });
            setImageUploadError(false);
           setUploading(false)
        }) 
        .catch((err)=>{
            setImageUploadError("Image Upload Failed" )
                setUploading(false);
           
        });
    }else{
       setImageUploadError("Please select on five images");
       setUploading(false)
    }
    };
    const storeImage= async(file)=>{
        return new Promise((resolve, reject)=>{
            const storage=getStorage(app);
            const fileName= new Date(). getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot)=>{
                    const progress =
                    (snapshot.bytesTransferred/snapshot.totalBytes)*100;
                    console.log(`upload is ${progress}% done`);
                },
                (error) =>{
                    reject(error);
                } ,
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                        resolve(downloadURL);
                    });
                })
        });
    }
    const handleChange=(e)=>{
        if(e.target.id === "sale" || e.target.id==="rent"){
            setFormData({
                ...formData,
                type: e.target.id,
            });
        }else{
            setFormData({
                ...formData,
                    [e.target.id]: e.target.checked,
            });
        }
        if (e.target.id==="parking"|| e.target.id==="furnished" || e.target.id==="offer"){
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            });
        }
        if (e.target.id==="number"|| e.target.id==="text" || e.target.id==="textarea"){
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            });
        
        }
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            if(formData.imageUrls.length<1)return setError("atleast 1 image is required");
            setLoading(true);
            setError(false);

            const res = await fetch("/api/listing/create",{
                method: "POST",
                headers:{
                    "content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });
            const data = await res.json();
            setLoading(false);
            if(data.success === false){
                setError(data.message);
                return;
            }
            navigate(`/listing/${data._id}`)
        }catch(error){
            setError(error.message);
            setLoading(false);
        }

    }
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Create Listing</h1>
      <form onSubmit={handleSubmit}className="flex flex-col sm:flex-row gap-8 justify-between">
        <div className="p-4 w-full sm:w-1/2">
        
          <div className="flex flex-col gap-4 mb-4">
            <input
              type="text"
              placeholder="Name"
              className="border p-2 rounded-lg w-full"
              id="name"
              required
              onChange={handleChange}
              value={formData.name}
            />
            <textarea
              type="text"
              placeholder="Description"
              className="border p-2 rounded-lg w-full"
              id="description"
              required
              onChange={handleChange}
              value={formData.description}
            />
            <input
              type="text"
              placeholder="Address"
              id="address"
              className="border p-2 rounded-lg w-full"
              required
              onChange={handleChange}
              value={formData.address}
            />
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type==="sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type==="rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="parkingspot"
                className="w-5"
                onChange={handleChange}
                checked={formData.parkingspot}
              />
              <span>Parking-spot</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className='flex flex-wrap gap-6 mb-4'>
            <div className='flex items-center gap-2'>
                <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}/>
                
                <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
                <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}/>
                <div className='flex flex-col items-center'>
                <p>Bathrooms</p>
                </div>
            </div>
            <div className='flex items-center gap-2'>
                <input
                type="number"
                id="regularprice"
                min="50"
                max="10000000"
                required
                className="p-3 border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularprice}/>
                <div className='flex flex-col items-center'>
                <p>Regular-price</p>
                </div>
            </div>
            <div className='flex items-center gap-2'>
                <input
                type="number"
                id="discountedprice"
                min="0"
                max="5000000"
                required
                className="p-3 border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.discountedprice}/>
                <p>Discounted-Price</p>
            </div>
          </div>
        </div>

        <div className="p-4 w-full sm:w-1/2 flex flex-col items-center gap-4">
            <p className="font-semibold">
              Images:
              <span className="font-normal text-gray-500"> First image is the Cover</span>
            </p>
            <div className="flex flex-col items-center gap-4">
                <input
                onChange={(e)=>setFiles(e.target.files)}
                className="p-3 border border-gray-300 rounded-lg"
                type="file"
                id="images"
                accept="image/*"
                multiple
                />
                <button
                onClick={handleImageSubmit}
                type="button"
                className="p-3 text-blue-800 border border-blue-800 rounded-lg">
                  UPLOAD
                </button>
                </div>
                <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
                {formData.imageUrls.length> 0&&
                formData.imageUrls.map((url, index)=>(
                    <div key={url}  className="">
                        <img src={url} alt="listing images" className=''/>
                    </div>
                ))}
                <button className="p-3 bg-slate-700 text-white rounded-lg">CREATE LISTING</button>
           
        </div>
      </form>
    </main>
  );
}

export default Createlisting;
