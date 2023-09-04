// components/OrderForm.tsx
import React, {useContext, useState} from 'react';
import {CartContext} from "@/providers";

const OrderForm: React.FC = () => {
    const {cart} = useContext(CartContext)!;
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [comment, setComment] = useState('');
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const orderData = {
            name,
            phone,
            address,
            comment,
            cart,
        };

        try {
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                // Order was successfully created
                // Handle success as needed
            } else {
                // Order creation failed
                // Handle error as needed
            }
        } catch (error) {
            // Network error or other issues
            console.error('Error creating order:', error);
            // Handle error as needed
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <input
            type="text"
    placeholder="Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    />
    <input
    type="text"
    placeholder="Phone"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    />
    <input
    type="text"
    placeholder="Address"
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    />
    <input
    type="text"
    placeholder="Comment"
    value={comment}
    onChange={(e) => setComment(e.target.value)}
    />
    <button type="submit">Place Order</button>
    </form>
);
};

export default OrderForm;
