import axios from "axios";
import React, { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);

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

        } 
        catch (error) {
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

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="dotted-bg">
        <div className="order-history">
            <div className="order-history-header">
                <h1>- Order History -</h1>
            </div>
          

          {orderHistory.map((order) => (
            <div className="order-item" key={order._id}>
              <h3> RECEIPT:</h3>

              <p><b>Order ID:</b> {order.id}</p>
              <p><b>Order Placed:</b> {order.date}</p>
              <p><b>Order Placed By: </b>{order.name}</p>

              <h3>Items:</h3>
              <ul>
                {order.item.map((item) => (
                    <div className="item-details" key={item.item}>
                    <p><b>{item.item}</b>- | x{item.quantity} | - Price:{" "}{item.price}</p>
                    </div>
                ))}
              </ul>

              <h5><b>Total: </b>₹{calculateTotal(order.item)}</h5>

            </div>
          ))}
        </div>
        </div>
      )}
    </>
  );
};

export default OrderHistory;
