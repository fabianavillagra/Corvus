
import * as personaService from './person.service.js';

const getAll = async (req, res, next) => {
    try {
        const limit = Math.min(Number(req.query.limit ?? 20), 100);
        const offset = Number(req.query.offset ?? 0);

        if (
            !Number.isSafeInteger(limit) ||
            limit < 1 ||
            !Number.isSafeInteger(offset) ||
            offset < 0
        ) {
            return res.status(400).json({
                message: 'limit debe ser 1-100 y offset un entero no negativo',
            });
        }

        const personas = await personaService.getAll({ limit, offset });

        res.status(200).json({
            data: personas,
            pagination: { limit, offset },
        });
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const persona = await personaService.getById(req.params.id);

        if (!persona) {
            return res.status(404).json({
                message: 'Persona no encontrada',
            });
        }

        res.status(200).json(persona);
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const persona = await personaService.create(req.body);

        res.status(201).json({
            message: 'Persona creada correctamente',
            data: persona,
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const persona = await personaService.update(
            req.params.id,
            req.body
        );

        if (!persona) {
            return res.status(404).json({
                message: 'Persona no encontrada',
            });
        }

        res.status(200).json({
            message: 'Persona actualizada correctamente',
            data: persona,
        });
    } catch (error) {
        next(error);
    }
};

const patch = async (req, res, next) => {
    try {
        const persona = await personaService.patch(
            req.params.id,
            req.body
        );

        if (!persona) {
            return res.status(404).json({
                message: 'Persona no encontrada',
            });
        }

        res.status(200).json({
            message: 'Persona actualizada correctamente',
            data: persona,
        });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        const persona = await personaService.remove(req.params.id);

        if (!persona) {
            return res.status(404).json({
                message: 'Persona no encontrada',
            });
        }

        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

export { getAll, getById, create, update, patch, remove };