import mongoose from "mongoose";

const productSchema=new mongoose.Schema(
    {
        name: String,
        brand: String,
        gender: String,
        category: String,
        price: Number,
        is_in_inventory: Boolean,
        items_left: Number,
        imageURL: {
            type:String,
            
          },
        slug: String,
    },
    {
        timestamps : true,
    }
)

export default mongoose.model('Product',productSchema);