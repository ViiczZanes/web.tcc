// import React, { useState } from 'react'
// import { canSSRAuth } from '../../utils/canSSRAuth'
// import { setupAPIClient } from '../../services/api'
// import { Header } from '../../components/Header/Header';
// import Head from 'next/head';
// import { FiRefreshCcw } from 'react-icons/fi';
// import styles from '../../../styles/dashboard.module.scss';
// import Router from 'next/router';
// import { GetServerSideProps } from 'next';

// interface finishProps {
//   tables: TablesProps[];
// }

// type TablesProps = {
//   id: string;
//   number: number;
//   orders: OrderProps[];
// }

// type OrderProps = {
//   id: string;
//   status: boolean;
//   draft: boolean;
//   created_at: string;
//   updated_at: string;
//   tableId: string;
// }

// const finish = ({ tables }: finishProps) => {

//   const [tablesOpen, setTablesOpen] = useState(tables || [])

//   async function handleRefreshTables() {
//     const apiClient = setupAPIClient();

//     const response = await apiClient.get('/tables/orders/open')
//     setTablesOpen(response.data);
//   }


//   return (
//     <>

//       <Head>
//         <title>Finalizar Contas</title>
//       </Head>
//       <Header />
//       <div>

//         <main className={styles.container}>

//           <div className={styles.containerHeader}>
//             <h1>Últimos pedidos</h1>
//             <button className={styles.btnRefresh} onClick={() => {
//               handleRefreshTables()
//             }}>
//               <FiRefreshCcw style={{ color: 'var(--green-900)' }} size={25} />
//             </button>
//           </div>

//           <article className={styles.listOrders}>

//             {tablesOpen.length === 0 && (
//               <span className={styles.emptyList}>
//                 Nenhum pedido aberto foi encontrado...
//               </span>
//             )}

//             {tablesOpen.map(item => (
//               <section key={item.id} className={styles.orderItem}>
//                 <button onClick={() => {
//                   Router.push(`/finish/${item.id}`)
//                 }}>
//                   <div className={styles.tag}></div>
//                   <span>Mesa {item.number}</span>
//                 </button>
//               </section>
//             ))}

//           </article>

//         </main>
//       </div >
//     </>
//   )
// }


// export default finish

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   return canSSRAuth(['caixa'], async (ctx) => {
//     const apiClient = setupAPIClient(ctx);
//     const response = await apiClient.get('/tables/orders/open');

//     return {
//       props: {
//         tables: response.data
//       },
//     };
//   })(ctx);
// };


import React, { useState } from 'react';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { setupAPIClient } from '../../services/api';
import { Header } from '../../components/Header/Header';
import Head from 'next/head';
import { FiRefreshCcw } from 'react-icons/fi';
import styles from '../../../styles/dashboard.module.scss';
import Router from 'next/router';
import { GetServerSideProps } from 'next';

interface FinishProps {
  tables: TablesProps[];
}

type TablesProps = {
  id: string;
  number: number;
  orders: OrderProps[];
}

type OrderProps = {
  id: string;
  status: boolean;
  draft: boolean;
  created_at: string;
  updated_at: string;
  tableId: string;
}

const Finish = ({ tables }: FinishProps) => {

  const [tablesOpen, setTablesOpen] = useState(tables || []);

  async function handleRefreshTables() {
    const apiClient = setupAPIClient();

    const response = await apiClient.get('/tables/orders/open');
    setTablesOpen(response.data);
  }

  return (
    <>
      <Head>
        <title>Finalizar Contas</title>
      </Head>
      <Header />
      <div>
        <main className={styles.container}>
          <div className={styles.containerHeader}>
            <h1>Últimos pedidos</h1>
            <button
              className={styles.btnRefresh}
              onClick={() => {
                handleRefreshTables();
              }}
            >
              <FiRefreshCcw style={{ color: 'var(--green-900)' }} size={25} />
            </button>
          </div>

          <article className={styles.listOrders}>
            {tablesOpen.length === 0 && (
              <span className={styles.emptyList}>
                Nenhum pedido aberto foi encontrado...
              </span>
            )}

            {tablesOpen.map(item => (
              <section key={item.id} className={styles.orderItem}>
                <button
                  onClick={() => {
                    Router.push(`/finish/${item.id}`);
                  }}
                >
                  <div className={styles.tag}></div>
                  <span>Mesa {item.number}</span>
                </button>
              </section>
            ))}
          </article>
        </main>
      </div>
    </>
  );
}

export default Finish;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return canSSRAuth(['caixa'], async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get('/tables/orders/open');

    return {
      props: {
        tables: response.data
      },
    };
  })(ctx);
};

