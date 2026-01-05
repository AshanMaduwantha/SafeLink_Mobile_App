/**
 * API Client
 *
 * Centralized axios instance with interceptors for request/response handling
 */

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import config from "@/config/environment";
import { getAuth, getIdToken } from "@react-native-firebase/auth";

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: config.API_BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private processQueue(error: any = null, token: string | null = null): void {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    this.failedQueue = [];
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Add Firebase auth token if user is logged in
        const { currentUser } = getAuth();
        if (currentUser) {
          try {
            const token = await getIdToken(currentUser);
            config.headers.Authorization = `Bearer ${token}`;
          } catch (error) {
            console.error("[API Client] Failed to get auth token:", error);
          }
        }

        if (__DEV__) {
          console.log(
            `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
          );
        }

        return config;
      },
      (error) => {
        if (__DEV__) {
          console.error("[API Request Error]", error);
        }
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        if (__DEV__) {
          console.log(
            `[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`,
            response.status,
          );
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        if (__DEV__) {
          console.error(
            "[API Response Error]",
            error.response?.status,
            error.message,
          );
        }

        // Handle 401 Unauthorized with token refresh and retry
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Queue the request if token refresh is already in progress
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => {
              return this.client(originalRequest);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          const { currentUser } = getAuth();
          if (currentUser) {
            try {
              const newToken = await getIdToken(currentUser, true);
              console.log("[API Client] Token refreshed successfully");

              // Update the failed request with new token
              originalRequest.headers.Authorization = `Bearer ${newToken}`;

              // Process queued requests
              this.processQueue(null, newToken);

              // Retry original request
              return this.client(originalRequest);
            } catch (refreshError) {
              console.error("[API Client] Token refresh failed:", refreshError);
              this.processQueue(refreshError, null);

              await getAuth().signOut();

              return Promise.reject(
                new ApiError(
                  401,
                  "Authentication failed. Please sign in again.",
                  refreshError,
                ),
              );
            } finally {
              this.isRefreshing = false;
            }
          } else {
            this.isRefreshing = false;
            return Promise.reject(
              new ApiError(401, "No authenticated user found."),
            );
          }
        }

        // Handle other errors
        if (error.response?.status === 500) {
          console.error("[API Client] Server error occurred");
          return Promise.reject(
            new ApiError(
              500,
              "Server error. Please try again later.",
              error.response.data,
            ),
          );
        }

        // Handle network errors
        if (!error.response) {
          return Promise.reject(
            new ApiError(
              0,
              "Network error. Please check your connection.",
              error,
            ),
          );
        }

        // Generic error handling
        const message =
          (error.response?.data as any)?.message ||
          error.message ||
          "An error occurred";
        return Promise.reject(
          new ApiError(
            error.response?.status || 0,
            message,
            error.response?.data,
          ),
        );
      },
    );
  }

  // HTTP Methods
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  public async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(
      url,
      data,
      config,
    );
    return response.data;
  }

  public async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  public async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(
      url,
      data,
      config,
    );
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }

  public getInstance(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
