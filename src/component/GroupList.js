import React,{useState,useEffect} from 'react'
import { getDatabase, ref, onValue,set, push} from "firebase/database";

const GroupList = () => {
    const db = getDatabase();
    let [JoinGroup,setJoinGroup]=useState([])
    let [JoinGroupRequest,setJoinGroupRequest]=useState([])


    useEffect(()=>{
        const groupcreateRef = ref(db, 'groupcreate/');
        onValue(groupcreateRef, (snapshot) => {
        let arr=[]
        snapshot.forEach((item)=>{
                arr.push({...item.val(),id:item.key})
        })
        setJoinGroup(arr)
        });
    },[])


  return (
    <div className='mt-11 relative h-[347px] shadow-lg	w-full overflow-y-scroll p-5'>
       <div className='relative'>
       <h2 className='font-poppins font-semibold text-xl mb-4'>Groups List</h2>
       </div>
        {
        <>
        {JoinGroup.length==0
        ?
        <h2 className='bg-red-500 p-5 font-poppins text-semibold text-white'>No Group Available</h2>
        :
        JoinGroup.map((item)=>(
            <div className='flex w-full items-center gap-x-4 py-3.5 border-b '>
            <div>
                <img src="images/group.png" alt="" />
            </div>
            <div>
            <h2 className='font-poppins font-normal text-sm'>Admin:{item.admin}</h2>
            <h2 className='font-poppins font-semibold text-xl'>{item.Groupname}</h2>
            <h2 className='font-poppins font-normal text-sm'>{item.Grouptag}</h2>
                </div>
         <div className='ml-auto'>
            <button  className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-lg ml-5'>Msg</button>
            </div>
            </div>
            ))
        }
        </>
        }

    </div>
  )
}

export default GroupList