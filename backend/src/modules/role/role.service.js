
import * as roleModel from './role.model.js';

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const validateId = (id) => {
    const parsedId = Number(id);

    if (!Number.isSafeInteger(parsedId) || parsedId <= 0) {
        throw createError('ID de rol inválido', 400);
    }

    return parsedId;
};

const validateData = (data, partial = false) => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw createError(
            'El cuerpo de la solicitud debe ser un objeto JSON',
            400
        );
    }

    const unknownFields = Object.keys(data).filter(
        (field) => field !== 'descripcion'
    );

    if (unknownFields.length > 0) {
        throw createError(
            `Campos no permitidos: ${unknownFields.join(', ')}`,
            400
        );
    }

    if (!partial && data.descripcion === undefined) {
        throw createError('El campo descripcion es obligatorio', 400);
    }

    const validated = {};

    if (data.descripcion !== undefined) {
        if (typeof data.descripcion !== 'string') {
            throw createError('descripcion debe ser texto', 400);
        }

        const descripcion = data.descripcion.trim();

        if (descripcion.length < 3 || descripcion.length > 150) {
            throw createError(
                'descripcion debe tener entre 3 y 150 caracteres',
                400
            );
        }

        validated.descripcion = descripcion;
    }

    if (Object.keys(validated).length === 0) {
        throw createError('Debes enviar al menos un campo válido', 400);
    }

    return validated;
};

export const getAll = async (query = {}) => {
    const rawLimit = query.limit === undefined ? 10 : Number(query.limit);
    const rawOffset = query.offset === undefined ? 0 : Number(query.offset);

    if (!Number.isSafeInteger(rawLimit) || rawLimit < 1 || rawLimit > 100) {
        throw createError('limit debe ser un entero entre 1 y 100', 400);
    }

    if (!Number.isSafeInteger(rawOffset) || rawOffset < 0) {
        throw createError('offset debe ser un entero mayor o igual a 0', 400);
    }

    return roleModel.getAll(rawLimit, rawOffset);
};

export const getById = async (id) => {
    const roleId = validateId(id);
    const role = await roleModel.getById(roleId);

    if (!role) {
        throw createError('Rol no encontrado', 404);
    }

    return role;
};

export const create = async (data) => {
    const validated = validateData(data);
    return roleModel.create(validated);
};

export const update = async (id, data) => {
    const roleId = validateId(id);
    const validated = validateData(data);

    const updatedRole = await roleModel.update(roleId, validated);

    if (!updatedRole) {
        throw createError('Rol no encontrado', 404);
    }

    return updatedRole;
};

export const patch = async (id, data) => {
    const roleId = validateId(id);
    const validated = validateData(data, true);

    const currentRole = await roleModel.getById(roleId);

    if (!currentRole) {
        throw createError('Rol no encontrado', 404);
    }

    const updatedRole = await roleModel.update(roleId, {
        descripcion: validated.descripcion ?? currentRole.descripcion
    });

    if (!updatedRole) {
        throw createError('No se pudo actualizar el rol', 404);
    }

    return updatedRole;
};

export const remove = async (id) => {
    const roleId = validateId(id);
    const deletedRole = await roleModel.remove(roleId);

    if (!deletedRole) {
        throw createError('Rol no encontrado', 404);
    }

    return deletedRole;
};