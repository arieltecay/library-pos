import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCart } from './useCart';
import type { Product } from '../../../types';

const createMockProducts = (): Product[] => [
  {
    id: 'prod-1',
    name: 'Café',
    type: 'product',
    price: 1500,
    stock: 10,
    active: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'prod-2',
    name: 'Corte de pelo',
    type: 'service',
    price: 5000,
    stock: 0,
    active: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'prod-3',
    name: 'Agua',
    type: 'product',
    price: 800,
    stock: 5,
    active: true,
    createdAt: '',
    updatedAt: '',
  },
];

const mockProducts = createMockProducts();

const createHook = () => renderHook(() => useCart(mockProducts));

const addToCart = (result: ReturnType<typeof useCart>, product: Product) =>
  act(() => result.addToCart(product));

const updateQty = (result: ReturnType<typeof useCart>, id: string, qty: number) =>
  act(() => result.updateQuantity(id, qty));

const addQty = (result: ReturnType<typeof useCart>, id: string, delta: number) =>
  act(() => result.addQuantity(id, delta));

const remove = (result: ReturnType<typeof useCart>, id: string) =>
  act(() => result.removeItem(id));

const clear = (result: ReturnType<typeof useCart>) => act(() => result.clearCart());

describe('useCart - initial state', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should start with empty cart', () => {
    const { result } = createHook();
    expect(result.current.cart).toEqual([]);
    expect(result.current.subtotal).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });
});

describe('useCart - addToCart', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should add product to cart', () => {
    const { result } = createHook();
    addToCart(result.current, mockProducts[0]);
    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0]).toMatchObject({
      product: 'prod-1',
      name: 'Café',
      quantity: 1,
      unitPrice: 1500,
      subtotal: 1500,
    });
    expect(result.current.subtotal).toBe(1500);
    expect(result.current.itemCount).toBe(1);
  });

  it('should increment quantity when adding same product', () => {
    const { result } = createHook();
    addToCart(result.current, mockProducts[0]);
    addToCart(result.current, mockProducts[0]);
    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(2);
    expect(result.current.cart[0].subtotal).toBe(3000);
    expect(result.current.subtotal).toBe(3000);
  });

  it('should not exceed stock for products', () => {
    const { result } = createHook();
    for (let i = 0; i < 15; i++) addToCart(result.current, mockProducts[0]);
    expect(result.current.cart[0].quantity).toBe(10);
    expect(result.current.cart[0].subtotal).toBe(15000);
  });

  it('should allow unlimited quantity for services', () => {
    const { result } = createHook();
    for (let i = 0; i < 20; i++) addToCart(result.current, mockProducts[1]);
    expect(result.current.cart[0].quantity).toBe(20);
    expect(result.current.cart[0].subtotal).toBe(100000);
  });
});

describe('useCart - updateQuantity', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should update quantity directly', () => {
    const { result } = createHook();
    addToCart(result.current, mockProducts[0]);
    updateQty(result.current, 'prod-1', 5);
    expect(result.current.cart[0].quantity).toBe(5);
    expect(result.current.cart[0].subtotal).toBe(7500);
  });

  it('should remove item when quantity set to 0', () => {
    const { result } = createHook();
    addToCart(result.current, mockProducts[0]);
    updateQty(result.current, 'prod-1', 0);
    expect(result.current.cart).toHaveLength(0);
    expect(result.current.subtotal).toBe(0);
  });

  it('should not exceed stock when updating quantity', () => {
    const { result } = createHook();
    addToCart(result.current, mockProducts[0]);
    updateQty(result.current, 'prod-1', 15);
    expect(result.current.cart[0].quantity).toBe(10);
  });
});

describe('useCart - removeItem', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should remove specific item', () => {
    const { result } = createHook();
    addToCart(result.current, mockProducts[0]);
    addToCart(result.current, mockProducts[2]);
    remove(result.current, 'prod-1');
    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].product).toBe('prod-3');
  });
});

describe('useCart - clearCart', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should clear entire cart', () => {
    const { result } = createHook();
    addToCart(result.current, mockProducts[0]);
    addToCart(result.current, mockProducts[2]);
    clear(result.current);
    expect(result.current.cart).toHaveLength(0);
    expect(result.current.subtotal).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });
});

describe('useCart - subtotal & itemCount', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should calculate subtotal correctly with multiple items', () => {
    const { result } = createHook();
    addToCart(result.current, mockProducts[0]);
    addToCart(result.current, mockProducts[0]);
    addToCart(result.current, mockProducts[2]);
    expect(result.current.subtotal).toBe(3800);
    expect(result.current.itemCount).toBe(3);
  });
});

describe('useCart - addQuantity', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should handle addQuantity with positive and negative values', () => {
    const { result } = createHook();
    addToCart(result.current, mockProducts[0]);
    addQty(result.current, 'prod-1', 3);
    expect(result.current.cart[0].quantity).toBe(4);
    addQty(result.current, 'prod-1', -2);
    expect(result.current.cart[0].quantity).toBe(2);
  });

  it('should remove item when addQuantity makes it zero or negative', () => {
    const { result } = createHook();
    addToCart(result.current, mockProducts[0]);
    addQty(result.current, 'prod-1', -5);
    expect(result.current.cart).toHaveLength(0);
  });
});