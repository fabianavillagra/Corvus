import bcrypt from 'bcryptjs';
import * as userModel from './user.model.js';

const editableFields = [
    'id_persona',
    'usuario',
    'contrasena',
    'activo'
];

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const validateId = (id) => {
    const parsedId = Number(id);

    if (!Number.isSafeInteger(parsedId) || parsedId <= 0) {
        throw createError('ID de usuario inválido', 400);
    }

    return parsedId;
};

const validateData = (data, partial = false) => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw createError('El cuerpo de la solicitud debe ser un objeto JSON', 400);
    }

    const unknownFields = Object.keys(data).filter(
        (field) => !editableFields.includes(field)
    );

    if (unknownFields.length > 0) {
        throw createError(
            `Campos no permitidos: ${unknownFields.join(', ')}`,
            400
        );
    }

    if (!partial) {
        const requiredFields = ['id_persona', 'usuario'];

        for (const field of requiredFields) {
            if (data[field] === undefined || data[field] === null) {
                throw createError(`El campo ${field} es obligatorio`, 400);
            }
        }
    }

    const validated = {};

    if (data.id_persona !== undefined) {
        const personId = Number(data.id_persona);

        if (!Number.isSafeInteger(personId) || personId <= 0) {
            throw createError('id_persona debe ser un entero positivo', 400);
        }

        validated.id_persona = personId;
    }

    if (data.usuario !== undefined) {
        if (typeof data.usuario !== 'string') {
            throw createError('usuario debe ser texto', 400);
        }

        const username = data.usuario.trim();

        if (username.length < 3 || username.length > 50) {
            throw createError(
                'usuario debe tener entre 3 y 50 caracteres',
                400
            );
        }

        validated.usuario = username;
    }

    if (data.contrasena !== undefined) {
        if (typeof data.contrasena !== 'string' ||
            data.contrasena.length < 8 ||
            data.contrasena.length > 128) {
            throw createError(
                'contrasena debe tener entre 8 y 128 caracteres',
                400
            );
        }

        validated.contrasena = data.contrasena;
    }

    if (data.activo !== undefined) {
        if (typeof data.activo !== 'boolean') {
            throw createError('activo debe ser true o false', 400);
        }

        validated.activo = data.activo;
    }

    if (!partial && !validated.contrasena) {
        throw createError('El campo contrasena es obligatorio', 400);
    }

    if (Object.keys(validated).length === 0) {
        throw createError('Debes enviar al menos un campo válido', 400);
    }

    return validated;
};

const validatePerson = async (personId) => {
    const person = await userModel.getPersonById(personId);

    if (!person) {
        throw createError(
            'La persona indicada no existe o está eliminada',
            400
        );
    }
};

const validateUsername = async (username, currentId = null) => {
    const existing = await userModel.getByUsername(username);

    if (existing && existing.id_usuario !== currentId) {
        throw createError('El nombre de usuario ya está registrado', 409);
    }
};

const hashPassword = async (data) => {
    if (data.contrasena !== undefined) {
        data.contrasena = await bcrypt.hash(data.contrasena, 12);
    }

    return data;
};

export const getAll = async (query = {}) => {
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    const offset = Math.max(Number(query.offset) || 0, 0);

    if (!Number.isSafeInteger(offset)) {
        throw createError('offset inválido', 400);
    }

    return userModel.getAll(limit, offset);
};

export const getById = async (id) => {
    const userId = validateId(id);
    const user = await userModel.getById(userId);

    if (!user) {
        throw createError('Usuario no encontrado', 404);
    }

    return user;
};

export const create = async (data) => {
    const validated = validateData(data);

    await validatePerson(validated.id_persona);
    await validateUsername(validated.usuario);

    validated.activo ??= true;

    await hashPassword(validated);

    return userModel.create(validated);
};


const updateUser = async (id, data, partial) => {
    const userId = validateId(id);
    const validated = validateData(data, partial);

    const currentUser = await userModel.getById(userId);

    if (!currentUser) {
        throw createError('Usuario no encontrado', 404);
    }

    if (validated.id_persona !== undefined) {
        await validatePerson(validated.id_persona);
    }

    if (validated.usuario !== undefined) {
        await validateUsername(validated.usuario, userId);
    }

    await hashPassword(validated);

    const updatedUser = await userModel.update(userId, validated);

    if (!updatedUser) {
        throw createError('No se pudo actualizar el usuario', 404);
    }

    return updatedUser;
};

export const update = async (id, data) => {
    return updateUser(id, data, false);
};

export const patch = async (id, data) => {
    return updateUser(id, data, true);
};

export const remove = async (id) => {
    const userId = validateId(id);
    const deletedUser = await userModel.remove(userId);

    if (!deletedUser) {
        throw createError('Usuario no encontrado', 404);
    }

    return deletedUser;
};