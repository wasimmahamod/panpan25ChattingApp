import React, { useState } from 'react';
import {FaCloudUploadAlt} from 'react-icons/fa'
import {AiOutlineHome,AiOutlineSetting} from 'react-icons/ai'
import {BiMessageSquareDetail} from 'react-icons/bi'
import {BsBell} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import { getAuth, signOut,updateProfile } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch ,useSelector} from 'react-redux';
import {userLoginInfo} from '../slices/userSlice';
import { getStorage, ref ,uploadString,getDownloadURL  } from "firebase/storage";
// cropper link
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const Sidebar = ({active}) => {
  const storage = getStorage();
  let dispatch=useDispatch()
  let navigate=useNavigate()
  let data=useSelector((state)=>state.userLoginInfo.userInfo)
  const auth = getAuth();
  let [profilemodalshow,setProfileModalshow]=useState(false)
  let handlemodalcancel=()=>{
    setProfileModalshow(false)
  }
  // croperr 
  const [image, setImage] = useState('');
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();

  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };
  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      const message4 = cropper.getCroppedCanvas().toDataURL();
        const storageRef = ref(storage, auth.currentUser.uid);
        uploadString(storageRef, message4, 'data_url').then((snapshot) => {
          getDownloadURL(storageRef).then((downloadURL) => {
            updateProfile(auth.currentUser, {
               photoURL: downloadURL
            }).then(()=>{
              setProfileModalshow(false)
            })
          });
        });
    }
  };
  // cropper end
 let handleLogout=()=>{
  signOut(auth).then(() => {
    dispatch(userLoginInfo(null))
    localStorage.removeItem('userInfo')
    navigate('/login')
  }).catch((error) => {
    console.log(error)
  });
 }
  return (
    <div className='w-full h-screen rounded-3xl bg-primary'>
      {profilemodalshow ? 
      <div className='flex justify-center items-center bg-primary w-full h-screen absolute top-0, left-0 z-50'>
        <div className='w-2/4 bg-white p-5 rounded-md  '>
          <h1 className='font-poppins font-semibold text-primary text-2xl'>Update Your Profile Photo</h1>
          {image
           ? 
           <div className='mt-5 w-[70px] h-[70px] rounded-full mx-auto overflow-hidden'>
            
           <div className="img-preview w-full h-full"/>
           </div>
          :
          <div className='mt-5 w-[70px] h-[70px] rounded-full mx-auto overflow-hidden'>
          <img className=" w-full h-full" src='images/demoprofile.png'/>
          </div>
          }
        
          <input onChange={onChange} className='font-poppins font-semibold text-primary text-xl mt-5' type="file" />
          {image &&
          
          <div className='mt-5'>
            <Cropper
            style={{ height: 400, width: "100%" }}
            zoomTo={0.5}
            initialAspectRatio={1}
            preview=".img-preview"
            src={image}
            viewMode={1}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false} 
            onInitialized={(instance) => {
              setCropper(instance);
            }}
            guides={true}
          />
          </div>
          }
          <div>
          <button onClick={getCropData} className=' bg-primary text-white rounded font-nunito samibold p-2.5 mt-5'>Update</button>
          <button onClick={handlemodalcancel} className=' bg-red-500 text-white rounded font-nunito samibold p-2.5 mt-5 ml-5'>Cancel</button>
          </div>
        </div>
      </div>
    :
  <>
  <div className='flex justify-center'>
        <div className='group mt-8 w-[80px] h-[80px] rounded-full overflow-hidden relative'>
        <img className='' src={data.photoURL} alt="" />
          <div onClick={()=>setProfileModalshow(!profilemodalshow)} className='absolute top-0 left-0 bg-[rgba(0,0,0,.4)] w-full h-full flex justify-center items-center opacity-0 group-hover:opacity-100'>
            <FaCloudUploadAlt className='text-white text-2xl '/>
          </div>
        </div>
      </div>
      <h2 className='flex justify-center font-poppins font-semibold text-white text-2xl mt-5'>{data.displayName}</h2>
      <div className={active=="home"?"mt-[80px] relative z-[1] after:bg-white after:absolute after:top-[-15px] after:right-0 after:w-[161px] after:h-[89px] after:content[''] after:z-[-1] after:rounded-tl-xl after:rounded-bl-xl flex justify-center items-center":
    "mt-[80px] relative z-[1] after:bg-none after:absolute after:top-[-15px] after:right-0 after:w-[161px] after:h-[89px] after:content[''] after:z-[-1] after:rounded-bl-xl flex justify-center items-center"}>
        <Link to='/home'>
      <AiOutlineHome className= {active=='home' ?'text-5xl text-primary ':'text-5xl text-[#BAD1FF]' }/>
        </Link>
      </div>
      <div className={active=="msg"?"mt-[80px] relative z-[1] after:bg-white after:absolute after:top-[-15px] after:right-0 after:w-[161px] after:h-[89px] after:content[''] after:z-[-1] after:rounded-tl-xl after:rounded-bl-xl flex justify-center items-center":
    "mt-[80px] relative z-[1] after:bg-none after:absolute after:top-[-15px] after:right-0 after:w-[161px] after:h-[89px] after:content[''] after:z-[-1] after:rounded-bl-xl flex justify-center items-center"}>
        <Link to='/msg'>
      <BiMessageSquareDetail className={active=='msg' ?'text-5xl text-primary ':'text-5xl text-[#BAD1FF]' }/>
        </Link>
      </div>
      <div className="mt-[80px] relative z-[1] after:bg-none after:absolute after:top-[-15px] after:right-0 after:w-[161px] after:h-[89px] after:content[''] after:z-[-1] after:rounded-tl-xl after:rounded-bl-xl flex justify-center items-center">
      <BsBell className='text-5xl text-[#BAD1FF]  '/>
      </div>
      <div className="mt-[80px] relative z-[1] after:bg-none after:absolute after:top-[-15px] after:right-0 after:w-[161px] after:h-[89px] after:content[''] after:z-[-1] after:rounded-tl-xl after:rounded-bl-xl flex justify-center items-center">
      <AiOutlineSetting className='text-5xl text-[#BAD1FF]  '/>
      </div>
      <div className="mt-[80px] relative z-[1] after:bg-none after:absolute after:top-[-15px] after:right-0 after:w-[161px] after:h-[89px] after:content[''] after:z-[-1] after:rounded-tl-xl after:rounded-bl-xl flex justify-center items-center">
      <FiLogOut onClick={handleLogout}  className='text-5xl text-[#BAD1FF]  '/>
      </div>
  </>
    }
    
  </div>
  )
}

export default Sidebar