import React from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Download as DownloadIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { ArticleStatus } from '../types';

interface ArticlesHeaderProps {
  stats: {
    total: number;
    byStatus: Record<ArticleStatus, number>;
    invalidAmounts: number;
    futureDates: number;
  } | null;
  onExport: () => void;
  isExporting: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const ArticlesHeader: React.FC<ArticlesHeaderProps> = ({
  stats,
  onExport,
  isExporting,
  isDarkMode,
  onToggleTheme,
}) => {
  const getStatusColor = (status: ArticleStatus) => {
    switch (status) {
      case ArticleStatus.COMPLETED:
        return 'success';
      case ArticleStatus.PENDING:
        return 'warning';
      case ArticleStatus.INVALID:
        return 'error';
      case ArticleStatus.EXCLUDED:
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Título y controles */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Listado de Artículos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona y visualiza los artículos con filtros avanzados
          </Typography>
        </Box>
        
        <Box display="flex" gap={2} alignItems="center">
          <Tooltip title={`Cambiar a modo ${isDarkMode ? 'claro' : 'oscuro'}`}>
            <IconButton onClick={onToggleTheme} color="inherit">
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          
          <Button
            variant="contained"
            startIcon={isExporting ? <CircularProgress size={16} /> : <DownloadIcon />}
            onClick={onExport}
            disabled={isExporting}
          >
            {isExporting ? 'Exportando...' : 'Exportar CSV'}
          </Button>
        </Box>
      </Box>

      {/* Estadísticas */}
      {stats && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <AssessmentIcon color="primary" />
                <Typography variant="h6" component="div">
                  {stats.total.toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total de Artículos
              </Typography>
            </Box>
          </Grid>

          {Object.entries(stats.byStatus).map(([status, count]) => (
            <Grid item xs={12} sm={6} md={2} key={status}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                <Chip
                  label={count.toLocaleString()}
                  color={getStatusColor(status as ArticleStatus)}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {status}
                </Typography>
              </Box>
            </Grid>
          ))}

          <Grid item xs={12} sm={6} md={2}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6" color="error" component="div">
                {stats.invalidAmounts.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Montos Inválidos
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6" color="warning.main" component="div">
                {stats.futureDates.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fechas Futuras
              </Typography>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ArticlesHeader; 