
import pool from '../../config/database.js';

const publicColumns = `
    id_rol,
    descripcion,
    created_at,
    updated_at,
    is_active
`;

export const getAll = async (limit, offset) => {
    const query = `
        SELECT ${publicColumns}
        FROM rol
        WHERE is_active = TRUE
          AND deleted_at IS NULL
        ORDER BY id_rol
        LIMIT $1 OFFSET $2
    `;

    const { rows } = await pool.query(query, [limit, offset]);
    return rows;
};

export const getById = async (id) => {
    const query = `
        SELECT ${publicColumns}
        FROM rol
        WHERE id_rol = $1
          AND is_active = TRUE
          AND deleted_at IS NULL
    `;

    const { rows } = await pool.query(query, [id]);
    return rows[0] ?? null;
};

export const create = async (data) => {
    const query = `
        INSERT INTO rol (descripcion, is_active)
        VALUES ($1, TRUE)
        RETURNING ${publicColumns}
    `;

    const { rows } = await pool.query(query, [data.descripcion]);
    return rows[0];
};

export const update = async (id, data) => {
    const query = `
        UPDATE rol
        SET descripcion = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id_rol = $2
          AND is_active = TRUE
          AND deleted_at IS NULL
        RETURNING ${publicColumns}
    `;

    const { rows } = await pool.query(query, [data.descripcion, id]);
    return rows[0] ?? null;
};

export const remove = async (id) => {
    const query = `
        UPDATE rol
        SET is_active = FALSE,
            deleted_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id_rol = $1
          AND is_active = TRUE
          AND deleted_at IS NULL
        RETURNING id_rol, descripcion, deleted_at, is_active
    `;

    const { rows } = await pool.query(query, [id]);
    return rows[0] ?? null;
};