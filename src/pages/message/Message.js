import React from 'react'
import Chat from '../../component/Chat'
import GroupList from '../../component/GroupList'
import Search from '../../component/Search'
import Sidebar from '../../component/Sidebar'
import FriendList from '../../component/FriendList'

const Message = () => {
  return (
    <div className='flex justify-evenly'>
    <div className='w-[186px]'>
      <Sidebar active='msg'/>
    </div>
    <div className='w-[25%]'>
    <Search/>
    <GroupList/>
    <FriendList/>
    </div>
    <div className='w-[50%]'>
    <Chat/>
    </div>

  </div>
  )
}

export default Message