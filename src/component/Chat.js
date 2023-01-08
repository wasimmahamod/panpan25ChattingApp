import React from 'react'
import {BsThreeDotsVertical} from 'react-icons/bs'
import {BsTriangleFill,BsFillMicFill} from 'react-icons/bs'
import ModalImage from "react-modal-image";
import {TbSend} from "react-icons/tb";
import {GrGallery} from "react-icons/gr";
import {BsCameraFill} from "react-icons/bs";
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { useState, useEffect } from 'react';
import {ImCross} from 'react-icons/im'
import { useSelector } from 'react-redux';
import { getDatabase, ref, onValue,set, push, remove, get} from "firebase/database";
import { getStorage, ref as sref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import moment from 'moment/moment';


const Chat = () => {
    const storage = getStorage();
    let db=getDatabase()
    let data=useSelector((state)=>state.userLoginInfo.userInfo)
  let activeChatName=useSelector((state)=>state.activeChat)
    let [msg,setMsg]=useState('')
    let [msgList,setMsgList]=useState([])
    let [msgerr,setMsgerr]=useState('')
    let [camera,setCamera]=useState(false)
    let [captureImage,setCaptureImage]=useState('')
    function handleTakePhoto (dataUri) {
        setCaptureImage(dataUri)
      }
    
      function handleTakePhotoAnimationDone (dataUri) {
        // Do stuff with the photo...
        console.log('takePhoto');
      }
    
      function handleCameraError (error) {
        console.log('handleCameraError', error);
      }
    
      function handleCameraStart (stream) {
        console.log('handleCameraStart');
      }
    
      function handleCameraStop () {
        console.log('handleCameraStop');
      }
      let handleMsg=(e)=>{
        setMsg(e.target.value)
        setMsgerr('')
      }
      let handleMsgSend=()=>{
        if(activeChatName.active.status=='single'){
          if(!msg){
            setMsgerr('Plase Send/or write Something')
          }else{
            set(push(ref(db, 'singleMsg/')), {
             whosendid:data.uid,
             whosendname:data.displayName,
             whoreciveid:activeChatName.active.id,
             whorecivename:activeChatName.active.name,
             msg:msg,
             date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}- ${new Date().getHours()}  ${new Date().getMinutes()}`
            }).then(()=>{
        setMsg('')
            })
          }
        }else{
          console.log('ami group msg')

        }
      }
      useEffect(()=>{
        const starCountRef = ref(db, 'singleMsg/');
        onValue(starCountRef, (snapshot) => {
          let arr=[]
          snapshot.forEach((item)=>{
            if(item.val().whosendid==data.uid && item.val().whoreciveid==activeChatName.active.id||item.val().whoreciveid==data.uid && item.val().whosendid==activeChatName.active.id){
              arr.push(item.val())
            }
          })
          setMsgList(arr)
        });
      },[activeChatName.active.id])


      let handleimgUpload=(e)=>{
        console.log(e.target.files[0])
        const storageRef = sref(storage, e.target.files[0].name);

      const uploadTask = uploadBytesResumable(storageRef,e.target.files[0] );
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        }, 
      (error) => {
        console.log(error)
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log(downloadURL)
          set(push(ref(db, 'singleMsg/')), {
            whosendid:data.uid,
            whosendname:data.displayName,
            whoreciveid:activeChatName.active.id,
            whorecivename:activeChatName.active.name,
            img:downloadURL,
            date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}- ${new Date().getHours()}  ${new Date().getMinutes()}`
           })
        });
      }
    );
      }
  return (
    <div className='shadow-lg rounded-2xl '>
      <div className='py-6 pl-14 pr-6 '>
      <div className='flex items-center gap-x-8 '>
        <div className='relative drop-shadow-md'>
        <img src="images/profile.png" alt=""/>
        <div className="  h-4 w-4 items-center  rounded-full bg-green-600 absolute bottom-[10px] right-[5px] border-2 border-solid border-white">
        </div>
        </div>
        
        <div >
            <h3 className='font-poppins font-semibold text-black text-2xl'>{activeChatName.active.name}  </h3>
            <p className='font-poppins text-sm'>Online</p>
        </div>
        <div className='ml-auto'>
            <BsThreeDotsVertical className='text-primary text-3xl'/>
        </div>
        </div>
        <div className='w-full h-[1px] bg-[#BFBFBF] mt-6 mb-14'>
        </div>
        {/* msg */}
         <div>
         <div className=' overflow-y-scroll h-[400px] border-b border-solid border-[#F1F1F1]'>
          {activeChatName.active.status=='single'?
          msgList.map((item)=>(
            item.whosendid==data.uid ? 
            item.msg?
            <div className='text-right'>
        <div className='relative mt-6 mr-5'>
            <div className='bg-primary py-3 px-12 inline-block rounded-lg'>
            <h4 className='font-poppins text-base font-medium text-white '>{item.msg}</h4>
            </div>
            <BsTriangleFill className='text-primary text-2xl absolute bottom-[-1.5px] right-[-11px]'/>
        </div>
        <p className='font-poppins font-normal text-xs mt-2 text-[#D7D7D7]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
            </div>
            :
            <div className='text-right'>
            <div className='relative mt-6 mr-5'>
                <div className='bg-primary py-3 px-3 inline-block rounded-lg w-60 '>
                <ModalImage
                small={item.img}
                large={item.img}
                />
                </div>
                <BsTriangleFill className='text-primary text-2xl absolute bottom-[4px] right-[-11px]'/>
            </div>
            <p className='font-poppins font-normal text-xs mt-2 text-[#D7D7D7]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
            </div> 
           
            :
            item.msg?
            <div >
          <div className='relative mt-6 ml-5'>
            <div className='bg-[#F1F1F1] py-3 px-12 inline-block rounded-lg'>
            <h4 className='font-poppins text-base font-medium text-black '>{item.msg}</h4>
            </div>
            <BsTriangleFill className='text-[#F1F1F1] text-2xl absolute bottom-[-2px] left-[-11px]'/>
        </div>
        <p className='font-poppins font-normal text-xs mt-2 text-[#D7D7D7]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
            </div>
            :
            <div >
            <div className='relative mt-6 ml-5'>
                <div className='bg-[#F1F1F1] py-3 px-3 inline-block rounded-lg w-60 '>
                <ModalImage
                small={item.img}
                large={item.img}
                />
                </div>
                <BsTriangleFill className='text-[#F1F1F1] text-2xl absolute bottom-[4px] left-[-11px]'/>
            </div>
            <p className='font-poppins font-normal text-xs mt-2 text-[#D7D7D7]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
            </div>
          ))
          :
          <h1>ami group msg</h1>
          }
            {/* reciver msg start */}
         {/* <div >
        <div className='relative mt-6 ml-5'>
            <div className='bg-[#F1F1F1] py-3 px-12 inline-block rounded-lg'>
            <h4 className='font-poppins text-base font-medium text-black '>hey There</h4>
            </div>
            <BsTriangleFill className='text-[#F1F1F1] text-2xl absolute bottom-[-2px] left-[-11px]'/>
        </div>
        <p className='font-poppins font-normal text-xs mt-2 text-[#D7D7D7]'>Today, 2:01pm</p>
        </div> */}
        {/* reciver msg end */}
        {/* sender msg start */}
        {/* <div className='text-right'>
        <div className='relative mt-6 mr-5'>
            <div className='bg-primary py-3 px-3 inline-block rounded-lg w-60 '>
            <ModalImage
            small={"images/login.png"}
            large={"images/login.png"}
            />
            </div>
            <BsTriangleFill className='text-primary text-2xl absolute bottom-[4px] right-[-11px]'/>
        </div>
        <p className='font-poppins font-normal text-xs mt-2 text-[#D7D7D7]'>Today, 2:01pm</p>
        </div> */}
        {/* sender msg end */}
        {/* sender msg start */}
        {/* <div className='text-right'>
        <div className='relative mt-6 mr-5'>
            <div className='bg-primary py-3 px-3 inline-block rounded-lg'>
            <h4 className='font-poppins text-base font-medium text-white '>hey There</h4>
            </div>
            <BsTriangleFill className='text-primary text-2xl absolute bottom-[-1px] right-[-11px]'/>
        </div>
        <p className='font-poppins font-normal text-xs mt-2 text-[#D7D7D7]'>Today, 2:01pm</p>
        </div> */}
        {/* sender msg end */}
        {/* <div >
        <div className='relative mt-6 ml-5'>
            <div className='bg-primary py-3 px-3 inline-block rounded-lg w-60 '>
            <ModalImage
            small={"images/login.png"}
            large={"images/login.png"}
            />
            </div>
            <BsTriangleFill className='text-primary text-2xl absolute bottom-[4px] left-[-11px]'/>
        </div>
        <p className='font-poppins font-normal text-xs mt-2 text-[#D7D7D7]'>Today, 2:01pm</p>
        </div> */}
        {/* <div  >
        <div className=' mt-6 ml-5'>
            <div className=' inline-block'>
            <audio controls></audio>
            </div>
        </div>
        <p className='font-poppins font-normal text-xs mt-2 text-[#D7D7D7]'>Today, 2:01pm</p>
        </div> */}
        {/* <div className='text-right'>
        <div className=' mt-6 mr-5'>
            <div className=' inline-block '>
            <audio controls></audio>
            </div>
        </div>
        <p className='font-poppins font-normal text-xs mt-2 text-[#D7D7D7]'>Today, 2:01pm</p>
        </div> */}
        {/* <div  >
        <div className=' mt-6 ml-5'>
            <div className=' inline-block'>
            <video width="320" height="240" controls></video>
            </div>
        </div>
        <p className='font-poppins font-normal text-xs mt-2 text-[#D7D7D7]'>Today, 2:01pm</p>
        </div> */}
        {/* <div className='text-right'>
        <div className=' mt-6 mr-5'>
            <div className=' inline-block '>
            <video width="320" height="240" controls></video>
            </div>
        </div>
        <p className='font-poppins font-normal text-xs mt-2 text-[#D7D7D7]'>Today, 2:01pm</p>
        </div> */}
         </div>
         <div className='flex gap-x-3 mt-3'>
            <div className='w-[90%] relative'>
            <input onChange={handleMsg} value={msg} className='bg-[#F1F1F1] p-3 w-full  rounded-md'></input>
            <label>
            <input onChange={handleimgUpload} className='hidden' type="file"  />
            <GrGallery className='absolute top-4 right-2 '/>
            </label>
            <BsCameraFill onClick={()=>setCamera(!camera)} className='absolute top-4 right-8 '/>
            <BsFillMicFill className='absolute top-4 right-14 '/>
         
            </div>
          <div>
          {camera &&
                 <div className='absolute top-0 left-0 bg-[rgba(0,0,0,.9)] w-full h-screen z-50'>
                    <ImCross onClick={()=>setCamera(false)} className='text-white'/>
            <Camera
                onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
                onTakePhotoAnimationDone = { (dataUri) => { handleTakePhotoAnimationDone(dataUri); } }
                onCameraError = { (error) => { handleCameraError(error); } }
                idealFacingMode = {FACING_MODES.ENVIRONMENT}
                idealResolution = {{width: 640, height: 480}}
                imageType = {IMAGE_TYPES.JPG}
                imageCompression = {0.97}
                isMaxResolution = {true}
                isImageMirror = {false}
                isSilentMode = {false}
                isDisplayStartCameraError = {true}
                isFullscreen = {true}
                sizeFactor = {1}
                onCameraStart = { (stream) => { handleCameraStart(stream); } }
                onCameraStop = { () => { handleCameraStop(); } }
                />
                </div>
            }
          </div>
            <button onClick={handleMsgSend} className='bg-primary hover:bg-gray-500 transition ease-in-out delay-150 hover:text-green-500 p-3 rounded-md text-white text-xl flex justify-center items-center' >
                Send
            </button>
           
         </div>
         {msgerr && 
            <p className='font-poppins text-xl text-red-500 '>{msgerr}</p>}
         </div>
         {/* msg end */}
      </div>

    </div>
  )
}

export default Chat