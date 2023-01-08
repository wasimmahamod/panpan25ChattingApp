import React,{useState,useEffect} from 'react'
import {BsSearch,BsThreeDotsVertical} from 'react-icons/bs'
import { getDatabase, ref, onValue,set, push} from "firebase/database";
import {useSelector} from 'react-redux';

const JoinGroup = () => {
    let data=useSelector((state)=>state.userLoginInfo.userInfo)
    const db = getDatabase();
    let [modalshow,setModalshow]=useState(false)
    let [Gname,setGname]=useState('')
    let [Gtag,setGtag]=useState('')
    let [Gnameerr,setGnameerr]=useState('')
    let [Gtagerr,setGtagerr]=useState('')
    let [JoinGroup,setJoinGroup]=useState([])
    let [JoinGroupRequest,setJoinGroupRequest]=useState([])

    let handlemodalshow=()=>{
        setModalshow(!modalshow)
    }
    let handleGname=(e)=>{
        setGname(e.target.value)
        setGnameerr('')
    }
    let handleGtag=(e)=>{
        setGtag(e.target.value)
        setGtagerr('')
    }
    let handleGCreate=()=>{
        if(!Gname){
            setGnameerr('Group Name Requird')
        }
        if(!Gtag){
            setGtagerr('Group Tag Requird')
        }
        if(Gname && Gtag ){
            set(push(ref(db, 'groupcreate/')), {
                Groupname:Gname,
                Grouptag:Gtag,
                admin:data.displayName,
                adminid:data.uid
              }).then(()=>{
                  setModalshow(false)
              })
        }
    }
    useEffect(()=>{
        const groupcreateRef = ref(db, 'groupcreate/');
        onValue(groupcreateRef, (snapshot) => {
        let arr=[]
        snapshot.forEach((item)=>{
            if(data.uid!=item.val().adminid){
                arr.push({...item.val(),id:item.key})
            }
        })
        setJoinGroup(arr)
        });
    },[])
    let handleJoinG=(item)=>{
        set(push(ref(db, 'JoinGroup/')),{
            Groupid:item.id,
            Groupname:item.Groupname,
            Grouptag:item.Grouptag,
            admin:item.admin,
            adminid:item.adminid,
            userid:data.uid,
            username:data.displayName,
        })
    }

    useState(() => {
        const starCountRef = ref(db, 'JoinGroup/');
        onValue(starCountRef, (snapshot) => {
            let arr=[]
            snapshot.forEach((item) => {
            arr.push(item.val().adminid+item.val().Groupid)
            })
            setJoinGroupRequest(arr)
        });
    },[])
  return (
    <div className='mt-11 relative h-[347px] shadow-lg	w-full overflow-y-scroll p-5'>
       <div className='relative'>
       <h2 className='font-poppins font-semibold text-xl mb-4'>Groups Request</h2>
        <button onClick={handlemodalshow} className='absolute top-0 right-3 font-poppins font-semibold text-xl p-1.5 bg-primary text-white rounded cursor-pointer'>{modalshow ? 'Go Back':'Create Group'}</button>
       </div>
        {modalshow 
        ? 
        <div className=''>
            <input onChange={handleGname}  className='border border-solid border-secondary w-full	p-2 outline-0 rounded	' type="text" placeholder='Group Name' />
            {Gnameerr && <p className='text-poppin text-white bg-red-600 w-full p-1.5'>{Gnameerr}</p>}
            <input onChange={handleGtag}   className='border border-solid border-secondary w-full	p-2  outline-0 mt-5	rounded' type="text" placeholder='Group TagLine'/>
            {Gtagerr && <p className='text-poppin text-white bg-red-600 w-full p-1.5'>{Gtagerr}</p>}
            <button onClick={handleGCreate}  className='w-full bg-primary text-white text-2xl rounded-md font-nunito samibold py-2.5 mt-5'>Create</button>
        </div>
        :
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
                {JoinGroupRequest.includes(item.id + item.adminid) || JoinGroupRequest.includes(item.adminid + item.id)
                ?
                <button className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-lg ml-5'>P</button>
                :
            <button onClick={()=>handleJoinG(item)} className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-lg ml-5'>Join</button>
                }
            </div>
            ))
        }
        </>
        }

    </div>
  )
}

export default JoinGroup