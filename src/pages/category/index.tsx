import Head from "next/head";
import { FormEvent, useContext, useState } from "react";
import { toast } from "react-toastify";

import { Header } from "../../components/Header";
import { AuthContext } from "../../contexts/AuthContext";
import { canSSRAuth } from "../../utils/canSSRAuth";
import styles from "./styles.module.scss";

export default function Category() {
  const [name, setName] = useState("");
  const { category } = useContext(AuthContext);

  async function handleCategory(event: FormEvent) {
    event.preventDefault();

    if (name === "" || name.length <= 3) {
      toast.warning("Categoria deve conter 3 caracteres ou mais");
      return;
    }
    await category({ name });
  }

  return (
    <>
      <Head>
        <title>Nova categoria</title>
      </Head>
      <div>
        <Header />
        <main className={styles.container}>
          <h1>Cadastrar categorias</h1>

          <form onSubmit={handleCategory} className={styles.form}>
            <input
              type="text"
              placeholder="Digite o nome da categoria"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
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

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
