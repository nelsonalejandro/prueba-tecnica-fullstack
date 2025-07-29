import fs from 'fs';
import path from 'path';
import CryptoJS from 'crypto-js';
import { Article, ArticleStatus, ExchangeRate, ArticlesFilters, ArticlesResponse, ArticleUpdateRequest } from '../types';

export class ArticlesService {
  private articles: Article[] = [];
  private exchangeRates: ExchangeRate[] = [];
  private encryptionKey: string;

  constructor() {
    this.encryptionKey = process.env.ENCRYPTION_KEY || 'prueba-tecnica-2024';
    this.loadData();
  }

  private loadData(): void {
    try {
      // Cargar artículos
      const articlesPath = path.join(__dirname, '../../data/articles.json');
      const rawArticles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

      // Cargar tasas de cambio
      const ratesPath = path.join(__dirname, '../../data/exchange-rates.json');
      this.exchangeRates = JSON.parse(fs.readFileSync(ratesPath, 'utf8'));

      // Procesar artículos con lógica de negocio
      this.articles = rawArticles.map((article: any) => this.processArticle(article));

      console.log(`✅ Cargados ${this.articles.length} artículos`);
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      throw new Error('Error cargando datos de artículos');
    }
  }

  private decryptName(encryptedName: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedName, this.encryptionKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Error desencriptando nombre:', error);
      return 'Nombre no disponible';
    }
  }

  private encryptName(name: string): string {
    return CryptoJS.AES.encrypt(name, this.encryptionKey).toString();
  }

  private calculateStatus(article: any): ArticleStatus {
    const date = new Date(article.date);
    const now = new Date();

    // Fecha futura → Estado: Pendiente
    if (date > now) {
      return ArticleStatus.PENDING;
    }

    // Fecha pasada + agente "XYZ" + país "Chile" → excluir artículo
    if (date <= now && article.agent === 'XYZ' && article.country === 'Chile') {
      return ArticleStatus.EXCLUDED;
    }

    // Monto negativo o nulo → artículo inválido
    if (article.originalAmount <= 0) {
      return ArticleStatus.INVALID;
    }

    return ArticleStatus.COMPLETED;
  }

  private calculateAmountUSD(originalAmount: number, country: string): number {
    const rate = this.exchangeRates.find(r => r.country === country);
    if (!rate) {
      return originalAmount; // Si no hay tasa, asumir que ya está en USD
    }
    return originalAmount / rate.rate;
  }

  private processArticle(rawArticle: any): Article {
    const status = this.calculateStatus(rawArticle);
    const amountUSD = rawArticle.originalAmount > 0
      ? this.calculateAmountUSD(rawArticle.originalAmount, rawArticle.country)
      : undefined;

    return {
      id: rawArticle.id,
      date: rawArticle.date,
      name: this.decryptName(rawArticle.name),
      originalAmount: rawArticle.originalAmount,
      country: rawArticle.country,
      agent: rawArticle.agent,
      calculatedStatus: status,
      amountUSD: amountUSD,
      isValid: rawArticle.originalAmount > 0 && status !== ArticleStatus.EXCLUDED
    };
  }

  public getArticles(filters: ArticlesFilters = {}): ArticlesResponse {
    let filteredArticles = [...this.articles];

    // Filtrar por búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredArticles = filteredArticles.filter(article =>
        article.name.toLowerCase().includes(searchLower) ||
        article.country.toLowerCase().includes(searchLower)
      );
    }

    // Filtrar por estado
    if (filters.status) {
      filteredArticles = filteredArticles.filter(article =>
        article.calculatedStatus === filters.status
      );
    }

    // Ordenar
    if (filters.sortBy) {
      filteredArticles.sort((a, b) => {
        let aValue: any, bValue: any;

        if (filters.sortBy === 'date') {
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
        } else if (filters.sortBy === 'originalAmount') {
          aValue = a.originalAmount || 0;
          bValue = b.originalAmount || 0;
        } else {
          return 0;
        }

        if (filters.sortOrder === 'desc') {
          return bValue - aValue;
        }
        return aValue - bValue;
      });
    }

    // Paginación
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

    return {
      articles: paginatedArticles,
      total: filteredArticles.length,
      page,
      limit
    };
  }

  public updateArticle(updateRequest: ArticleUpdateRequest): Article | null {
    const articleIndex = this.articles.findIndex(a => a.id === updateRequest.id);
    if (articleIndex === -1) {
      return null;
    }

    const article = this.articles[articleIndex];

    // Actualizar campos si se proporcionan
    if (updateRequest.name !== undefined) {
      article.name = updateRequest.name;
    }

    if (updateRequest.originalAmount !== undefined) {
      article.originalAmount = updateRequest.originalAmount;
      // Recalcular estado y monto USD
      const status = this.calculateStatus(article);
      article.calculatedStatus = status;
      article.amountUSD = updateRequest.originalAmount > 0
        ? this.calculateAmountUSD(updateRequest.originalAmount, article.country)
        : undefined;
      article.isValid = updateRequest.originalAmount > 0 && status !== ArticleStatus.EXCLUDED;
    }

    this.articles[articleIndex] = article;
    return article;
  }

  public getArticleById(id: string): Article | null {
    return this.articles.find(article => article.id === id) || null;
  }

  public getStatistics() {
    const total = this.articles.length;
    const byStatus = this.articles.reduce((acc, article) => {
      acc[article.calculatedStatus] = (acc[article.calculatedStatus] || 0) + 1;
      return acc;
    }, {} as Record<ArticleStatus, number>);

    const byCountry = this.articles.reduce((acc, article) => {
      acc[article.country] = (acc[article.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const invalidAmounts = this.articles.filter(a => a.originalAmount <= 0).length;
    const futureDates = this.articles.filter(a => new Date(a.date) > new Date()).length;

    return {
      total,
      byStatus,
      byCountry,
      invalidAmounts,
      futureDates
    };
  }
}

// Crear instancia del servicio
const articlesService = new ArticlesService();
export default articlesService; 