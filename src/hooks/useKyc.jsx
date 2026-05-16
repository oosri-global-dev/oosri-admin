import { useQuery } from '@tanstack/react-query';
import { getKycApplications, getKycApplication } from '@/network/kyc';

export const useKycList = ({ page = 1, status, search } = {}) =>
  useQuery({
    queryKey: ['kyc', 'list', { page, status, search }],
    queryFn: () => getKycApplications({ page, limit: 10, status: status || undefined, search: search || undefined }),
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000,
  });

export const useKyc = (kycId) =>
  useQuery({
    queryKey: ['kyc', 'detail', kycId],
    queryFn: () => getKycApplication(kycId),
    enabled: !!kycId,
    staleTime: 60 * 1000,
  });
