import mongoose, { Document, Model, Schema } from "mongoose";

// Type Of Users
export interface IWordpress extends Document {
    username: string;
    password: string;
    country:string;
    language:string;
    url: string;
    slug:string;
    cities:ICity[];
    products:mongoose.Types.Array<mongoose.Schema.Types.ObjectId>;

}

export interface ICity extends Document {
    cityName: string;
    state: string;
    country: string;
    postalCode: string;
}
// Define the City sub-schema
const citySchema: Schema = new Schema({
    cityName: {
        type: String,
        required: [true, "City name is required"],
        trim: true
    },
    state: {
        type: String,
        required: [true, "State is required"],
        trim: true
    },
    postalCode: {
        type: String,
        required: [true, "Postal code is required"],
        trim: true
    }
});

// Make Schema Of Users
const wordPressSchema: Schema<IWordpress> = new Schema({
    slug:{
        type:String,
        required: [true, "Slug is required"],
        unique: true,
        trim: true
    },
    url: {
        type: String,  
        required: [true, "Url is required"],
        unique: true,
        trim: true
    },
    username: {
        type: String,
        required: [true, "username is required"],
        trim: true,
        lowercase:true
    },
    country:{
        type: String,
        required: [true, "username is required"],
        trim: true
    },
    language:{
        type: String,
        required: [true, "language is required"],
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true
    },
    cities: [citySchema],
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
});

// Here make interface of model
interface WordPressModel extends Model<IWordpress> { };

// Use a pattern to avoid re-defining the model if it already exists
const WordPress: WordPressModel = mongoose.models.WordPress as WordPressModel || mongoose.model< IWordpress, WordPressModel>("WordPress", wordPressSchema);

export default WordPress;