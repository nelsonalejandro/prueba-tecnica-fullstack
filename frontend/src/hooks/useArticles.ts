import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArticlesFilters, ArticleUpdateRequest } from '../types';
import apiService from '../services/api';
import toast from 'react-hot-toast';

export const useArticles = (filters: ArticlesFilters = {}) => {
  return useQuery({
    queryKey: ['articles', filters],
    queryFn: () => apiService.getArticles(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateRequest: ArticleUpdateRequest) =>
      apiService.updateArticle(updateRequest),
    onSuccess: (updatedArticle) => {
      // Invalidar y refetch las queries de artículos
      queryClient.invalidateQueries({ queryKey: ['articles'] });

      toast.success(`Artículo ${updatedArticle.id} actualizado correctamente`);
    },
    onError: (error) => {
      console.error('Error updating article:', error);
      toast.error('Error al actualizar el artículo');
    },
  });
};

export const useStatistics = () => {
  return useQuery({
    queryKey: ['statistics'],
    queryFn: () => apiService.getStatistics(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

export const useExportCSV = () => {
  return useMutation({
    mutationFn: (filters: ArticlesFilters) => apiService.exportToCSV(filters),
    onSuccess: (blob) => {
      // Crear y descargar el archivo CSV
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'articulos.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Archivo CSV exportado correctamente');
    },
    onError: (error) => {
      console.error('Error exporting CSV:', error);
      toast.error('Error al exportar el archivo CSV');
    },
  });
}; 