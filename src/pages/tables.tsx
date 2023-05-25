// Componentes React
import { useState, FormEvent } from "react";

// Componentes NextJS
import Head from "next/head";

// Styles & Logo & Ícones
import styles from "../../styles/category.module.scss";
import { BsTrash } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";

// Componentes Próprios
import { Header } from "../components/Header/Header";

// React Toastify
import { toast } from "react-toastify";

// Context & Autorização
import { setupAPIClient } from "../services/api";
import { canSSRAuth } from "../utils/canSSRAuth";

//Hooks Próprios
import useForm from "../hooks/useForm";
import { GetServerSideProps } from "next";

//Types
interface TableProps {
  TableList: ItemProps[];
}

type ItemProps = {
  id: string,
  number: number
}

export default function Category({ TableList }: TableProps) {
  const tableNumber = useForm("");

  const [tables, setTables] = useState(TableList || []);

  let hasTable = false;

  if (tables.length != 0) {
    hasTable = true
  }

  const apiClient = setupAPIClient();

  async function handleRemove(id: string) {
    try {
      await apiClient.delete("/table/delete", {
        params: {
          table_id: id,
        },
      });
      toast.success("Categoria Deletada Com Sucesso");

      const newTables = tables.filter((table) => table.id != id);

      setTables(newTables);
    } catch (err) {
      console.log(err);
      toast.error("Erro Ao Deletar Categoria");
    }
  }

  async function handleRegister(event: FormEvent) {
    event.preventDefault();
    if (tableNumber.value === "") {
      return;
    }

    const response = await apiClient.post("/table/create", {
      number: Number(tableNumber.value),
    });

    const newTables = tables;
    newTables.push(response.data);
    setTables(newTables);
    toast.success("Categoria cadastrada com sucesso!");
    tableNumber.setValue("");
  }

  return (
    <>
      <Head>
        <title>Nova Mesa</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <h1>Cadastrar Mesas</h1>

          <form className={styles.form} onSubmit={handleRegister}>
            <input
              type="number"
              placeholder="Digite o o numero da mesa"
              className={styles.input}
              {...tableNumber}
            />

            <button className={styles.buttonAdd} type="submit">
              <AiOutlinePlus />
            </button>
          </form>

          {hasTable && <table className={styles.table}>
            <thead className={styles.thead}>
              <th>Mesas</th>
              <th></th>
            </thead>
            <tbody className={styles.tbody}>
              {tables.map(({ number, id }) => {
                return (
                  <tr key={id} className={styles.tr}>
                    <td>{number}</td>
                    <td className={styles.actions}>
                      <a>
                        <BsTrash
                          onClick={() => {
                            handleRemove(id);
                          }}
                          className={styles.action}
                        />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>}
        </main>
      </div>
    </>
  );
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return canSSRAuth(['garcom'], async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/tables");
    
    return {
      props: {
        TableList: response.data,
      },
    };
  })(ctx);
};


