import { Router, Request, Response } from 'express';
import Joi from 'joi';
import articlesService from '../services/articlesService';
import { ArticlesFilters, ArticleUpdateRequest } from '../types';

const router = Router();

// Esquemas de validación
const getArticlesSchema = Joi.object({
    search: Joi.string().optional(),
    status: Joi.string().valid('Pendiente', 'Completado', 'Inválido', 'Excluido').optional(),
    sortBy: Joi.string().valid('date', 'originalAmount').optional(),
    sortOrder: Joi.string().valid('asc', 'desc').optional(),
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(1000).optional()
});

const updateArticleSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().min(1).max(100).optional(),
    originalAmount: Joi.number().optional()
});

// GET /api/articles - Obtener listado de artículos
router.get('/', (req: Request, res: Response) => {
    try {
        const { error, value } = getArticlesSchema.validate(req.query);
        if (error) {
            return res.status(400).json({
                error: 'Parámetros de consulta inválidos',
                details: error.details
            });
        }

        const filters: ArticlesFilters = {
            search: value.search,
            status: value.status as any,
            sortBy: value.sortBy as any,
            sortOrder: value.sortOrder as any,
            page: value.page,
            limit: value.limit
        };

        const result = articlesService.getArticles(filters);
        return res.json(result);
    } catch (error) {
        console.error('Error obteniendo artículos:', error);
        return res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
});

// GET /api/articles/:id - Obtener artículo por ID
router.get('/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const article = articlesService.getArticleById(id);

        if (!article) {
            return res.status(404).json({
                error: 'Artículo no encontrado',
                id
            });
        }

        return res.json(article);
    } catch (error) {
        console.error('Error obteniendo artículo:', error);
        return res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
});

// PUT /api/articles/:id - Actualizar artículo
router.put('/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { error, value } = updateArticleSchema.validate({ id, ...req.body });

        if (error) {
            return res.status(400).json({
                error: 'Datos de actualización inválidos',
                details: error.details
            });
        }

        const updateRequest: ArticleUpdateRequest = {
            id: value.id,
            name: value.name,
            originalAmount: value.originalAmount
        };

        const updatedArticle = articlesService.updateArticle(updateRequest);

        if (!updatedArticle) {
            return res.status(404).json({
                error: 'Artículo no encontrado',
                id
            });
        }

        return res.json(updatedArticle);
    } catch (error) {
        console.error('Error actualizando artículo:', error);
        return res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
});

// GET /api/articles/stats/statistics - Obtener estadísticas
router.get('/stats/statistics', (req: Request, res: Response) => {
    try {
        const stats = articlesService.getStatistics();
        res.json(stats);
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
});

// GET /api/articles/export/csv - Exportar a CSV
router.get('/export/csv', (req: Request, res: Response) => {
    try {
        const { error, value } = getArticlesSchema.validate(req.query);
        if (error) {
            return res.status(400).json({
                error: 'Parámetros de consulta inválidos',
                details: error.details
            });
        }

        const filters: ArticlesFilters = {
            search: value.search,
            status: value.status as any,
            sortBy: value.sortBy as any,
            sortOrder: value.sortOrder as any
        };

        // Obtener todos los artículos sin paginación para exportar
        const result = articlesService.getArticles({ ...filters, limit: 10000 });

        // Generar CSV
        const csvHeaders = 'ID,Fecha,Nombre,Monto Original,País,Agente,Estado,Monto USD\n';
        const csvRows = result.articles.map(article =>
            `"${article.id}","${article.date}","${article.name}","${article.originalAmount}","${article.country}","${article.agent}","${article.calculatedStatus}","${article.amountUSD || ''}"`
        ).join('\n');

        const csvContent = csvHeaders + csvRows;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=articulos.csv');
        return res.send(csvContent);
    } catch (error) {
        console.error('Error exportando CSV:', error);
        return res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
});

export default router; 