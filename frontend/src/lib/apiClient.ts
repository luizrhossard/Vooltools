import axios, { AxiosError, AxiosHeaders } from 'axios';
import { clearStoredSession, getStoredToken } from './adminSession';
import { isTokenExpired } from './authToken';

type ApiErrorKind = 'unauthorized' | 'forbidden' | 'server' | 'network' | 'unknown';

interface ErrorResponseBody {
  message?: string;
}

export class ApiClientError extends Error {
  kind: ApiErrorKind;
  status?: number;

  constructor(message: string, kind: ApiErrorKind, status?: number) {
    super(message);
    this.name = 'ApiClientError';
    this.kind = kind;
    this.status = status;
  }
}

const apiBaseUrl = import.meta.env.VITE_API_URL;

function emitForcedLogout() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth:logout'));
  }
}

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (!token) return config;

  if (isTokenExpired(token)) {
    clearStoredSession();
    emitForcedLogout();
    return Promise.reject(
      new ApiClientError('Sua sessão expirou. Faça login novamente.', 'unauthorized', 401)
    );
  }

  config.headers = config.headers ?? new AxiosHeaders();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponseBody>) => {
    const status = error.response?.status;

    if (status === 401) {
      clearStoredSession();
      emitForcedLogout();
      return Promise.reject(
        new ApiClientError('Sua sessão expirou. Faça login novamente.', 'unauthorized', 401)
      );
    }

    if (status === 403) {
      return Promise.reject(
        new ApiClientError('Você não tem permissão para executar esta ação.', 'forbidden', 403)
      );
    }

    if (typeof status === 'number' && status >= 500) {
      return Promise.reject(
        new ApiClientError('Ocorreu um erro interno. Tente novamente em instantes.', 'server', status)
      );
    }

    if (!error.response) {
      return Promise.reject(
        new ApiClientError(
          'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
          'network'
        )
      );
    }

    const serverMessage = error.response.data?.message;
    const fallbackMessage = 'Não foi possível concluir sua solicitação.';
    return Promise.reject(
      new ApiClientError(typeof serverMessage === 'string' ? serverMessage : fallbackMessage, 'unknown', status)
    );
  }
);

export function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof ApiClientError) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}

export const api = apiClient;
