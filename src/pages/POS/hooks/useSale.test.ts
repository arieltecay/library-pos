import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSale } from './useSale';
import api from '../../../api/client';

describe('useSale', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should process checkout successfully', async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: { sale: { total: 10000, change: 2000 } },
    });

    const { result } = renderHook(() => useSale());

    let checkoutResult: { total: number; change: number } | null = null;

    await act(async () => {
      checkoutResult = await result.current.checkout({
        items: [{ product: 'prod-1', quantity: 2 }],
        clientId: 'client-1',
        discount: 500,
        paymentMethod: 'cash',
        amountReceived: 12000,
      });
    });

    expect(checkoutResult).toEqual({ total: 10000, change: 2000 });
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
    vi.mocked(api.post).mockResolvedValue({
      data: { sale: { total: 10000, change: 0 } },
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
    vi.mocked(api.post).mockResolvedValue({
      data: { sale: { total: 5000, change: 0 } },
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