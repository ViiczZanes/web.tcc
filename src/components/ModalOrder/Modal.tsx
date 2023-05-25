// React Modal
import Modal from 'react-modal';

// Styles & Logo & Ícones
import styles from './Modal.module.scss';
import { FiX } from 'react-icons/fi'

// Types
import { OrderItemProps } from '../../pages/dashboard'

interface ModalOrderProps {
  isOpen: boolean;
  onRequestClose: () => void;
  order: OrderItemProps[];
  handleFinishOrder: (id: string) => void;
}

export function ModalOrder({ isOpen, onRequestClose, order, handleFinishOrder }: ModalOrderProps) {

  const customStyles = {
    content: {
      top: '50%',
      bottom: 'auto',
      left: '50%',
      right: 'auto',
      padding: '30px',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#1d1d2e'
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
    >

      <div className={styles.modalHeader}>
      <h2>Detalhes do pedido</h2>
        <button
          type="button"
          onClick={onRequestClose}
          className={`react-modal-close ${styles.buttonClose}`}
          style={{ background: 'transparent', border: 0 }}
        >
          <FiX size={45} color="#f34748" />
        </button>
      </div>


      <div className={styles.container}>

       
        <span className={styles.table}>
          Mesa: <strong style={{color: '#fff'}}>{order[0].order.Table.number}</strong>
        </span>

        {order.map(item => (
          <section key={item.id} className={styles.containerItem}>
            <span>{item.amount} - <strong style={{color: '#3498db'}}>{item.product.name}</strong></span>
            <span className={styles.description}>
              {item.product.description}
            </span>
          </section>
        ))}


        <button className={styles.buttonOrder} onClick={() => handleFinishOrder(order[0].order_id)}>
          Concluir pedido
        </button>


      </div>

    </Modal>
  )
}