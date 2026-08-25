import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSale } from './useSale';
import api from '../../../api/client';

describe('useSale', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should process checkout successfully', async () => {
    const mockSale = { 
      id: 'sale-1', 
      number: 1, 
      total: 10000, 
      change: 2000,
      subtotal: 10500,
      discount: 500,
      paymentMethod: 'cash',
      type: 'sale',
      client: { id: 'client-1', fullName: 'Test', balance: 0 } as { id: string; fullName: string; balance: number },
      seller: { id: 'seller-1', name: 'Seller', role: 'seller' },
      items: [{ product: 'prod-1', name: 'Product 1', type: 'product', quantity: 2, unitPrice: 5000, unitCost: 0, subtotal: 10000 }],
      createdAt: new Date().toISOString(),
    };
    vi.mocked(api.post).mockResolvedValue({
      data: { sale: mockSale },
    });

    const { result } = renderHook(() => useSale());

    let checkoutResult: { total: number; change: number; sale: any } | null = null;

    await act(async () => {
      checkoutResult = await result.current.checkout({
        items: [{ product: 'prod-1', quantity: 2 }],
        clientId: 'client-1',
        discount: 500,
        paymentMethod: 'cash',
        amountReceived: 12000,
      });
    });

    expect(checkoutResult).toEqual({ total: 10000, change: 2000, sale: mockSale });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(api.post).toHaveBeenCalledWith('/sales', {
      items: [{ product: 'prod-1', quantity: 2 }],
      clientId: 'client-1',
      discount: 500,
      paymentMethod: 'cash',
      amountReceived: 12000,
    });
  });

  it('should not send amountReceived for credit payment', async () => {
    const mockSale = { 
      id: 'sale-2', 
      number: 2, 
      total: 10000, 
      change: 0,
      subtotal: 10000,
      discount: 0,
      paymentMethod: 'credit' as const,
      type: 'sale' as const,
      client: { id: 'client-1', fullName: 'Test', balance: 0 },
      seller: { id: 'seller-1', name: 'Seller', role: 'seller' },
      items: [{ product: 'prod-1', name: 'Product 1', type: 'product' as const, quantity: 1, unitPrice: 10000, unitCost: 0, subtotal: 10000 }],
      createdAt: new Date().toISOString(),
    };
    vi.mocked(api.post).mockResolvedValue({
      data: { sale: mockSale },
    });

    const { result } = renderHook(() => useSale());

    await act(async () => {
      await result.current.checkout({
        items: [{ product: 'prod-1', quantity: 1 }],
        clientId: 'client-1',
        discount: 0,
        paymentMethod: 'credit',
        amountReceived: 0,
      });
    });

    expect(api.post).toHaveBeenCalledWith('/sales', {
      items: [{ product: 'prod-1', quantity: 1 }],
      clientId: 'client-1',
      discount: 0,
      paymentMethod: 'credit',
      amountReceived: undefined,
    });
  });

  it('should send amountReceived for transfer payment', async () => {
    const mockSale = { 
      id: 'sale-3', 
      number: 3, 
      total: 5000, 
      change: 0,
      subtotal: 5000,
      discount: 0,
      paymentMethod: 'transfer' as const,
      type: 'sale' as const,
      client: undefined,
      seller: { id: 'seller-1', name: 'Seller', role: 'seller' },
      items: [{ product: 'prod-1', name: 'Product 1', type: 'product' as const, quantity: 1, unitPrice: 5000, unitCost: 0, subtotal: 5000 }],
      createdAt: new Date().toISOString(),
    };
    vi.mocked(api.post).mockResolvedValue({
      data: { sale: mockSale },
    });

    const { result } = renderHook(() => useSale());

    await act(async () => {
      await result.current.checkout({
        items: [{ product: 'prod-1', quantity: 1 }],
        discount: 0,
        paymentMethod: 'transfer',
        amountReceived: 5000,
      });
    });

    expect(api.post).toHaveBeenCalledWith('/sales', expect.objectContaining({
      paymentMethod: 'transfer',
      amountReceived: 5000,
    }));
  });

  it('should throw on checkout error', async () => {
    vi.mocked(api.post).mockRejectedValue({
      response: { data: { message: 'Stock insuficiente' } },
    });

    const { result } = renderHook(() => useSale());

    await expect(
      act(async () => {
        await result.current.checkout({
          items: [{ product: 'prod-1', quantity: 1 }],
          discount: 0,
          paymentMethod: 'cash',
          amountReceived: 1000,
        });
      })
    ).rejects.toThrow('Stock insuficiente');
  });

  it('should throw on network error', async () => {
    vi.mocked(api.post).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useSale());

    await expect(
      act(async () => {
        await result.current.checkout({
          items: [{ product: 'prod-1', quantity: 1 }],
          discount: 0,
          paymentMethod: 'cash',
          amountReceived: 1000,
        });
      })
    ).rejects.toThrow('Error al procesar la venta');
  });
});