// Componentes React
import { useState } from 'react'

// Componentes NextJS
import Head from 'next/head';

// Styles & Logo & Ícones
import styles from '../../styles/dashboard.module.scss';
import { FiRefreshCcw } from 'react-icons/fi'

// Componentes Próprios
import { Header } from '../components/Header/Header';
import { ModalOrder } from '../components/ModalOrder/Modal';


// Context & Autorização
import { canSSRAuth } from '../utils/canSSRAuth'
import { setupAPIClient } from '../services/api'

// React Modal
import Modal from 'react-modal';
import { GetServerSideProps } from 'next';


// Types
type OrderProps = {
  id: string;
  status: boolean;
  draft: boolean;
  name: string | null;
  Table: {
    number: number
  }
}

interface HomeProps {
  orders: OrderProps[];
}

export type OrderItemProps = {
  id: string;
  amount: number;
  order_id: string;
  product_id: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    banner: string;
  }
  order: {
    id: string;
    status: boolean;
    name: string | null;
    Table: {
      number: number
    }
  }
}


export default function Dashboard({ orders }: HomeProps) {

  const [orderList, setOrderList] = useState(orders || [])

  const [modalItem, setModalItem] = useState<OrderItemProps[]>()
  const [modalVisible, setModalVisible] = useState(false);



  function handleCloseModal() {
    setModalVisible(false);
  }

  async function handleOpenModalView(id: string) {

    const apiClient = setupAPIClient();

    const response = await apiClient.get('/order/detail', {
      params: {
        order_id: id,
      }
    })

    setModalItem(response.data);
    setModalVisible(true);

  }


  async function handleFinishItem(id: string) {
    const apiClient = setupAPIClient();
    await apiClient.put('/order/finish', {
      order_id: id,
    })

    const response = await apiClient.get('/orders');

    setOrderList(response.data);
    setModalVisible(false);
  }


  async function handleRefreshOrders() {
    const apiClient = setupAPIClient();

    const response = await apiClient.get('/orders')
    setOrderList(response.data);

  }

  Modal.setAppElement('#__next');


  return (
    <>
      <Head>
        <title>Painel</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>

          <div className={styles.containerHeader}>
            <h1>Últimos pedidos</h1>
            <button className={styles.btnRefresh} onClick={() => { handleRefreshOrders() }}>
              <FiRefreshCcw style={{ color: 'var(--green-900)' }} size={25} />
            </button>
          </div>

          <article className={styles.listOrders}>

            {orderList.length === 0 && (
              <span className={styles.emptyList}>
                Nenhum pedido aberto foi encontrado...
              </span>
            )}

            {orderList.map(item => (
              <section key={item.id} className={styles.orderItem}>
                <button onClick={() => handleOpenModalView(item.id)}>
                  <div className={styles.tag}></div>
                  <span>Mesa {item.Table.number}</span>
                </button>
              </section>
            ))}

          </article>

        </main>

        {modalVisible && (
          <ModalOrder
            isOpen={modalVisible}
            onRequestClose={handleCloseModal}
            order={modalItem}
            handleFinishOrder={handleFinishItem}
          />
        )}

      </div>
    </>
  )
}




export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return canSSRAuth(['cozinha'], async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get('/orders');
    
    return {
      props: {
        orders: response.data
      },
    };
  })(ctx);
};
