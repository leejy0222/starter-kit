import { useState } from 'react';
import { AxiosError } from 'axios';
import { toast } from '../store/toastStore';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: AxiosError) => void;
  showToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

export const useApi = <T, R = unknown>(
  apiCall: (data: T) => Promise<{ data: { success: boolean; data: R } }>,
  options: UseApiOptions<R> = {},
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const [data, setData] = useState<R | null>(null);

  const {
    onSuccess,
    onError,
    showToast = true,
    successMessage = '성공했습니다',
    errorMessage,
  } = options;

  const mutate = async (params: T) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiCall(params);

      if (response.data.success) {
        setData(response.data.data);
        if (showToast) {
          toast.success(successMessage);
        }
        onSuccess?.(response.data.data);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError);

      const message =
        errorMessage ||
        (axiosError.response?.data as any)?.error?.message ||
        '오류가 발생했습니다';

      if (showToast) {
        toast.error(message);
      }
      onError?.(axiosError);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate,
    isLoading,
    error,
    data,
  };
};

export const useApiQuery = <T>(
  apiCall: () => Promise<{ data: { success: boolean; data: T } }>,
  options: { showErrorToast?: boolean } = {},
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const [data, setData] = useState<T | null>(null);

  const { showErrorToast = true } = options;

  const refetch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiCall();

      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError);

      if (showErrorToast) {
        toast.error('데이터를 불러올 수 없습니다');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
