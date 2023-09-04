import React from 'react';

interface CartItem {
    id: string;
    quantity: number;
}

interface Props {
    cartItems: CartItem[];
}

const Cart: React.FC<Props> = ({ cartItems }) => {
    return (
        <div>
            <h2>Cart</h2>
            <ul>
                {cartItems.map(item => (
                    <li key={item.id}>
                        Product ID: {item.id}, Quantity: {item.quantity}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Cart;
