import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Clear as ClearIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { ArticlesFilters as ArticlesFiltersType, ArticleStatus } from '../types';

interface ArticlesFiltersProps {
  filters: ArticlesFiltersType;
  onFiltersChange: (filters: Partial<ArticlesFiltersType>) => void;
}

const ArticlesFilters: React.FC<ArticlesFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ search: event.target.value });
  };

  const handleStatusChange = (event: any) => {
    onFiltersChange({ status: event.target.value });
  };

  const handleSortByChange = (event: any) => {
    onFiltersChange({ sortBy: event.target.value });
  };

  const handleSortOrderChange = (event: any) => {
    onFiltersChange({ sortOrder: event.target.value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: undefined,
      status: undefined,
      sortBy: undefined,
      sortOrder: undefined,
    });
  };

  const hasActiveFilters = filters.search || filters.status || filters.sortBy;

  return (
    <Box>
      <Grid container spacing={3} alignItems="center">
        {/* Búsqueda */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Buscar por nombre o país"
            value={filters.search || ''}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            placeholder="Ej: Juan Pérez, Chile..."
          />
        </Grid>

        {/* Filtro por estado */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              value={filters.status || ''}
              label="Estado"
              onChange={handleStatusChange}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value={ArticleStatus.COMPLETED}>Completado</MenuItem>
              <MenuItem value={ArticleStatus.PENDING}>Pendiente</MenuItem>
              <MenuItem value={ArticleStatus.INVALID}>Inválido</MenuItem>
              <MenuItem value={ArticleStatus.EXCLUDED}>Excluido</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Ordenar por */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Ordenar por</InputLabel>
            <Select
              value={filters.sortBy || ''}
              label="Ordenar por"
              onChange={handleSortByChange}
            >
              <MenuItem value="">Sin orden</MenuItem>
              <MenuItem value="date">Fecha</MenuItem>
              <MenuItem value="originalAmount">Monto</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Orden */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Orden</InputLabel>
            <Select
              value={filters.sortOrder || ''}
              label="Orden"
              onChange={handleSortOrderChange}
              disabled={!filters.sortBy}
            >
              <MenuItem value="asc">Ascendente</MenuItem>
              <MenuItem value="desc">Descendente</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Botón limpiar */}
        <Grid item xs={12} sm={6} md={2}>
          <Box display="flex" justifyContent="center">
            <Tooltip title="Limpiar filtros">
              <IconButton
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                color="primary"
              >
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ArticlesFilters; 