import React, { useState } from 'react'
import { setupAPIClient } from '../../services/api'
import { canSSRAuth } from '../../utils/canSSRAuth'
import { BsTrash } from "react-icons/bs";
import styles from '../../../styles/users.module.scss'
import { toast } from 'react-toastify';
import { Header } from '../../components/Header/Header';
import { BsFillPatchCheckFill } from 'react-icons/bs';
import { RiCloseCircleFill } from 'react-icons/ri'
import Router from 'next/router';
import { GetServerSideProps } from 'next';
import { Button } from '../../components/Form/Button/Button';

export type UserProps = {
  id: string;
  name: string;
  email: string;
  role: string;
}



const Users = ({ usersList }) => {


  const [users, setUsers] = useState(usersList || []);

  const apiClient = setupAPIClient();


  async function handleRemove(id: string) {
    try {
      await apiClient.delete("/user/delete", {
        params: {
          user_id: id,
        },
      });
      toast.success("Usuário Deletado Com Sucesso");

      const newUsers = users.filter((user) => user.id != id);

      setUsers(newUsers);
    } catch (err) {
      console.log(err);
      toast.error("Erro Ao Deletar Usuário");
    }
  }

  return (
    <>
      <Header />

      <div className={`container ${styles.container}`}>
        <button className={styles.btn} style={{marginBottom: '2rem'}} onClick={() => {
          Router.push('/users/signup')
        }}>Cadastrar</button>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th>
                Nome
              </th>
              <th>
                Email
              </th>
              <th>
                Tipo
              </th>
              <th className={styles.adm}>
                Admin
              </th>
              <th>
              </th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {
              users.map(({ id, name, email, role }: UserProps) => {


                return (
                  <tr key={id} className={styles.tr}>
                    <td>{name}</td>
                    <td>{email}</td>
                    <td>{role}</td>
                    <td className={styles.admBody}>{role == 'admin' ? (<BsFillPatchCheckFill style={{ fontSize: '1.1rem', color: '#3fffa3' }} />) : (<RiCloseCircleFill color='#FF3F4B' />)}</td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.btn} onClick={() => {
                            Router.push(`/users/${id}`)
                        }}>
                          Detalhes
                        </button>
                        <button className={styles.btnTrash} onClick={() => {
                          handleRemove(id)
                        }} >
                          <BsTrash />
                        </button>
                      </div>
                    </td>
                  </tr>


                )
              })
            }
          </tbody>
        </table>
      </div >

    </>
  )
}

export default Users

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return canSSRAuth(['admin'], async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get('/users');

    return {
      props: {
        usersList: response.data
      },
    };
  })(ctx);
};
