import axios from "axios";
import React, { useEffect, useState } from "react";
import "./OrderHistory.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import LoadingScreen from './LoadingScreen';

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const response = await axios.post(
          "http://localhost:8181/db/order_history",
          { token }
        );

        if (response.status === 200) {
          setOrderHistory(response.data);
        }
      } catch (error) {
        toast.error("No order history", error);
        console.error("Error fetching order history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);


  const calculateTotal = (items) => {
    let total = 0;
    items.forEach((item) => {
      total += item.quantity * item.price;
    });
    return total;
  };

  const HandleInvoice = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await axios.post(
        "http://localhost:8181/db/invoice",
        { token, id });
      localStorage.setItem("invoice", JSON.stringify(response.data));
      navigate("invoice");
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
  };


  return (
    <>
      <ToastContainer/>
      {loading ? (
        <LoadingScreen/>
      )
       : orderHistory.length === 0 ? (
        <div className="no-order-history">
          <h1>You have no order history.</h1>
        </div>
      ) : (
        <div className="dotted-bg">
          <div className="order-history">
            <div className="order-history-header">
              <h1>- Order History -</h1>
            </div>

            {orderHistory.map((order) => (

              <div className="order-item " key={order._id}>
                <div class="perforation-lines">
                  <h3> RECEIPT:</h3>

                  <p>
                    <b>Order ID:</b> {order.id}
                  </p>
                  <p>
                    <b>Order Placed on:</b> {order.date}
                  </p>
                  <p>
                    <b>Order Placed by: </b>
                    {order.name}
                  </p>
                  <p>
                    <b>Order Status:</b>{" "}
                    {order.status === "paid" ? (
                      <span style={{ color: "green" }}>
                        <b>Paid</b>
                      </span>) : order.status === "cancelled" ? (
                        <span style={{ color: "red" }}>
                          <b>Cancelled</b>
                        </span>
                      ) : (
                      order.status
                    )}
                  </p>

                  <h3>Items:</h3>
                  <ul>
                    {order.item.map((item) => (
                      <div className="item-details" key={item.item}>
                        <p>
                          <b>{item.item}</b>- | x{item.quantity} | - Price:{" "}
                          {item.price}
                        </p>
                      </div>
                    ))}
                  </ul>

                  <h5>
                    <b>Total: </b>₹{calculateTotal(order.item)}
                  </h5>
                  {order.status === "paid" ? (
                    <button className="btn btn-outline-dark" id="logout" onClick={() => HandleInvoice(order.id)}>
                      View Invoice
                    </button>
                  ) : null}
                </div>
              </div>

            ))}

          </div>
        </div>


      )}
    </>
  );
};

export default OrderHistory;
