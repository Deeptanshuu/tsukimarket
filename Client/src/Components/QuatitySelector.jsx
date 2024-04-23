import React from 'react';

const QuantitySelector = ({ quantity, onIncrement, onDecrement, state }) => {

  return (
    <div className= "quantity-box" style={{opacity: state ? 1 : 0.5, cursor: state ? "pointer" : "not-allowed"}}>
      <button onClick={onDecrement} disabled={!state}>-</button>
      <span>{quantity}</span>
      <button onClick={onIncrement} disabled={!state}>+</button>
    </div>
  );
};

export default QuantitySelector;
