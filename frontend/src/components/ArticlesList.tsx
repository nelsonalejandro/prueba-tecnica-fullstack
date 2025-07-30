import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import { useArticles, useStatistics, useExportCSV } from '../hooks/useArticles';
import { ArticlesFilters as ArticlesFiltersType, ArticleStatus } from '../types';
import ArticlesTable from './ArticlesTable';
import ArticlesFilters from './ArticlesFilters';
import ArticlesHeader from './ArticlesHeader';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';

const ArticlesList: React.FC = () => {
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useCustomTheme();
  
  // Estado de filtros
  const [filters, setFilters] = useState<ArticlesFiltersType>({
    page: 1,
    limit: 50,
  });

  // Queries
  const { data: articlesData, isLoading, error } = useArticles(filters);
  const { data: statistics } = useStatistics();
  const exportCSVMutation = useExportCSV();

  // Memoizar estadísticas para evitar re-renders
  const stats = useMemo(() => {
    if (!statistics) return null;
    
    return {
      total: statistics.total,
      byStatus: statistics.byStatus,
      invalidAmounts: statistics.invalidAmounts,
      futureDates: statistics.futureDates,
    };
  }, [statistics]);

  // Manejar cambios en filtros
  const handleFiltersChange = (newFilters: Partial<ArticlesFiltersType>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1, // Resetear página al cambiar filtros
    }));
  };

  // Manejar exportación
  const handleExport = () => {
    exportCSVMutation.mutate(filters);
  };

  // Manejar cambio de página
  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  // Añadir handler para cambio de filas por página
  const handleRowsPerPageChange = (newLimit: number) => {
    setFilters(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert severity="error">
          Error al cargar los artículos: {error instanceof Error ? error.message : 'Error desconocido'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <ArticlesHeader 
        stats={stats}
        onExport={handleExport}
        isExporting={exportCSVMutation.isPending}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Filtros */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 3,
          backgroundColor: theme.palette.background.paper 
        }}
      >
        <ArticlesFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </Paper>

      {/* Tabla de artículos */}
      <Paper 
        elevation={2}
        sx={{ 
          backgroundColor: theme.palette.background.paper,
          minHeight: 400
        }}
      >
        {isLoading ? (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            minHeight={400}
          >
            <CircularProgress />
          </Box>
        ) : articlesData ? (
          <ArticlesTable
            articles={articlesData.articles}
            total={articlesData.total}
            page={articlesData.page}
            limit={articlesData.limit}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        ) : (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            minHeight={400}
          >
            <Typography variant="h6" color="text.secondary">
              No se encontraron artículos
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Información adicional */}
      {articlesData && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Mostrando {articlesData.articles.length} de {articlesData.total} artículos
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default ArticlesList; 