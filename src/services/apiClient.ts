import { ApiConfig } from '../types';

class ApiClient {
  private config: ApiConfig;

  constructor() {
    const envBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const isMockMode = !envBaseUrl || envBaseUrl.trim() === '' || envBaseUrl.toLowerCase() === 'mock';

    this.config = {
      baseUrl: isMockMode ? 'http://localhost:8000/api/v1' : envBaseUrl,
      isMock: isMockMode,
      modelName: 'CREO-RAG-v1.4',
      topK: 5,
      temperature: 0.2,
    };
  }

  public getConfig(): ApiConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {},
    mockFallbackHandler?: () => Promise<T>
  ): Promise<T> {
    if (this.config.isMock) {
      if (import.meta.env.VITE_ENABLE_DEBUG_LOGS === 'true') {
        console.log(`[CREOZEN Mock API] -> ${options.method || 'GET'} ${endpoint}`, options.body);
      }
      if (mockFallbackHandler) {
        return await mockFallbackHandler();
      }
      throw new Error(`Mock fallback handler not implemented for endpoint ${endpoint}`);
    }

    // Real API call when VITE_API_BASE_URL is provided by backend teammate
    const fullUrl = `${this.config.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    try {
      const response = await fetch(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend API Error (${response.status}): ${errorText}`);
      }

      return (await response.json()) as T;
    } catch (err: any) {
      console.warn(`[CREOZEN API Client] Failed call to ${fullUrl}, falling back to mock service if available. Error:`, err);
      if (mockFallbackHandler) {
        return await mockFallbackHandler();
      }
      throw err;
    }
  }

  /**
   * Helper to simulate real network delay in mock mode
   */
  public async simulateDelay(ms: number = 800): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const apiClient = new ApiClient();
