export interface Article {
    id: string;
    date: string; // ISO string
    name: string; // Encriptado en el backend, desencriptado para el frontend
    originalAmount: number;
    country: string;
    agent: string;
    calculatedStatus: ArticleStatus;
    amountUSD?: number; // Calculado en el backend
    isValid?: boolean; // Calculado en el backend
}

export enum ArticleStatus {
    PENDING = 'Pendiente',
    COMPLETED = 'Completado',
    INVALID = 'Inválido',
    EXCLUDED = 'Excluido'
}

export interface ExchangeRate {
    country: string;
    rate: number;
    currency: string;
}

export interface ArticlesResponse {
    articles: Article[];
    total: number;
    page: number;
    limit: number;
}

export interface ArticlesFilters {
    search?: string;
    status?: ArticleStatus;
    sortBy?: 'date' | 'originalAmount';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface ArticleUpdateRequest {
    id: string;
    name?: string;
    originalAmount?: number;
}

export interface ValidationError {
    field: string;
    message: string;
    type: 'warning' | 'error';
}

export interface ArticleValidation {
    id: string;
    errors: ValidationError[];
    warnings: ValidationError[];
} 