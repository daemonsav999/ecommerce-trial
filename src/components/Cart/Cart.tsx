import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { cartItems, total, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <button 
          onClick={() => navigate('/products')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
      <div className="grid gap-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center border rounded-lg p-4">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-20 h-20 object-cover rounded"
            />
            <div className="ml-4 flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <div className="flex items-center mt-2">
                <span className="text-gray-600">
                  ${(item.discountPrice || item.price).toFixed(2)}
                </span>
                {item.discountPrice && (
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    ${item.price.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center mt-2">
                <button
                  className="px-2 py-1 border rounded"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <span className="mx-4">{item.quantity}</span>
                <button
                  className="px-2 py-1 border rounded"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
                <button
                  className="ml-4 text-red-600 hover:text-red-700"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold">
                ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-semibold">Total:</span>
          <span className="text-2xl font-bold">${total.toFixed(2)}</span>
        </div>
        <button
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
          onClick={() => navigate('/checkout')}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;