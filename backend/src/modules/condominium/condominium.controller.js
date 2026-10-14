
import * as condominiumService from './condominium.service.js';

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

        const condominiums = await condominiumService.getAll({
            limit,
            offset,
        });

        res.status(200).json({
            data: condominiums,
            pagination: { limit, offset },
        });
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const condominium = await condominiumService.getById(req.params.id);

        if (!condominium) {
            return res.status(404).json({
                message: 'Condominio no encontrado',
            });
        }

        res.status(200).json(condominium);
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const condominium = await condominiumService.create(req.body);

        res.status(201).json({
            message: 'Condominio creado correctamente',
            data: condominium,
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const condominium = await condominiumService.update(
            req.params.id,
            req.body
        );

        if (!condominium) {
            return res.status(404).json({
                message: 'Condominio no encontrado',
            });
        }

        res.status(200).json({
            message: 'Condominio actualizado correctamente',
            data: condominium,
        });
    } catch (error) {
        next(error);
    }
};

const patch = async (req, res, next) => {
    try {
        const condominium = await condominiumService.patch(
            req.params.id,
            req.body
        );

        if (!condominium) {
            return res.status(404).json({
                message: 'Condominio no encontrado',
            });
        }

        res.status(200).json({
            message: 'Condominio actualizado correctamente',
            data: condominium,
        });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        const condominium = await condominiumService.remove(req.params.id);

        if (!condominium) {
            return res.status(404).json({
                message: 'Condominio no encontrado',
            });
        }

        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

export { getAll, getById, create, update, patch, remove };