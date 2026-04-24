import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/apiService';

export const fetchClients = createAsyncThunk('referenceData/fetchClients', async () => {
    const response = await api.get('/ReferenceData/clients');
    return response.data;
});

export const fetchItems = createAsyncThunk('referenceData/fetchItems', async () => {
    const response = await api.get('/ReferenceData/items');
    return response.data;
});

const referenceDataSlice = createSlice({
    name: 'referenceData',
    initialState: {
        clients: [],
        items: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchClients.fulfilled, (state, action) => {
            state.clients = action.payload;
        });
        builder.addCase(fetchItems.fulfilled, (state, action) => {
            state.items = action.payload;
        });
    }
});

export default referenceDataSlice.reducer;
