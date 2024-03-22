import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="dotted-bg">
    <div className="contact-page">
      <div className="contact-text">
        <h3>Customer Support & Shipping Information</h3>
        <hr />
        <p>
          <b>Q1. How Can I Contact Tsuki Customer Support?</b>
          <hr />
          You may reach a Customer Service Representative at{" "}
          <b>hello@tsuki.market </b>.<u>Hours of Operation</u> Monday-Friday,
          9:00am EST-5:00pm EST (excluding holidays).
        </p>
        <hr />

        <p>
          <b>Q2. What is our Returns Policy ?</b>
          <hr />
          Please notify Customer Service before returning an item/order. The
          returned items must be unworn with the original tags still attached.
          Please note that the{" "}
          <b>
            customer is responsible for any fees associated with returning the
            package.
          </b>{" "}
          Your refund for the returned items (shipping fee excluded) will be
          processed once the package has been received back at our warehouse.
        </p>

        <hr />
        <p>
          <b>Q3. What are the shipping Costs ?</b>
          <hr />
          Shipping costs for your order are always displayed in the order
          breakdown on the checkout page. Your shipping price{" "}
          <b>
            depends on multiple criteria, including your shipping address,
            shipping method, and the number of items in your order.
          </b>
        </p>
        <hr/>
        <small>
          If you have more quries that need to be answered. Write to us at
          <b> -hello@tuski.market-</b>
          
        </small>
        <small>Happy Shopping !😊</small>
      </div>
    </div>
    </div>
  );
};

export default Contact;
