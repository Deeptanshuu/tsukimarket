import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from './Components/CartContext';
import QuantitySelector from './Components/QuantitySelector';

const sweater = { id: 'm-1 M', ref: 'm-1', name: 'Melted Sweater', price: 9000 };
const beanie = { id: 'k-2 L', ref: 'k-2', name: 'Knit Beanie', price: 1999 };

// small harness that exposes the cart through the DOM
const CartProbe = () => {
  const cart = useCart();
  return (
    <div>
      <button onClick={() => cart.addToCart(sweater, 1, 'M')}>add sweater</button>
      <button onClick={() => cart.addToCart(beanie, 2, 'L')}>add beanies</button>
      <button onClick={() => cart.removeFromCart(sweater)}>remove sweater</button>
      <button onClick={() => cart.clearCart()}>clear</button>
      <span data-testid="count">{cart.cart.reduce((n, i) => n + i.quantity, 0)}</span>
      <span data-testid="subtotal">{cart.calculateTotal()}</span>
      <span data-testid="tax">{cart.calculateTax()}</span>
      <span data-testid="shipping">{cart.calculateShipping()}</span>
      <span data-testid="grand">{cart.calculateTotalWithTaxAndShipping()}</span>
    </div>
  );
};

const renderCart = () => render(<CartProvider><CartProbe /></CartProvider>);

beforeEach(() => localStorage.clear());

test('cart totals match what the server charges (10% tax, ₹100 shipping per item)', () => {
  renderCart();
  fireEvent.click(screen.getByText('add sweater'));
  fireEvent.click(screen.getByText('add beanies'));

  expect(screen.getByTestId('count')).toHaveTextContent('3');
  expect(screen.getByTestId('subtotal')).toHaveTextContent('12998');
  expect(screen.getByTestId('tax')).toHaveTextContent('1299.80');
  expect(screen.getByTestId('shipping')).toHaveTextContent('300.00');
  expect(screen.getByTestId('grand')).toHaveTextContent('14597.80');
});

test('cart is saved to localStorage and can be removed / cleared', () => {
  renderCart();
  fireEvent.click(screen.getByText('add sweater'));
  fireEvent.click(screen.getByText('add beanies'));
  expect(JSON.parse(localStorage.getItem('cart'))).toHaveLength(2);

  fireEvent.click(screen.getByText('remove sweater'));
  expect(screen.getByTestId('subtotal')).toHaveTextContent('3998');

  fireEvent.click(screen.getByText('clear'));
  expect(screen.getByTestId('count')).toHaveTextContent('0');
  expect(JSON.parse(localStorage.getItem('cart'))).toEqual([]);
});

test('quantity selector calls its handlers and can be disabled', () => {
  const inc = jest.fn();
  const dec = jest.fn();
  const { rerender } = render(<QuantitySelector quantity={2} onIncrement={inc} onDecrement={dec} state={true} />);

  fireEvent.click(screen.getByText('+'));
  fireEvent.click(screen.getByText('-'));
  expect(inc).toHaveBeenCalledTimes(1);
  expect(dec).toHaveBeenCalledTimes(1);
  expect(screen.getByText('2')).toBeInTheDocument();

  rerender(<QuantitySelector quantity={2} onIncrement={inc} onDecrement={dec} state={false} />);
  expect(screen.getByText('+')).toBeDisabled();
});
