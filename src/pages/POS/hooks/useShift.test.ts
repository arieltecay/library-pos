import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useShift } from './useShift';
import api from '../../../api/client';

const mockShift = {
  id: 'shift-1',
  seller: 'seller-1',
  openedAt: '2024-01-01T08:00:00Z',
  closedAt: null,
  openingAmount: 10000,
  closingAmount: null,
  expectedAmount: null,
  difference: null,
  status: 'open' as const,
  note: null,
};

const mockAggregated = {
  cashTotal: 50000,
  transferTotal: 30000,
  creditTotal: 20000,
  salesCount: 25,
  productsSold: 50,
  avgTicket: 4000,
  expectedCash: 60000,
};

describe('useShift', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch active shift on mount', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: { cashShift: mockShift, aggregated: mockAggregated },
    });

    const { result } = renderHook(() => useShift());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 3000 });

    expect(result.current.activeShift).toEqual(mockShift);
    expect(result.current.shiftStats).toEqual(mockAggregated);
    expect(result.current.error).toBeNull();
    expect(api.get).toHaveBeenCalledWith('/cash-shifts/active');
  });

  it('should handle fetch error', async () => {
    vi.mocked(api.get).mockRejectedValue({
      response: { data: { message: 'No hay turno activo' } },
    });

    const { result } = renderHook(() => useShift());

    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 3000 });

    expect(result.current.activeShift).toBeNull();
    expect(result.current.error).toBe('No hay turno activo');
  });

  it('should open shift successfully', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: { cashShift: mockShift, aggregated: mockAggregated },
    });
    vi.mocked(api.post).mockResolvedValue({});

    const { result } = renderHook(() => useShift());

    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 3000 });

    await act(async () => {
      await result.current.openShift(10000);
    });

    expect(api.post).toHaveBeenCalledWith('/cash-shifts/open', { openingAmount: 10000 });
    expect(api.get).toHaveBeenCalledTimes(2);
  });

  it('should handle open shift error', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: { cashShift: mockShift, aggregated: mockAggregated },
    });
    vi.mocked(api.post).mockRejectedValue({
      response: { data: { message: 'Monto inválido' } },
    });

    const { result } = renderHook(() => useShift());

    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 3000 });

    await expect(
      act(async () => {
        await result.current.openShift(-100);
      })
    ).rejects.toThrow();
  });

  it('should close shift successfully', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: { cashShift: mockShift, aggregated: mockAggregated },
    });
    vi.mocked(api.post).mockResolvedValue({});

    const { result } = renderHook(() => useShift());

    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 3000 });

    await act(async () => {
      await result.current.closeShift(15000, 'Cierre normal');
    });

    expect(api.post).toHaveBeenCalledWith('/cash-shifts/shift-1/close', {
      closingAmount: 15000,
      note: 'Cierre normal',
      aggregated: undefined,
    });
    expect(result.current.activeShift).toBeNull();
    expect(result.current.shiftStats).toBeNull();
  });

  it('should not close shift if no active shift', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: { cashShift: null, aggregated: null },
    });

    const { result } = renderHook(() => useShift());

    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 3000 });

    await act(async () => {
      await result.current.closeShift(15000);
    });

    expect(api.post).not.toHaveBeenCalled();
  });

  it('should refetch shift data', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: { cashShift: mockShift, aggregated: mockAggregated },
    });

    const { result } = renderHook(() => useShift());

    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 3000 });

    const newShift = { ...mockShift, id: 'shift-2', openingAmount: 20000 };
    vi.mocked(api.get).mockResolvedValue({
      data: { cashShift: newShift, aggregated: mockAggregated },
    });

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.activeShift).toEqual(newShift);
    expect(api.get).toHaveBeenCalledTimes(2);
  });
});