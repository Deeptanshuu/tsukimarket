import React from 'react';
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import './Invoice.css';
import { toast } from 'react-toastify';

const Invoice = () => {

  const createPDF = async () => {   
    toast.success('Invoice generated!');  
    const element = document.querySelector("#pdf");
    const pdf = new jsPDF("portrait", "pt", "a4"); 
    const data = await html2canvas(element, { scale: 2 });
    const img = data.toDataURL("image/png");  
    const imgProperties = pdf.getImageProperties(img);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth ) / imgProperties.width;
    pdf.addImage(img, "WEBP", 0, 0, pdfWidth, pdfHeight, undefined, "SLOW");
    pdf.save("invoice.pdf");

  };

  const downloadInvoice = () => {
    createPDF();
  };

  const invoiceData = JSON.parse(localStorage.getItem('invoice')).payload;


  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  return (
    <div className="invoice-wrapper">
    <div id='pdf' className="invoice-container">
      <div className="invoice">
        <div className="invoice-header">
        <img src="/TSUKI_LOGO.png" className="logo" alt="logo img" />
          <h1>Invoice</h1>
          <caption>Invoice ID: {invoiceData.id}</caption>
          <caption>Date: {formatDate(invoiceData.date)}</caption>
          <div className="invoice-details">
            <p>Bill To,</p>
            <p>Customer Name: {invoiceData.user}</p>
            <p>Address: {invoiceData.user_address}</p>
            <p>Email: {invoiceData.user_email}</p>
            <p>Phone: {invoiceData.user_phone}</p>
          </div>
        </div>
        <div className="invoice-items">
          <h2>ITEMS:</h2>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.order.map((item, index) => (
                <tr key={index}>
                  <td>{item.item}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price.toFixed(2)}</td>
                  <td>₹{(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3"> Grand Total: </td>
                <td>
                  ₹
                  {invoiceData.order.reduce(
                    (total, item) => total + item.quantity * item.price,
                    0
                  ).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
          <div className="invoice-footer">
          <h5><b>Paymet Mehod:</b></h5>
          <h5><b>CARD</b></h5>
          <h5>{" "}<br/></h5>
          <h5><b>Terms and Conditions applied:</b></h5>
          <p>Orders are subject to availability and confirmation.</p>
          <p>Refunds will be processed using the original payment method.</p>
          <h1>THANK YOU FOR YOUR PURCHASE 😊</h1>
          </div>
        </div>
      </div>
    </div>
    <button id='logout' className='btn btn-outline-dark' onClick={downloadInvoice}>Download PDF</button>
    </div>
  );
};

export default Invoice;