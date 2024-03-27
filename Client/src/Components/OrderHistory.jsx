import axios from "axios";
import React, { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import "./OrderHistory.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [NoOrder, setNoOrder] = useState(false);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      setTimeout(async () => {
        try {
          const token = JSON.parse(localStorage.getItem("token"));
          const response = await axios.post(
            "http://localhost:8181/db/order_history",
            { token }
          );
            setLoading(false);
            setOrderHistory(response.data);

        } catch (error) {
          setLoading(false);
          setNoOrder(true);
          toast.error("You have no order history:");
          console.error("Error fetching order history:", error);
        }
      }, 200);
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
      {loading  ? (
        <LoadingScreen />
      ) : (
      <div className="dotted-bg">
        <ToastContainer />
        <div className="order-history">
          <div className="order-history-header">
            <h1>- Order History -</h1>
          </div>
          <div className="no-order-history" style={{ display: NoOrder ? "block" : "none" }}><h1> You have no order history.</h1></div>

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
