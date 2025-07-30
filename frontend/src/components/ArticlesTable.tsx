import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Article, ArticleStatus } from '../types';
import { useUpdateArticle } from '../hooks/useArticles';

interface ArticlesTableProps {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (limit: number) => void;
}

interface EditableCellProps {
  article: Article;
  field: 'name' | 'originalAmount';
  onSave: (id: string, field: string, value: any) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({ article, field, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(article[field]);

  const handleSave = () => {
    onSave(article.id, field, value);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(article[field]);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <TextField
          size="small"
          value={value}
          onChange={(e) => setValue(field === 'originalAmount' ? Number(e.target.value) : e.target.value)}
          type={field === 'originalAmount' ? 'number' : 'text'}
          autoFocus
        />
        <IconButton size="small" onClick={handleSave} color="primary">
          <CheckIcon />
        </IconButton>
        <IconButton size="small" onClick={handleCancel} color="error">
          <CloseIcon />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Typography variant="body2">
        {field === 'originalAmount' 
          ? `$${Number(value).toLocaleString()}`
          : value
        }
      </Typography>
      <IconButton size="small" onClick={() => setIsEditing(true)}>
        <EditIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

const ArticlesTable: React.FC<ArticlesTableProps> = ({
  articles,
  total,
  page,
  limit,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const updateArticleMutation = useUpdateArticle();

  const handleUpdateArticle = (id: string, field: string, value: any) => {
    updateArticleMutation.mutate({
      id,
      [field]: value,
    });
  };

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

  const hasWarnings = (article: Article) => {
    return (
      article.originalAmount <= 0 ||
      new Date(article.date) > new Date()
    );
  };

  const getWarningMessage = (article: Article) => {
    const warnings = [];
    if (article.originalAmount <= 0) {
      warnings.push('Monto negativo o nulo');
    }
    if (new Date(article.date) > new Date()) {
      warnings.push('Fecha futura');
    }
    return warnings.join(', ');
  };



  return (
    <Box>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Monto Original</TableCell>
              <TableCell>País</TableCell>
              <TableCell>Agente</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Monto USD</TableCell>
              <TableCell>Advertencias</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles.map((article, index) => (
              <TableRow key={article.id} hover>
                <TableCell>{article.id}</TableCell>
                <TableCell>
                  {format(new Date(article.date), 'dd/MM/yyyy HH:mm', { locale: es })}
                </TableCell>
                <TableCell>
                  <EditableCell
                    article={article}
                    field="name"
                    onSave={handleUpdateArticle}
                  />
                </TableCell>
                <TableCell>
                  <EditableCell
                    article={article}
                    field="originalAmount"
                    onSave={handleUpdateArticle}
                  />
                </TableCell>
                <TableCell>{article.country}</TableCell>
                <TableCell>{article.agent}</TableCell>
                <TableCell>
                  <Chip
                    label={article.calculatedStatus}
                    color={getStatusColor(article.calculatedStatus)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {article.amountUSD ? `$${article.amountUSD.toFixed(2)}` : '-'}
                </TableCell>
                <TableCell>
                  {hasWarnings(article) && (
                    <Tooltip title={getWarningMessage(article)}>
                      <WarningIcon color="warning" fontSize="small" />
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        onPageChange={(_, newPage) => onPageChange(newPage + 1)}
        rowsPerPage={limit}
        onRowsPerPageChange={e => onRowsPerPageChange(Number(e.target.value))}
        rowsPerPageOptions={[25, 50, 100]}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
        labelRowsPerPage="Filas por página:"
      />
    </Box>
  );
};

export default ArticlesTable;