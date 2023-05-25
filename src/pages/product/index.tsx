// Componentes React
import { useState, ChangeEvent, FormEvent } from "react";

// Componentes NextJS
import Head from "next/head";

// Styles & Logo & Ícones
import styles from "../../../styles/product.module.scss"
import { MdOutlineUploadFile } from "react-icons/md";

// Componentes Próprios
import { Header } from "../../components/Header/Header";

// React Toastify
import { toast } from "react-toastify";

// Context & Autorização
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";

//Hooks Próprios
import useForm from "../../hooks/useForm";
import { GetServerSideProps } from "next";

// Types
type ItemProps = {
  id: string;
  name: string;
};

export interface CategoryProps {
  categoryList: ItemProps[];
}

export default function Product({ categoryList }: CategoryProps) {

  const name = useForm("");
  const price = useForm("");
  const description = useForm("");

  const [avatarUrl, setAvatarUrl] = useState("");
  const [imageAvatar, setImageAvatar] = useState(null);

  const [categories] = useState(categoryList || []);
  const [categorySelected, setCategorySelected] = useState(0);

  function handleFile({ target }: ChangeEvent<HTMLInputElement>) {
    if (!target.files) {
      return;
    }

    const image = target.files[0];

    if (!image) {
      return;
    }

    if (image.type === "image/jpeg" || image.type === "image/png") {
      setImageAvatar(image);
      setAvatarUrl(URL.createObjectURL(target.files[0]));
    }
  }

  function handleChangeCategory({ target }) {
    setCategorySelected(target.value);
  }

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    try {
      const data = new FormData();

      if (
        name.value === "" ||
        price.value === "" ||
        description.value === "" ||
        imageAvatar === null
      ) {
        toast.error("Preencha todos os campos!");
        return;
      }

      data.append("name", name.value);
      data.append("price", price.value);
      data.append("description", description.value);
      data.append("category_id", categories[categorySelected].id);
      data.append("file", imageAvatar);

      const apiClient = setupAPIClient();

      await apiClient.post("/product/create", data);

      toast.success("Cadastrado com sucesso!");
    } catch (err) {
      console.log(err);
      toast.error("Ops erro ao cadastrar!");
    }

    name.setValue("");
    price.setValue("");
    description.setValue("");
    setImageAvatar(null);
    setAvatarUrl("");
  }

  return (
    <>
      <Head>
        <title>Novo produto</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <h1>Novo produto</h1>

          <form className={styles.form} onSubmit={handleRegister}>
            <label className={styles.labelAvatar}>
              <span>
                <MdOutlineUploadFile size={30} color="#FFF" />
              </span>

              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFile}
              />

              {avatarUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className={styles.preview}
                  src={avatarUrl}
                  alt="Foto do produto"
                  width={250}
                  height={250}
                />
              )}
            </label>

            <select value={categorySelected} onChange={handleChangeCategory}>
              {categories.map((item, index) => {
                return (
                  <option key={item.id} value={index}>
                    {item.name}
                  </option>
                );
              })}
            </select>

            <input
              type="text"
              placeholder="Digite o nome do produto"
              className={styles.input}
              {...name}
            />

            <input
              type="text"
              placeholder="Preço do produto"
              className={styles.input}
              {...price}
            />

            <textarea
              placeholder="Descreva seu produto..."
              className={styles.input}
              {...description}
            />

            <button className={styles.buttonAdd} type="submit">
              Cadastrar
            </button>
          </form>
        </main>
      </div>
    </>
  );
}


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
