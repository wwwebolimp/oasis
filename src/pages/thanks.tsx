import React from 'react';
import { Layout } from "@/components";
import { useRouter } from 'next/router';

const Thanks: React.FC = () => {
  const router = useRouter();
  const { name, phone, address, comment, totalCost } = router.query;

  return (
      <Layout>
        <div className={'container'}>
          <h1>Спасибо за ваш заказ, {name}!</h1>
          <p>Информация о заказе:</p>
          <p>Телефон: {phone}</p>
          <p>Адрес: {address}</p>
          <p>Комментарий: {comment}</p>
          <p>Общая стоимость: {totalCost} рублей</p>
          {/* Здесь вы можете отобразить другую информацию о заказе */}
        </div>
      </Layout>
  );
};

export default Thanks;
