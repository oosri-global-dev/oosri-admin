import { instance } from './axios';

/**
 * GET /admin/fx/rate
 * Returns the current active exchange rate set by an admin.
 */
export const getFxRate = async () => {
    const { data } = await instance.get('/admin/fx/rate');
    return data;
};

/**
 * PUT /admin/fx/rate
 * Sets or updates the NGN/USD exchange rate.
 * @param {{ usdToNgnRate: number, note?: string }} payload
 */
export const setFxRate = async ({ usdToNgnRate, note = '' }) => {
    const { data } = await instance.put('/admin/fx/rate', { usdToNgnRate, note });
    return data;
};
