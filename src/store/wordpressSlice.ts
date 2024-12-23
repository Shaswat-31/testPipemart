import { wordpressProfile } from "@/types/reducerTypes";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: wordpressProfile = {
    country: "",
    language: "",
    slug: "",
    url: "",
    hostUrl: "",
    databaseName: "",
    wordpress_id: "",
    username: "",
    password: "",
    wpuser: "",
    wppass: "",
    temp_id: 0,
    industry: [],
    table_prefix:""
};

export const wordpressSlice = createSlice({
    name: "wordpress",
    initialState,
    reducers: {
        // Ensure that the PayloadAction has the correct type of `wordpressProfile`
        setSiteData: (state, action: PayloadAction<wordpressProfile>) => {
            // Use spread syntax to update the state immutably
            return { ...state, ...action.payload };
        },
    },
});

export const { setSiteData } = wordpressSlice.actions;
export default wordpressSlice.reducer;
