import { APIRequestContext, APIResponse, expect } from '@playwright/test';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiRequestOptions {
  endpoint: string;
  method?: RequestMethod;
  data?: Record<string, unknown>;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
}

interface AssertStatusOptions {
  expectedStatus: number;
  response: APIResponse;
}

export class ApiUtils {
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async send(options: ApiRequestOptions): Promise<APIResponse> {
    const {
      endpoint,
      method = 'GET',
      data,
      headers,
      params,
      timeout = 30000
    } = options;

    if (!endpoint || !endpoint.trim()) {
      throw new Error('[ApiUtils] endpoint is required.');
    }

    const route = endpoint.trim();

    switch (method) {
      case 'GET':
        return this.request.get(route, { headers, params, timeout });
      case 'POST':
        return this.request.post(route, { data, headers, params, timeout });
      case 'PUT':
        return this.request.put(route, { data, headers, params, timeout });
      case 'PATCH':
        return this.request.patch(route, { data, headers, params, timeout });
      case 'DELETE':
        return this.request.delete(route, { headers, params, timeout });
      default:
        throw new Error(`[ApiUtils] Unsupported method: ${method}`);
    }
  }

  async getJson<T = Record<string, unknown>>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    const response = await this.send({ endpoint, method: 'GET', headers });
    await this.assertStatus({ response, expectedStatus: 200 });
    return (await response.json()) as T;
  }

  async postJson<T = Record<string, unknown>>(
    endpoint: string,
    body: Record<string, unknown>,
    headers?: Record<string, string>
  ): Promise<T> {
    const response = await this.send({ endpoint, method: 'POST', data: body, headers });
    await this.assertStatus({ response, expectedStatus: 201 });
    return (await response.json()) as T;
  }

  async assertStatus({ response, expectedStatus }: AssertStatusOptions): Promise<void> {
    expect(response.status(), `[ApiUtils] Unexpected status for ${response.url()}`).toBe(expectedStatus);
  }
}

export default ApiUtils;
