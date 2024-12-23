import mongoose, { Document, Model, Schema } from "mongoose";

// Product Schema
export interface IProduct extends Document {
    productName: string;
    price: number;
    description: string;
    category: string;
    wordpress: mongoose.Types.ObjectId; 
}

const productSchema: Schema<IProduct> = new Schema({
    productName: {
        type: String,
        required: [true, "Product name is required"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Price is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    category: {
        type: String,
        required: [true, "Category is required"]
    },
    wordpress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WordPress",
        required: [true, "WordPress reference is required"]
    }
});

interface ProductModel extends Model<IProduct> { }

const Product: ProductModel = mongoose.models.Product as ProductModel || mongoose.model<IProduct, ProductModel>("Product", productSchema);
export default Product;
