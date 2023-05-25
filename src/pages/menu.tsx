// import { GetServerSideProps } from 'next';
// import { useContext, useEffect, useState } from 'react';
// import { AuthContext } from '../contexts/AuthContext';
// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import { api } from '../services/apiClient';

// import styles from '../../styles/menu.module.scss';
// import Image from 'next/image';
// import { BsTrash } from 'react-icons/bs';
// import { Header } from '../components/Header/Header';
// import { setupAPIClient } from '../services/api';
// import { toast } from 'react-toastify';

// const Cardapio = ({ categories }) => {
//   const { role, user } = useContext(AuthContext);
//   const [isAuthorized, setIsAuthorized] = useState(false);

//   useEffect(() => {
//     if (role === 'admin') {
//       setIsAuthorized(true);
//     }
//   }, [role]);

//   const settings = {
//     dots: true,
//     infinite: categories.products > 3,
//     speed: 500,
//     slidesToShow: 5,
//     slidesToScroll: 3,
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 3,
//           slidesToScroll: 2,
//         },
//       },
//       {
//         breakpoint: 768,
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//         },
//       },
//     ],
//   };

//   async function handleRemove(id: string) {
//     try {
//       await api.delete("/product/delete", {
//         params: {
//           product_id: id,
//         },
//       });
//       toast.success("Produto Deletado Com Sucesso");

//     } catch (err) {
//       console.log(err);
//       toast.error("Erro Ao Deletar Produto");
//     }
//   }



//   return (
//     <>
//       {user && <Header />}
//       <div className={styles.menuContainer}>
//         <h2 className={styles.title}>Cardápio</h2>
//         <div className={styles.categoryContainer}>
//           {categories.map((category) => (
//             category.products.length > 0 && (
//               <div key={category.id}>
//                 <h3 className={styles.categoryTitle}>{category.name}</h3>
//                 <div className={styles.productList}>
//                   <Slider {...settings}>
//                     {category.products.map((product, index) => (
//                       <div key={index} className={styles.card}>
//                         <div className={styles.imagem}>
//                           <Image alt={product.name} width={264} height={136} src={product.image} className={styles.img} />
//                         </div>
//                         <div className={styles.info}>
//                           <h2>{product.name}</h2>
//                           <small>{product.description}</small>
//                           <div className={styles.price}>
//                             <p>a partir de <span>R$ {product.price}</span></p>
//                           </div>
//                         </div>{isAuthorized && (
//                           <a className={styles.deleteButton} onClick={() => {
//                             handleRemove(product.id)
//                           }}><BsTrash /></a>
//                         )}
//                       </div>
//                     ))}
//                   </Slider>
//                 </div>
//               </div>
//             )
//           ))}
//         </div>
//       </div>
//       </>
//   );
// };

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   let categories = [];

//   try {
//     const response = await api.get('/products/all');
//     categories = response.data;
//   } catch (error) {
//     console.error('Erro ao obter o cardápio:', error);
//   }

//   return {
//     props: {
//       categories,
//     },
//   };
// };

// export default Cardapio;


import { GetServerSideProps } from 'next';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { api } from '../services/apiClient';

import styles from '../../styles/menu.module.scss';
import Image from 'next/image';
import { BsTrash } from 'react-icons/bs';
import { Header } from '../components/Header/Header';
import { setupAPIClient } from '../services/api';
import { toast } from 'react-toastify';

const Cardapio = ({ categories }) => {
  const { role, user } = useContext(AuthContext);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [productList, setProductList] = useState(categories);

  useEffect(() => {
    if (role === 'admin') {
      setIsAuthorized(true);
    }
  }, [role]);

  const settings = {
    dots: true,
    infinite: categories.products > 3,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  async function handleRemove(id: string) {
    try {
      await api.delete("/product/delete", {
        params: {
          product_id: id,
        },
      });
      toast.success("Produto Deletado Com Sucesso");
      setProductList(prevList =>
        prevList.map(category => ({
          ...category,
          products: category.products.filter(product => product.id !== id)
        }))
      );
    } catch (err) {
      console.log(err);
      toast.error("Erro Ao Deletar Produto");
    }
  }

  return (
    <>
      {user && <Header />}
      <div className={styles.menuContainer}>
        <h2 className={styles.title}>Cardápio</h2>
        <div className={styles.categoryContainer}>
          {productList.map(category => (
            category.products.length > 0 && (
              <div key={category.id}>
                <h3 className={styles.categoryTitle}>{category.name}</h3>
                <div className={styles.productList}>
                  <Slider {...settings}>
                    {category.products.map(product => (
                      <div key={product.id} className={styles.card}>
                        <div className={styles.imagem}>
                          <Image alt={product.name} width={264} height={136} src={product.image} className={styles.img} />
                        </div>
                        <div className={styles.info}>
                          <h2>{product.name}</h2>
                          <small>{product.description}</small>
                          <div className={styles.price}>
                            <p>a partir de <span>R$ {product.price}</span></p>
                          </div>
                        </div>
                        {isAuthorized && (
                          <a className={styles.deleteButton} onClick={() => handleRemove(product.id)}><BsTrash /></a>
                        )}
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let categories = [];

  try {
    const response = await api.get('/products/all');
    categories = response.data;
  } catch (error) {
    console.error('Erro ao obter o cardápio:', error);
  }

  return {
    props: {
      categories,
    },
  };
};

export default Cardapio;

