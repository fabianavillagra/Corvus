
import * as personaModel from './person.model.js';

const editableFields = [
    'nombre',
    'apellido',
    'ci',
    'telefono',
    'correo',
    'fecha_registro',
    'activo',
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

    for (const field of ['nombre', 'apellido', 'ci']) {
        if (!partial || hasOwn(data, field)) {
            if (
                typeof data[field] !== 'string' ||
                data[field].trim().length === 0
            ) {
                const labels = {
                    nombre: 'El nombre es obligatorio',
                    apellido: 'El apellido es obligatorio',
                    ci: 'El CI es obligatorio',
                };

                const error = new Error(labels[field]);
                error.status = 400;
                throw error;
            }

            data[field] = data[field].trim();
        }
    }

    if (hasOwn(data, 'nombre') && data.nombre.length > 100) {
        const error = new Error('El nombre no puede superar 100 caracteres');
        error.status = 400;
        throw error;
    }

    if (hasOwn(data, 'apellido') && data.apellido.length > 100) {
        const error = new Error('El apellido no puede superar 100 caracteres');
        error.status = 400;
        throw error;
    }

    if (hasOwn(data, 'ci') && data.ci.length > 20) {
        const error = new Error('El CI no puede superar 20 caracteres');
        error.status = 400;
        throw error;
    }

    if (hasOwn(data, 'telefono') && data.telefono !== null) {
        if (
            typeof data.telefono !== 'string' ||
            data.telefono.trim().length === 0 ||
            data.telefono.trim().length > 30
        ) {
            const error = new Error(
                'El teléfono debe ser un texto de 1 a 30 caracteres o null'
            );
            error.status = 400;
            throw error;
        }

        data.telefono = data.telefono.trim();
    }

    if (hasOwn(data, 'correo') && data.correo !== null) {
        if (
            typeof data.correo !== 'string' ||
            data.correo.trim().length === 0 ||
            data.correo.trim().length > 255 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo.trim())
        ) {
            const error = new Error('El correo electrónico no es válido');
            error.status = 400;
            throw error;
        }

        data.correo = data.correo.trim();
    }

    if (hasOwn(data, 'fecha_registro')) {
        const fecha = data.fecha_registro;

        if (
            typeof fecha !== 'string' ||
            !/^\d{4}-\d{2}-\d{2}$/.test(fecha) ||
            (() => {
                const parsed = new Date(`${fecha}T00:00:00.000Z`);

                return (
                    Number.isNaN(parsed.getTime()) ||
                    parsed.toISOString().slice(0, 10) !== fecha
                );
            })()
        ) {
            const error = new Error(
                'fecha_registro debe tener una fecha válida en formato YYYY-MM-DD'
            );
            error.status = 400;
            throw error;
        }
    }

    if (hasOwn(data, 'activo') && typeof data.activo !== 'boolean') {
        const error = new Error('activo debe ser booleano');
        error.status = 400;
        throw error;
    }

    if (!partial) {
        data.activo ??= true;
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
    return personaModel.getAll(options);
};

const getById = async (id) => {
    return personaModel.getById(validateId(id));
};

const create = async (data) => {
    const validatedData = validateData(data);
    return personaModel.create(validatedData);
};

const update = async (id, data) => {
    const validatedData = validateData(data);
    return personaModel.update(validateId(id), validatedData);
};

const patch = async (id, data) => {
    const validatedData = validateData(data, { partial: true });
    return personaModel.update(validateId(id), validatedData);
};

const remove = async (id) => {
    return personaModel.remove(validateId(id));
};

export { getAll, getById, create, update, patch, remove };