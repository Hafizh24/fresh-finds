import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: {}
};

export const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {
        setData: (state, action) => {
            state.value = action.payload;
        },
        updateProfilePicture: (state, action) => {
            state.value.profile_picture = action.payload
        }
    }
})

export const { setData, updateProfilePicture } =
    customerSlice.actions;

export default customerSlice.reducer 