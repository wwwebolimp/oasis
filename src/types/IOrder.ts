// Define the CartItem interface
import {Types} from "mongoose";

export interface CartItem {
    _id: Types.ObjectId | string; // Может быть строкой или ObjectId
    quantity?: number;
}

export interface IOrder {
    name: string;
    phone: string;
    address: string;
    comment?: string;
    cart: CartItem[];
}