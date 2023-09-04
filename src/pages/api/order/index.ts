// pages/api/orders/create.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { mongooseConnect } from '@/lib/mongoose';
import Order from '@/models/Order';
import {IProduct} from "@/types/IProduct";
import Product from "@/models/Product";

// Тип продукта с ценой
type ProductWithPrice = {
    _id: string;
    quantity: number;
    price: number;
    discount?: number;
};
export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await mongooseConnect(); // Подключение к базе данных
        if (req.method === 'POST') {
            // Обработка POST-запроса для создания нового заказа

            const { name, phone, address, comment, cart } = req.body;

            // Получите цены продуктов из базы данных по их идентификаторам (ID)
            const cartWithPrices = await getCartWithPrices(cart);

            // Вычислите общую стоимость заказа на сервере
            const totalCost = await calculateTotalCost(cartWithPrices);


            // Валидация и создание заказа
            try {
                const order = await Order.create({
                    name,
                    phone,
                    address,
                    comment,
                    cart: cartWithPrices, // Включите цены продуктов в данные заказа
                    totalCost,
                });

                return res.status(201).json({ success: true, data: order });
            } catch (validationError: any) { // Provide a type annotation here
                // Extract validation errors from Mongoose validation object
                const validationErrors = Object.values(validationError.errors).map(
                    (error: any) => error.message
                );

                return res.status(400).json({ success: false, errors: validationErrors });
            }
        } else {
            res.status(405).json({ success: false, message: 'Метод не разрешен' });
        }
    } catch (error) {
        console.error('Ошибка создания заказа:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
};

// Функция для получения цен продуктов по их идентификаторам (ID)
async function getCartWithPrices(cart: ProductWithPrice[]): Promise<ProductWithPrice[]> {
    const cartWithPrices: ProductWithPrice[] = [];

    for (const item of cart) {
        const product: IProduct | null = await Product.findById(item._id);

        if (product) {
            cartWithPrices.push({
                _id: item._id,
                quantity: item.quantity,
                price: product.price, // Добавьте цену продукта в корзину
            });
        } else {
            console.error(`Цена продукта не найдена для товара с ID: ${item._id}`);
        }
    }

    return cartWithPrices;
}

// Функция для вычисления общей стоимости заказа с учетом скидки
async function calculateTotalCost(cart: ProductWithPrice[]): Promise<number> {
    let totalCost = 0;

    for (const item of cart) {
        const product: IProduct | null = await Product.findById(item._id);

        if (product) {
            // Если есть скидка, учитываем её при расчете
            const priceWithDiscount = product.discount
                ? product.price - (product.price * product.discount) / 100
                : product.price;

            totalCost += priceWithDiscount * item.quantity;
        } else {
            console.error(`Цена продукта не найдена для товара с ID: ${item._id}`);
        }
    }

    return totalCost;
}
