import React, { useEffect, useState } from 'react'
import {BsSearch,BsThreeDotsVertical} from 'react-icons/bs';
import { getDatabase, ref, onValue,set, push, remove} from "firebase/database";
import {useSelector} from 'react-redux';

const MyGroups = () => {
    let data=useSelector((state)=>state.userLoginInfo.userInfo)
    const db = getDatabase();
    let [createGroup,setCreateGroup]=useState([])
    let [requstShow,setRequstShow]=useState(false)
    let [InfoShow,setInfoShow]=useState(false)
    let [grouprequest,setgrouprequest]=useState([])
    let [accpetGroup,setAccpetGroup]=useState([])


    useEffect(()=>{
        const groupcreateRef = ref(db, 'groupcreate/');
        onValue(groupcreateRef, (snapshot) => {
        let arr=[]
        snapshot.forEach((item)=>{
            if(data.uid==item.val().adminid){

                arr.push({...item.val(),id:item.key})
            }
        })
        setCreateGroup(arr)
        });
    },[])

    let handleDeleteG=(item)=>{
        remove(ref(db, 'groupcreate/'+item.id))
    }
    let handleGroupreq=(Gitem)=>{
        setRequstShow(true)
       const groupcreateRef = ref(db, 'JoinGroup/');
       onValue(groupcreateRef, (snapshot) => {
       let arr=[]
       snapshot.forEach((item)=>{
           if(data.uid==item.val().adminid && item.val().Groupid==Gitem.id){
               arr.push({...item.val(),id:item.key})
           }
       })
       setgrouprequest(arr)
       });
    }
    let handleAccept=(item)=>{
        console.log(item)
        set(push(ref(db, 'AccpetGroup/')), {
            groupname:item.Groupname,
            groupid:item.Groupid,
            admin:item.admin,
            adminid:item.adminid,
            userid:item.userid,
            username:item.username,
          }).then(()=>{
            remove(ref(db, 'JoinGroup/'+item.id))
          })
    }
    let handleReject=(item)=>{
        remove(ref(db, 'JoinGroup/'+item.id))
    }
    let handleInfo=(Gitem)=>{
        setInfoShow(true)
        const starCountRef = ref(db, 'AccpetGroup/');
        onValue(starCountRef, (snapshot) => {
            let arr=[]
            snapshot.forEach((item)=>{
                if(data.uid==Gitem.adminid &&Gitem.id==item.val().groupid){

                    arr.push({...item.val(),id:item.key})
                }
            })
            setAccpetGroup(arr)
        });
    }
  return (
    <div className='mt-5 relative h-[340px] shadow-lg	w-full overflow-y-scroll p-5	'>
    {requstShow &&
    <button onClick={()=>setRequstShow(!requstShow)} className='absolute top-2 right-3 text-xl font-poppins  bg-primary p-2 text-white rounded-lg '>Go Back</button>
    }
    {InfoShow &&
    <button onClick={()=>setInfoShow(!InfoShow)} className='absolute top-2 right-3 text-xl font-poppins  bg-primary p-2 text-white rounded-lg '>Go Back</button>
    }
        <h2 className='font-poppins font-semibold text-xl mb-4'>My Groups</h2>
        {createGroup.length==0
        ?
        <h2 className='bg-red-500 p-5 font-poppins text-semibold text-white'>No Group Available</h2>
        :
        requstShow 
        ?
        grouprequest.map((item)=>(
            <div className='flex w-full items-center gap-x-4 py-3.5 border-b '>
            <div>
                <img src="images/group.png" alt="" />
            </div>
            <div>
       
            <h2 className='font-poppins font-semibold text-xl'>{item.username}</h2>
            </div>
            <div>

            <button onClick={()=>handleAccept(item)} className='font-poppins  text-xl bg-primary p-2 text-white rounded-br-2xl '>Accept</button>
            <button onClick={()=>handleReject(item)}  className='font-poppins  text-xl bg-red-500 p-2 text-white rounded-br-2xl mt-2 ml-2'>Reject</button>
            </div>
        </div>
        ))
        :
        InfoShow
        ?
        accpetGroup.map((item)=>(
            <div className='flex w-full items-center gap-x-4 py-3.5 border-b '>
            <div>
                <img src="images/group.png" alt="" />
            </div>
            <div>
       
            <h2 className='font-poppins font-semibold text-xl'>{item.username}</h2>
            </div>
            <div>

          
            </div>
        </div>
        ))
        :
        createGroup.map((item)=>(
            <div className='flex w-full items-center gap-x-4 py-3.5 border-b '>
            <div>
                <img src="images/group.png" alt="" />
            </div>
            <div>
            <h2 className='font-poppins font-normal text-sm'>Admin Name:{item.admin}</h2>
            <h2 className='font-poppins font-semibold text-xl'>{item.Groupname}</h2>
            <h2 className='font-poppins font-normal text-sm'>{item.Grouptag}</h2>
            </div>
            <div>

            <button onClick={()=>handleGroupreq(item)} className='font-poppins  text-xl bg-primary p-2 text-white rounded-br-2xl '>Request</button>
            <button onClick={()=>handleInfo(item)} className='font-poppins  text-xl bg-red-500 p-2 text-white rounded-br-2xl mt-2 ml-2'>Info</button>
            </div>
        </div>
       ))
        }
    
       
      
      
    </div>
  )
}

export default MyGroups