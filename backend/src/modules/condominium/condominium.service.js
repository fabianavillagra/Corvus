
import * as condominiumModel from './condominium.model.js';

const editableFields = [
    'nombre',
    'direccion',
    'cantidad_pisos',
    'cantidad_sotanos',
    'activo',
    'is_active',
];

const hasOwn = (object, property) =>
    Object.hasOwn(object, property);

const validateId = (id) => {
    const parsedId = Number(id);

    if (!Number.isSafeInteger(parsedId) || parsedId <= 0) {
        const error = new Error('El ID debe ser un entero positivo');
        error.status = 400;
        throw error;
    }

    return parsedId;
};

const validateData = (data, { partial = false } = {}) => {
    if (
        data === null ||
        typeof data !== 'object' ||
        Array.isArray(data)
    ) {
        const error = new Error('El cuerpo debe ser un objeto JSON');
        error.status = 400;
        throw error;
    }

    const unknownFields = Object.keys(data).filter(
        (field) => !editableFields.includes(field)
    );

    if (unknownFields.length > 0) {
        const error = new Error(
            `Campos no permitidos: ${unknownFields.join(', ')}`
        );
        error.status = 400;
        throw error;
    }

    if (!partial || hasOwn(data, 'nombre')) {
        if (
            typeof data.nombre !== 'string' ||
            data.nombre.trim().length === 0
        ) {
            const error = new Error('El nombre es obligatorio');
            error.status = 400;
            throw error;
        }

        data.nombre = data.nombre.trim();
    }

    if (!partial || hasOwn(data, 'direccion')) {
        if (
            typeof data.direccion !== 'string' ||
            data.direccion.trim().length === 0
        ) {
            const error = new Error('La dirección es obligatoria');
            error.status = 400;
            throw error;
        }

        data.direccion = data.direccion.trim();
    }

    for (const field of ['cantidad_pisos', 'cantidad_sotanos']) {
        if (!hasOwn(data, field)) {
            if (!partial) {
                const error = new Error(`${field} es obligatorio`);
                error.status = 400;
                throw error;
            }

            continue;
        }

        if (
            !Number.isSafeInteger(data[field]) ||
            data[field] < 0
        ) {
            const error = new Error(
                `${field} debe ser un entero mayor o igual a cero`
            );
            error.status = 400;
            throw error;
        }
    }

    for (const field of ['activo', 'is_active']) {
        if (hasOwn(data, field) && typeof data[field] !== 'boolean') {
            const error = new Error(`${field} debe ser booleano`);
            error.status = 400;
            throw error;
        }
    }

    if (!partial) {
        data.activo ??= true;
        data.is_active ??= true;
    }

    if (partial && Object.keys(data).length === 0) {
        const error = new Error(
            'Debes enviar al menos un campo para actualizar'
        );
        error.status = 400;
        throw error;
    }

    return data;
};

const getAll = async (options) => {
    return condominiumModel.getAll(options);
};

const getById = async (id) => {
    return condominiumModel.getById(validateId(id));
};

const create = async (data) => {
    const validatedData = validateData(data);
    return condominiumModel.create(validatedData);
};

const update = async (id, data) => {
    const validatedData = validateData(data);
    return condominiumModel.update(validateId(id), validatedData);
};

const patch = async (id, data) => {
    const validatedData = validateData(data, { partial: true });
    return condominiumModel.update(validateId(id), validatedData);
};

const remove = async (id) => {
    return condominiumModel.remove(validateId(id));
};

export { getAll, getById, create, update, patch, remove };