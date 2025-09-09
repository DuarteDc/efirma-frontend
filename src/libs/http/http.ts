import { type AxiosInstance, isAxiosError } from 'axios'

const DEFAULT_ERROR = 'Parece que hubo un error - Intenta más tarde'

export class Http {
  private api: AxiosInstance

  constructor (apiInstance: AxiosInstance) {
    this.api = apiInstance
  }

  async get<T> (url: string): Promise<T> {
    try {
      const { data } = await this.api.get(url)
      return data as T
    } catch (error) {
      if (isAxiosError(error)) throw error.response?.data?.message
      throw new Error(DEFAULT_ERROR)
    }
  }

  async post<T> (url: string, body: object): Promise<T> {
    try {
      const { data } = await this.api.post(url, body)
      return data as T
    } catch (error) {
      if (isAxiosError(error)) throw error.response?.data?.message
      throw new Error(DEFAULT_ERROR)
    }
  }

  async put<T> (url: string, body: object): Promise<T> {
    try {
      const { data } = await this.api.put(url, body)
      return data as T
    } catch (error) {
      if (isAxiosError(error)) throw error.response?.data?.message
      throw new Error(DEFAULT_ERROR)
    }
  }

  async patch<T> (url: string, body: object): Promise<T> {
    try {
      const { data } = await this.api.patch(url, body)
      return data as T
    } catch (error) {
      if (isAxiosError(error)) throw error.response?.data?.message
      throw new Error(DEFAULT_ERROR)
    }
  }

  async destroy<T> (url: string): Promise<T> {
    try {
      const { data } = await this.api.delete(url)
      return data as T
    } catch (error) {
      if (isAxiosError(error)) throw error.response?.data?.message
      throw new Error(DEFAULT_ERROR)
    }
  }

  async download (url: string): Promise<void> {
    try {
      const { data } = await this.api.get(url, { responseType: 'blob' })
      const downloadUrl = window.URL.createObjectURL(data)
      window.open(downloadUrl, '_blank')
    } catch (error) {
      if (isAxiosError(error)) throw error.response?.data?.message
      throw new Error('Al parecer no hay reportes disponibles')
    }
  }
}
