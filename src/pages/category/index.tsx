// Componentes React
import { useState, FormEvent } from "react";

// Componentes NextJS
import Head from "next/head";

// Styles & Logo & Ícones
import styles from "../../../styles/category.module.scss";
import { BsTrash } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";

// Componentes Próprios
import { Header } from "../../components/Header/Header";

// React Toastify
import { toast } from "react-toastify";

// Context & Autorização
import { setupAPIClient } from "../../services/api";
import { canSSRAuth } from "../../utils/canSSRAuth";

//Hooks Próprios
import useForm from "../../hooks/useForm";

//Types
import { CategoryProps } from "../product";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";

export default function Category({ categoryList }: CategoryProps) {
  const name = useForm("");

  const [categories, setCategories] = useState(categoryList || []);

  let hasCategory = false;

  if (categories.length != 0) {
    hasCategory = true
  }

  const apiClient = setupAPIClient();

  async function handleRemove(id: string) {
    try {
      await apiClient.delete("/category/delete", {
        params: {
          category_id: id,
        },
      });
      toast.success("Categoria Deletada Com Sucesso");

      const newCategories = categories.filter((category) => category.id != id);

      setCategories(newCategories);
    } catch (err) {
      console.log(err);
      toast.error("Erro Ao Deletar Categoria");
    }
  }

  async function handleRegister(event: FormEvent) {
    event.preventDefault();
    if (name.value === "") {
      return;
    }

    const response = await apiClient.post("/category/create", {
      name: name.value,
    });

    const newCategories = categories;
    newCategories.push(response.data);
    setCategories(newCategories);
    toast.success("Categoria cadastrada com sucesso!");
    name.setValue("");
  }

  return (
    <>
      <Head>
        <title>Nova Categoria</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <h1>Cadastrar categorias</h1>

          <form className={styles.form} onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Digite o nome da categoria"
              className={styles.input}
              {...name}
            />

            <button className={styles.buttonAdd} type="submit">
              <AiOutlinePlus />
            </button>
          </form>

          {hasCategory && <table className={styles.table}>
            <thead className={styles.thead}>
              <th>Categorias</th>
              <th></th>
            </thead>
            <tbody className={styles.tbody}>
              {categories.map(({ name, id }) => {
                return (
                  <tr key={id} className={styles.tr}>
                    <td>{name}</td>
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

// export const getServerSideProps = canSSRAuth(async (context) => {
//   return {
//     props: {},
//   };
// });



export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return canSSRAuth(['garcom'], async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get('/category/list');

    return {
      props: {
        categoryList: response.data
      },
    };
  })(ctx);
};
