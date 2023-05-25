import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Header } from '../../components/Header/Header';
import { api } from '../../services/apiClient';
import styles from '../../../styles/finish.module.scss';
import { toast } from 'react-toastify';
// Tipagem para o objeto de cada item
type Item = {
  id: string;
  amount: number;
  product: {
    id: string;
    name: string;
    price: number;
  };
};

// Tipagem para o objeto de cada pedido
type Order = {
  id: string;
  items: Item[];
};

const Table = () => {
  const router = useRouter();
  const table_id = router.query.id;

  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [tableNumber, setTableNumber] = useState<string>('');

  useEffect(() => {
    api.get('/table/detail', {
      params: {
        table_id,
      },
    })
      .then(response => {
        const { id, number, orders } = response.data;
        setOrders(orders);
        setTableNumber(number);
      });
  }, [table_id]);

  const calculateItemTotal = (price: number, amount: number): number => {
    return price * amount;
  };

  useEffect(() => {
    let total = 0;
    orders.forEach(order => {
      order.items.forEach(item => {
        total += calculateItemTotal(item.product.price, item.amount);
      });
    });
    setTotal(total);
  }, [orders]);

  const printAccount = () => {
    const printContents = document.querySelector('.print-container').innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
  };

  const finalizeTable = () => {
    api.put('/table/clean', {
      tableId: table_id
    }).then(response => {
      toast('Mesa Finalizada Com Sucesso')
      Router.back()
    });
  };

  return (
    <>
      <Head>
        <title>Finalizar Contas</title>
      </Head>
      <Header />
      <main className={styles.main}>


        <div className={styles.container}>
          <div className={styles.title}>
            <strong style={{ fontSize: '1.5rem' }}>Mesa:</strong> <span style={{ fontSize: '1.5rem' }} className={styles.number}>{tableNumber}</span>
          </div>
          <div className={styles.title}>
            <strong>Total Da Mesa:</strong> <span className={styles.total}>R$ {total.toFixed(2)}</span>
          </div>
          <div className={styles.title}>
            Items:
            <ul className={styles.containerItem}>
              {orders.map((order, index) => (
                <li key={order.id} className={styles.order}>
                  <strong>Pedido #{index + 1}:</strong>
                  <ul className={styles.itemPedido}>
                    {order.items.map(item => (
                      <li key={item.id} className={styles.item}>
                        {item.amount} - {item.product.name}: <span className={styles.price}>R$ {calculateItemTotal(item.product.price, item.amount).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Adiciona a seção da conta em uma div com a classe 'print-container' para ser impressa */}
        <div className="print-container" style={{ display: 'none' }}>
          <div className={styles.container}>
            <div className={styles.title}>
              <strong style={{ fontSize: '1.5rem' }}>Mesa:</strong>{' '}
              <span style={{ fontSize: '1.5rem' }} className={styles.number}>
                {tableNumber}
              </span>
            </div>
            <div className={styles.title}>
              <strong>Total Da Mesa:</strong>{' '}
              <span className={styles.total}>R$ {total.toFixed(2)}</span>
            </div>
            <div className={styles.title}>
              Items:
              <ul className={styles.containerItem}>
                {orders.map((order, index) => (
                  <li key={order.id} className={styles.order}>
                    <strong>Pedido #{index + 1}:</strong>
                    <ul className={styles.itemPedido}>
                      {order.items.map(item => (
                        <li key={item.id} className={styles.item}>
                          {item.product.name}:{' '}
                          <span className={styles.price}>
                            R$ {calculateItemTotal(item.product.price, item.amount).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.buttons}>
          <button className={styles.button} onClick={printAccount}>Imprimir Comprovante</button> {/* Adiciona o botão de impressão */}
          <button className={styles.buttonFin} onClick={finalizeTable}>Finalizar Mesa</button> {/* Adiciona o botão de finalização da mesa */}
        </div>
      </main>
    </>
  );
};

export default Table;

