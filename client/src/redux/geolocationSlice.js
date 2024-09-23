import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loaded: false,
    coordinates: { lat: null, lng: null },
};

export const geolocationSlice = createSlice({
    name: 'geolocation',
    initialState,
    reducers: {
        updateGeolocation: (state, action) => {
            state.loaded = true;
            state.coordinates = action.payload;
        },
    },
});

export const { updateGeolocation } = geolocationSlice.actions;

export default geolocationSlice.reducer;
