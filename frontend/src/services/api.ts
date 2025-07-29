import { ArticlesResponse, ArticlesFilters, Article, ArticleUpdateRequest } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api');

class ApiService {
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Obtener artículos con filtros
    async getArticles(filters: ArticlesFilters = {}): Promise<ArticlesResponse> {
        const params = new URLSearchParams();

        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const queryString = params.toString();
        const endpoint = `/articles${queryString ? `?${queryString}` : ''}`;

        return this.request<ArticlesResponse>(endpoint);
    }

    // Obtener artículo por ID
    async getArticleById(id: string): Promise<Article> {
        return this.request<Article>(`/articles/${id}`);
    }

    // Actualizar artículo
    async updateArticle(updateRequest: ArticleUpdateRequest): Promise<Article> {
        return this.request<Article>(`/articles/${updateRequest.id}`, {
            method: 'PUT',
            body: JSON.stringify(updateRequest),
        });
    }

    // Obtener estadísticas
    async getStatistics(): Promise<any> {
        return this.request('/articles/stats/statistics');
    }

    // Exportar a CSV
    async exportToCSV(filters: ArticlesFilters = {}): Promise<Blob> {
        const params = new URLSearchParams();

        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

        const queryString = params.toString();
        const endpoint = `/articles/export/csv${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(`${API_BASE_URL}${endpoint}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.blob();
    }

    // Health check
    async healthCheck(): Promise<{ status: string; timestamp: string; environment: string }> {
        return this.request('/health');
    }
}

export default new ApiService(); 