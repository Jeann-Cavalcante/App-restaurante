import Head from "next/head";
import { useState } from "react";
import { FiRefreshCcw } from "react-icons/fi";
import Modal from "react-modal";

import { Header } from "../../components/Header";
import { ModalOrder } from "../../components/ModalOrder";
import { setupAPIClient } from "../../services/api";
import { canSSRAuth } from "../../utils/canSSRAuth";
import styles from "./styles.module.scss";

type OrderProps = {
  id: string;
  table: string | number;
  status: boolean;
  draft: boolean;
  name: string | null;
};

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
  };
  order: {
    id: string;
    table: string | number;
    status: boolean;
    name: string;
  };
};

export default function Dashboard({ orders }: HomeProps) {
  const [orderList, setOrderList] = useState(orders || []);

  const [modalItem, setModalItem] = useState<OrderItemProps[]>();
  const [modalVisible, setmodalVisible] = useState(false);

  function handleCloseModal() {
    setmodalVisible(false);
  }

  async function handleOpenModalView(id: string) {
    const apiClient = setupAPIClient();

    const response = await apiClient.get("/orders/details", {
      params: {
        order_id: id,
      },
    });

    setModalItem(response.data);
    setmodalVisible(true);
  }

  async function handleFinishItem(id: string) {
    // console.log("Fechar pedido: " + id);
    const apiClient = setupAPIClient();
    await apiClient.put("/order/finish", {
      order_id: id,
    });
    const response = await apiClient("/orders");

    setOrderList(response.data);

    setmodalVisible(false);
  }

  async function handlerefreshOrder() {
    const apiClient = setupAPIClient();
    const response = await apiClient.get("/orders");

    setOrderList(response.data);
  }

  Modal.setAppElement("#__next");

  return (
    <>
      <Head>
        <title>Painel - Sujeito programador</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <div className={styles.containerHeader}>
            <h1>Últimos pedidos</h1>
            <button onClick={handlerefreshOrder}>
              <FiRefreshCcw size={25} color="#3fffa3" />
            </button>
          </div>

          <article className={styles.listOrders}>
            {/* Se não houver pedido */}
            {orderList.length === 0 && (
              <span className={styles.emptyList}>
                Nenhum pedido encontrado..
              </span>
            )}

            {orderList.map((item) => (
              <section key={item.id} className={styles.orderItem}>
                <button onClick={() => handleOpenModalView(item.id)}>
                  <div className={styles.tag}></div>
                  <span>Mesa {item.table}</span>
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
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get("/orders");

  return {
    props: {
      orders: response.data,
    },
  };
});
