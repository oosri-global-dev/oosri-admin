import { useQuery } from '@tanstack/react-query';
import { getReturns, getReturn, getReturnSettings } from '@/network/returns';

export const useReturns = ({ page = 1, status, search } = {}) => {
  const limit = 10;
  const skip = (page - 1) * limit;
  return useQuery({
    queryKey: ['returns', 'list', { page, status, search }],
    queryFn: () => getReturns({ skip, limit, status: status || undefined, search: search || undefined }),
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000,
  });
};

export const useReturn = (id) =>
  useQuery({
    queryKey: ['returns', 'detail', id],
    queryFn: () => getReturn(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });

export const useReturnSettings = () =>
  useQuery({
    queryKey: ['returns', 'settings'],
    queryFn: getReturnSettings,
    staleTime: 5 * 60 * 1000,
  });
