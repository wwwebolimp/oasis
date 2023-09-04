import mongoose, { Document, model, Schema } from 'mongoose';
import { CartItem } from "@/types/IOrder";

const CartItemSchema = new Schema<CartItem>({
    _id: { type: Schema.Types.ObjectId, required: true }, // Используйте Schema.Types.ObjectId
    quantity: { type: Number, required: true },
});

const OrderSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    comment: { type: String },
    cart: [CartItemSchema], // Связь с CartItemSchema
    totalCost: Number,
});

export default mongoose.models.Order || model('Order', OrderSchema);
