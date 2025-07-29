import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ArticlesList from '../components/ArticlesList';
import { ArticleStatus } from '../../shared/types';

// Mock de los hooks
jest.mock('../hooks/useArticles', () => ({
  useArticles: jest.fn(),
  useStatistics: jest.fn(),
  useExportCSV: jest.fn(),
}));

// Mock del contexto del tema
jest.mock('../contexts/ThemeContext', () => ({
  useTheme: () => ({
    isDarkMode: false,
    toggleTheme: jest.fn(),
  }),
  ThemeContextProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mockArticles = [
  {
    id: 'ART-00001',
    date: '2024-12-31T23:59:59.999Z',
    name: 'Juan Pérez',
    originalAmount: 1000,
    country: 'Chile',
    agent: 'ABC',
    calculatedStatus: ArticleStatus.PENDING,
    amountUSD: 1.18,
    isValid: true,
  },
  {
    id: 'ART-00002',
    date: '2023-01-01T00:00:00.000Z',
    name: 'María García',
    originalAmount: -500,
    country: 'Argentina',
    agent: 'DEF',
    calculatedStatus: ArticleStatus.INVALID,
    amountUSD: undefined,
    isValid: false,
  },
];

const mockStatistics = {
  total: 2,
  byStatus: {
    [ArticleStatus.PENDING]: 1,
    [ArticleStatus.INVALID]: 1,
    [ArticleStatus.COMPLETED]: 0,
    [ArticleStatus.EXCLUDED]: 0,
  },
  invalidAmounts: 1,
  futureDates: 1,
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  const theme = createTheme();

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('ArticlesList', () => {
  const mockUseArticles = require('../hooks/useArticles').useArticles;
  const mockUseStatistics = require('../hooks/useArticles').useStatistics;
  const mockUseExportCSV = require('../hooks/useArticles').useExportCSV;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería mostrar el título de la aplicación', () => {
    mockUseArticles.mockReturnValue({
      data: { articles: mockArticles, total: 2, page: 1, limit: 50 },
      isLoading: false,
      error: null,
    });
    mockUseStatistics.mockReturnValue({
      data: mockStatistics,
      isLoading: false,
    });
    mockUseExportCSV.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    renderWithProviders(<ArticlesList />);

    expect(screen.getByText('Listado de Artículos')).toBeInTheDocument();
  });

  it('debería mostrar estadísticas cuando los datos están disponibles', async () => {
    mockUseArticles.mockReturnValue({
      data: { articles: mockArticles, total: 2, page: 1, limit: 50 },
      isLoading: false,
      error: null,
    });
    mockUseStatistics.mockReturnValue({
      data: mockStatistics,
      isLoading: false,
    });
    mockUseExportCSV.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    renderWithProviders(<ArticlesList />);

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument(); // Total de artículos
      expect(screen.getByText('Pendiente')).toBeInTheDocument();
      expect(screen.getByText('Inválido')).toBeInTheDocument();
    });
  });

  it('debería mostrar loading cuando los datos están cargando', () => {
    mockUseArticles.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });
    mockUseStatistics.mockReturnValue({
      data: null,
      isLoading: true,
    });
    mockUseExportCSV.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    renderWithProviders(<ArticlesList />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('debería mostrar error cuando hay un problema', () => {
    const errorMessage = 'Error al cargar los artículos';
    mockUseArticles.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error(errorMessage),
    });
    mockUseStatistics.mockReturnValue({
      data: null,
      isLoading: false,
    });
    mockUseExportCSV.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    renderWithProviders(<ArticlesList />);

    expect(screen.getByText(/Error al cargar los artículos/)).toBeInTheDocument();
  });

  it('debería mostrar el botón de exportar CSV', () => {
    mockUseArticles.mockReturnValue({
      data: { articles: mockArticles, total: 2, page: 1, limit: 50 },
      isLoading: false,
      error: null,
    });
    mockUseStatistics.mockReturnValue({
      data: mockStatistics,
      isLoading: false,
    });
    mockUseExportCSV.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    renderWithProviders(<ArticlesList />);

    expect(screen.getByText('Exportar CSV')).toBeInTheDocument();
  });

  it('debería mostrar el botón de cambio de tema', () => {
    mockUseArticles.mockReturnValue({
      data: { articles: mockArticles, total: 2, page: 1, limit: 50 },
      isLoading: false,
      error: null,
    });
    mockUseStatistics.mockReturnValue({
      data: mockStatistics,
      isLoading: false,
    });
    mockUseExportCSV.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    renderWithProviders(<ArticlesList />);

    // El botón de tema debería estar presente (icono de sol o luna)
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('debería mostrar información de paginación', () => {
    mockUseArticles.mockReturnValue({
      data: { articles: mockArticles, total: 2, page: 1, limit: 50 },
      isLoading: false,
      error: null,
    });
    mockUseStatistics.mockReturnValue({
      data: mockStatistics,
      isLoading: false,
    });
    mockUseExportCSV.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    renderWithProviders(<ArticlesList />);

    expect(screen.getByText(/Mostrando 2 de 2 artículos/)).toBeInTheDocument();
  });
}); 