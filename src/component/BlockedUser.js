import React, { useEffect, useState } from 'react'
import {BsSearch,BsThreeDotsVertical} from 'react-icons/bs';
import { getDatabase, ref, onValue,set, push, remove} from "firebase/database";
import {useSelector} from 'react-redux';

const BlockedUser = () => {
    const db = getDatabase();
    let data=useSelector((state)=>state.userLoginInfo.userInfo)
    let [blockList,setblockList]=useState([])

    useEffect(()=>{
      const BlockRef = ref(db, 'block/');
        onValue(BlockRef, (snapshot) => {
        let arr=[]
        snapshot.forEach((item)=>{
          if(data.uid==item.val().blockbyid){
           arr.push({
            block:item.val().block,
            blockid:item.val().blockid,
            key:item.key
           })
          }else if(data.uid==item.val().blockid){
            arr.push({
              blockby:item.val().blockby,
              blockbyid:item.val().blockbyid,
              key:item.key
             })
          }
        })
        setblockList(arr)
        });
    },[])
    let handleunblock=(item)=>{
      set(push(ref(db, 'friend/')), {
        sendername:item.block,
        senderid:item.blockid,
        reciverid:data.uid,
        recivername:data.displayName,
      }).then(()=>{
        remove(ref(db, 'block/'+item.key))
      })
    }
  return (
    <div className='mt-5 relative h-[340px] shadow-lg	w-full overflow-y-scroll	'>
    <BsThreeDotsVertical className='absolute top-2 right-3 text-xl'/>
    <h2 className='font-poppins font-semibold text-xl mb-4'>Blocked Users</h2>
    {blockList.map((item)=>(
      <div className='flex w-full items-center gap-x-4 py-3.5 border-b '>
      <div>
          <img src="images/group.png" alt="" />
      </div>
      <div>
      <h2 className='font-poppins font-semibold text-xl'>{item.blockby}</h2>
      <h2 className='font-poppins font-semibold text-xl'>{item.block}</h2>
      <h2 className='font-poppins font-normal text-sm'>Hi Guys, Wassup!</h2>
      </div>
      {item.blockid && 
       <button onClick={()=>handleunblock(item)} className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-lg ml-5'>Unblock</button>
      }
     
    </div>
    ))}

   

        
      
    </div>
  )
}

export default BlockedUser