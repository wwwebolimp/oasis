import mongoose, {model, Schema} from "mongoose";

const ProductSchema = new Schema({
    name: {type:String },
    description:String,
    price:{type:Number  },
    discount:{type:Number  },
    images:[String]
})

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);