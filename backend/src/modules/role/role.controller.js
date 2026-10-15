
import * as roleService from './role.service.js';

export const getAll = async (req, res, next) => {
    try {
        const roles = await roleService.getAll(req.query);
        res.status(200).json(roles);
    } catch (error) {
        next(error);
    }
};

export const getById = async (req, res, next) => {
    try {
        const role = await roleService.getById(req.params.id);
        res.status(200).json(role);
    } catch (error) {
        next(error);
    }
};

export const create = async (req, res, next) => {
    try {
        const role = await roleService.create(req.body);
        res.status(201).json({
            message: 'Rol creado correctamente',
            data: role
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const role = await roleService.update(req.params.id, req.body);
        res.status(200).json({
            message: 'Rol actualizado correctamente',
            data: role
        });
    } catch (error) {
        next(error);
    }
};

export const patch = async (req, res, next) => {
    try {
        const role = await roleService.patch(req.params.id, req.body);
        res.status(200).json({
            message: 'Rol actualizado correctamente',
            data: role
        });
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        await roleService.remove(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};