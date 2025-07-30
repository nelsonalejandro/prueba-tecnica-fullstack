import { ArticleStatus } from '../src/types';

// Datos de prueba
const mockArticles = [
  {
    id: 'ART-00001',
    date: '2025-12-31T23:59:59.999Z', // Fecha futura
    name: 'U2FsdGVkX1+QJ8J8J8J8J8J8J8J8J8J8J8J8J8J8=', // Encriptado
    originalAmount: 1000,
    country: 'Chile',
    agent: 'ABC'
  },
  {
    id: 'ART-00002',
    date: '2023-01-01T00:00:00.000Z', // Fecha pasada
    name: 'U2FsdGVkX1+QJ8J8J8J8J8J8J8J8J8J8J8J8J8J8=',
    originalAmount: -500, // Monto negativo
    country: 'Argentina',
    agent: 'DEF'
  },
  {
    id: 'ART-00003',
    date: '2023-01-01T00:00:00.000Z', // Fecha pasada
    name: 'U2FsdGVkX1+QJ8J8J8J8J8J8J8J8J8J8J8J8J8J8=',
    originalAmount: 2000,
    country: 'Chile',
    agent: 'XYZ' // Agente XYZ + Chile = Excluido
  },
  {
    id: 'ART-00004',
    date: '2023-01-01T00:00:00.000Z', // Fecha pasada
    name: 'U2FsdGVkX1+QJ8J8J8J8J8J8J8J8J8J8J8J8J8J8=',
    originalAmount: 1500,
    country: 'México',
    agent: 'GHI'
  }
];

const mockExchangeRates = [
  {
    country: 'Chile',
    rate: 850.5,
    currency: 'CLP'
  },
  {
    country: 'Argentina',
    rate: 350.25,
    currency: 'ARS'
  },
  {
    country: 'México',
    rate: 17.85,
    currency: 'MXN'
  }
];

// Mock de fs ANTES de importar ArticlesService
jest.mock('fs', () => ({
  readFileSync: jest.fn((path: string) => {
    if (path.includes('articles.json')) {
      return JSON.stringify(mockArticles);
    }
    if (path.includes('exchange-rates.json')) {
      return JSON.stringify(mockExchangeRates);
    }
    throw new Error('File not found');
  })
}));

// Mock de path
jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/'))
}));

// Importar el servicio después de configurar los mocks
import { ArticlesService } from '../src/services/articlesService';

describe('ArticlesService', () => {
  let service: ArticlesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ArticlesService();
  });

  describe('Lógica de estados', () => {
    it('debería marcar como PENDIENTE artículos con fecha futura', () => {
      const articles = service.getArticles();
      const futureArticle = articles.articles.find(a => a.id === 'ART-00001');
      expect(futureArticle?.calculatedStatus).toBe(ArticleStatus.PENDING);
    });

    it('debería marcar como INVALID artículos con monto negativo', () => {
      const articles = service.getArticles();
      const invalidArticle = articles.articles.find(a => a.id === 'ART-00002');
      expect(invalidArticle?.calculatedStatus).toBe(ArticleStatus.INVALID);
    });

    it('debería marcar como EXCLUDED artículos con agente XYZ y país Chile', () => {
      const articles = service.getArticles();
      const excludedArticle = articles.articles.find(a => a.id === 'ART-00003');
      expect(excludedArticle?.calculatedStatus).toBe(ArticleStatus.EXCLUDED);
    });

    it('debería marcar como COMPLETED artículos válidos', () => {
      const articles = service.getArticles();
      const validArticle = articles.articles.find(a => a.id === 'ART-00004');
      expect(validArticle?.calculatedStatus).toBe(ArticleStatus.COMPLETED);
    });
  });

  describe('Cálculo de montos USD', () => {
    it('debería calcular correctamente el monto en USD para Chile', () => {
      const articles = service.getArticles();
      const chileArticle = articles.articles.find(a => a.id === 'ART-00001');
      expect(chileArticle?.amountUSD).toBeCloseTo(1.176, 3);
    });

    it('debería calcular correctamente el monto en USD para México', () => {
      const articles = service.getArticles();
      const mexicoArticle = articles.articles.find(a => a.id === 'ART-00004');
      expect(mexicoArticle?.amountUSD).toBeCloseTo(84.034, 3);
    });

    it('no debería calcular monto USD para artículos inválidos', () => {
      const articles = service.getArticles();
      const invalidArticle = articles.articles.find(a => a.id === 'ART-00002');
      expect(invalidArticle?.amountUSD).toBeUndefined();
    });
  });

  describe('Filtrado y búsqueda', () => {
    it('debería filtrar por estado', () => {
      const pendingArticles = service.getArticles({ status: ArticleStatus.PENDING });
      expect(pendingArticles.articles.every(a => a.calculatedStatus === ArticleStatus.PENDING)).toBe(true);
    });

    it('debería buscar por nombre o país', () => {
      const chileArticles = service.getArticles({ search: 'Chile' });
      expect(chileArticles.articles.every(a =>
          a.country.toLowerCase().includes('chile') ||
          a.name.toLowerCase().includes('chile')
      )).toBe(true);
    });
  });

  describe('Ordenamiento', () => {
    it('debería ordenar por fecha ascendente', () => {
      const articles = service.getArticles({ sortBy: 'date', sortOrder: 'asc' });
      const dates = articles.articles.map(a => new Date(a.date).getTime());
      expect(dates).toEqual([...dates].sort((a, b) => a - b));
    });

    it('debería ordenar por monto descendente', () => {
      const articles = service.getArticles({ sortBy: 'originalAmount', sortOrder: 'desc' });
      const amounts = articles.articles.map(a => a.originalAmount || 0);
      expect(amounts).toEqual([...amounts].sort((a, b) => b - a));
    });
  });

  describe('Actualización de artículos', () => {
    it('debería actualizar el nombre de un artículo', () => {
      const updatedArticle = service.updateArticle({
        id: 'ART-00001',
        name: 'Nuevo Nombre'
      });
      expect(updatedArticle?.name).toBe('Nuevo Nombre');
    });

    it('debería recalcular estado al cambiar monto', () => {
      const updatedArticle = service.updateArticle({
        id: 'ART-00004',
        originalAmount: -1000
      });
      expect(updatedArticle?.calculatedStatus).toBe(ArticleStatus.INVALID);
      expect(updatedArticle?.amountUSD).toBeUndefined();
    });

    it('debería retornar null para artículo inexistente', () => {
      const result = service.updateArticle({
        id: 'ART-99999',
        name: 'Test'
      });
      expect(result).toBeNull();
    });
  });

  describe('Estadísticas', () => {
    it('debería calcular estadísticas correctamente', () => {
      const stats = service.getStatistics();
      expect(stats.total).toBe(4);
      expect(stats.byStatus[ArticleStatus.PENDING]).toBe(1);
      expect(stats.byStatus[ArticleStatus.INVALID]).toBe(1);
      expect(stats.byStatus[ArticleStatus.EXCLUDED]).toBe(1);
      expect(stats.byStatus[ArticleStatus.COMPLETED]).toBe(1);
      expect(stats.invalidAmounts).toBe(1);
      expect(stats.futureDates).toBe(1);
    });
  });
});