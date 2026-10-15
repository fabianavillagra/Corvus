import * as userService from './user.service.js';

export const getAll = async (req, res, next) => {
    try {
        const users = await userService.getAll(req.query);
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const getById = async (req, res, next) => {
    try {
        const user = await userService.getById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const create = async (req, res, next) => {
    try {
        const user = await userService.create(req.body);
        res.status(201).json({
            message: 'Usuario registrado correctamente',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const user = await userService.update(req.params.id, req.body);
        res.status(200).json({
            message: 'Usuario actualizado correctamente',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

export const patch = async (req, res, next) => {
    try {
        const user = await userService.patch(req.params.id, req.body);
        res.status(200).json({
            message: 'Usuario actualizado correctamente',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        await userService.remove(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};