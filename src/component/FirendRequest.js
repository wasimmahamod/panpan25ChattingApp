import React, { useEffect, useState } from 'react'
import {BsSearch,BsThreeDotsVertical} from 'react-icons/bs';
import { getDatabase, ref, onValue,set, push, remove} from "firebase/database";
import {useSelector} from 'react-redux';


const FirendRequest = () => {
    const db = getDatabase();
    let data=useSelector((state)=>state.userLoginInfo.userInfo)
    let [friendRequestlist,setFriendRequestlist]=useState([])

    useEffect(()=>{
        const friendRequestRef = ref(db, 'friendRequest/');
        onValue(friendRequestRef, (snapshot) => {
            let arr=[]
        snapshot.forEach((item)=>{
            if(item.val().reciverid==data.uid){

                arr.push({...item.val(),key:item.key})
            }
        })
        setFriendRequestlist(arr)
        });
    },[])
    let handleFriend=(item)=>{
        set(push(ref(db, 'friend/')), {
            ...item
          }).then(()=>{
              remove(ref(db, 'friendRequest/'+item.key))
          })
    }
  return (
    <div className='mt-11 relative h-[340px] shadow-lg	w-full overflow-y-scroll p-5'>
    <BsThreeDotsVertical className='absolute top-2 right-3 text-xl'/>
        <h2 className='font-poppins font-semibold text-xl mb-4'>Friend  Request</h2>
        {friendRequestlist.map((item)=>(
            <div className='flex w-full items-center gap-x-4 py-3.5 border-b '>
            <div>
                <img src="images/group.png" alt="" />
            </div>
            <div>
            <h2 className='font-poppins font-semibold text-xl'>{item.sendername}</h2>
            <h2 className='font-poppins font-normal text-sm'>Hi Guys, Wassup!</h2>
            </div>
            <button onClick={()=>handleFriend(item)} className='font-poppins  text-xl bg-primary p-2 text-white rounded-lg ml-5'>Accept</button>
        </div>
        ))}
        
       
      
    </div>
  )
}

export default FirendRequest