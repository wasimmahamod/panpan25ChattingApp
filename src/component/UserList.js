import React, { useEffect, useState } from 'react'
import {BsSearch,BsThreeDotsVertical} from 'react-icons/bs';
import { getDatabase, ref, onValue,set, push} from "firebase/database";
import {useSelector} from 'react-redux';




const UserList = () => {
    let data=useSelector((state)=>state.userLoginInfo.userInfo)
    let [userList,setUserList]=useState([])
    let [friendRequestlist,setFriendRequestlist]=useState([])
    let [friendlist,setFriendlist]=useState([])
    let [blockList,setBlockList]=useState([])
    let [FilterUserList,setFilterUserList]=useState([])
    const db = getDatabase();

useEffect(()=>{
    const starCountRef = ref(db, 'users/');
    onValue(starCountRef, (snapshot) => {
        let array=[]
      snapshot.forEach((item)=>{
          if(item.val().id!=data.uid){
              array.push(item.val())
          }
        })
        setUserList(array)
    });
},[])
let handleFriendRequest=(item)=>{
    set(ref(db, 'friendRequest/'+ item.id), {
        senderid:data.uid,
        sendername:data.displayName,
        reciverid:item.id,
        recivername:item.username,
      });
}
useEffect(()=>{
    const friendRequestRef = ref(db, 'friendRequest/');
    onValue(friendRequestRef, (snapshot) => {
        let arr=[]
      snapshot.forEach((item)=>{
        arr.push(item.val().reciverid+item.val().senderid)
      })
      setFriendRequestlist(arr)
    });
},[])
useEffect(()=>{
    const friendRef = ref(db, 'friend/');
    onValue(friendRef, (snapshot) => {
        let arr=[]
      snapshot.forEach((item)=>{
        arr.push(item.val().reciverid+item.val().senderid)
      })
      setFriendlist(arr)
    });
},[])
useEffect(()=>{
    const blockRef = ref(db, 'block/');
    onValue(blockRef, (snapshot) => {
        let arr=[]
      snapshot.forEach((item)=>{
        arr.push(item.val().blockid+item.val().blockbyid)
      })
      setBlockList(arr)
    });
},[])
let handleSearch=(e)=>{
  console.log(e.target.value)
  let arr=[]
  if(e.target.value.length==0){
    setFilterUserList([])
  }else{

    userList.filter((item)=>{
      if(item.username.toLowerCase().includes(e.target.value.toLowerCase())){
        arr.push(item)
      }
      setFilterUserList(arr)
    })
  }
}
  return (
    <div className='mt-5 relative h-[430px] shadow-lg	w-full overflow-y-scroll p-5	'>
    <BsThreeDotsVertical className='absolute top-2 right-3 text-xl'/>
        <h2 className='font-poppins font-semibold text-xl mb-4'>User List</h2>
        <input onChange={handleSearch} className='w-full rounded-xl py-4 pl-5 placeholder:font-poppins text-base drop-shadow-lg	' type="text" placeholder='Search'/>
        {FilterUserList.length>0
        ?
        FilterUserList.map((item)=>(
          <div className='flex w-full items-center gap-x-4 py-3.5 border-b '>
              <div className='w-[20%]'>
                  <div className='w-[60px] h-[60px]'>
                  <img className='w-full h-full' src="images/group.png" alt="" />
                  </div>
              </div>
              <div className='w-[60%]'>
              <h2 className='font-poppins font-semibold text-xl'>{item.username}</h2>
              <h2 className='font-poppins font-normal text-sm'>{item.email}</h2>
              </div>
              {blockList.includes(data.uid+item.id)||
              blockList.includes(item.id+data.uid) 
              ?
              <div className='w-[20%] flex justify-end'>
              <button className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-lg ml-5'>B</button>
              </div>
            :
            friendlist.includes(data.uid+item.id)||
              friendlist.includes(item.id+data.uid) 
              ? 
              <div className='w-[20%] flex justify-end'>
              <button className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-lg ml-5'>F</button>
              </div>
              :
              friendRequestlist.includes(data.uid+item.id)||
              friendRequestlist.includes(item.id+data.uid)
              ?
              <div className='w-[20%] flex justify-end'>
              <button className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-lg ml-5'>P</button>
              </div>
              :
              <div className='w-[20%] flex justify-end'>
              <button onClick={()=>handleFriendRequest(item)} className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-lg ml-5'>Join</button>
              </div>
            }
  
          </div>
  
          ))
        :
        userList.map((item)=>(
          <div className='flex w-full items-center gap-x-4 py-3.5 border-b '>
              <div className='w-[20%]'>
                  <div className='w-[60px] h-[60px]'>
                  <img className='w-full h-full' src="images/group.png" alt="" />
                  </div>
              </div>
              <div className='w-[60%]'>
              <h2 className='font-poppins font-semibold text-xl'>{item.username}</h2>
              <h2 className='font-poppins font-normal text-sm'>{item.email}</h2>
              </div>
              {blockList.includes(data.uid+item.id)||
              blockList.includes(item.id+data.uid) 
              ?
              <div className='w-[20%] flex justify-end'>
              <button className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-lg ml-5'>B</button>
              </div>
            :
            friendlist.includes(data.uid+item.id)||
              friendlist.includes(item.id+data.uid) 
              ? 
              <div className='w-[20%] flex justify-end'>
              <button className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-lg ml-5'>F</button>
              </div>
              :
              friendRequestlist.includes(data.uid+item.id)||
              friendRequestlist.includes(item.id+data.uid)
              ?
              <div className='w-[20%] flex justify-end'>
              <button className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-lg ml-5'>P</button>
              </div>
              :
              <div className='w-[20%] flex justify-end'>
              <button onClick={()=>handleFriendRequest(item)} className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-lg ml-5'>Join</button>
              </div>
            }
  
          </div>
  
          ))
        }
      
     
      
    </div>
  )
}

export default UserList