import React from 'react';

const QuantitySelector = ({ quantity, onIncrement, onDecrement }) => {
  

  return (
    <div className='quantity-box'>
      <button onClick={onDecrement}>-</button>
      <span>{quantity}</span>
      <button onClick={onIncrement}>+</button>
    </div>
  );
};

export default QuantitySelector;
