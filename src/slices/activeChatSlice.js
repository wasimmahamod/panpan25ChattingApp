import { createSlice } from '@reduxjs/toolkit'

export const activeChatSlice = createSlice({
  name: 'active',
  initialState: {
    active: 'mern2201',
  },
  reducers: {
    activeChat:((state,action)=>{
      state.active=action.payload
    })

  },
})
export const { activeChat } = activeChatSlice.actions

export default activeChatSlice.reducer