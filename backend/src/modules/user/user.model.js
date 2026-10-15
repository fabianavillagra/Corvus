import pool from '../../config/database.js';

const publicColumns = `
    id_usuario,
    id_persona,
    usuario,
    activo,
    ultimo_acceso,
    created_at,
    updated_at,
    is_active
`;

export const getAll = async (limit, offset) => {
    const query = `
        SELECT ${publicColumns}
        FROM usuario
        WHERE is_active = TRUE
          AND deleted_at IS NULL
        ORDER BY id_usuario
        LIMIT $1 OFFSET $2
    `;

    const { rows } = await pool.query(query, [limit, offset]);
    return rows;
};

export const getById = async (id) => {
    const query = `
        SELECT ${publicColumns}
        FROM usuario
        WHERE id_usuario = $1
          AND is_active = TRUE
          AND deleted_at IS NULL
    `;

    const { rows } = await pool.query(query, [id]);
    return rows[0] ?? null;
};

export const getPersonById = async (personId) => {
    const query = `
        SELECT id_persona
        FROM persona
        WHERE id_persona = $1
          AND is_active = TRUE
          AND deleted_at IS NULL
    `;

    const { rows } = await pool.query(query, [personId]);
    return rows[0] ?? null;
};

export const getByUsername = async (username) => {
    const query = `
        SELECT id_usuario
        FROM usuario
        WHERE LOWER(usuario) = LOWER($1)
          AND is_active = TRUE
          AND deleted_at IS NULL
    `;

    const { rows } = await pool.query(query, [username]);
    return rows[0] ?? null;
};

export const create = async (data) => {
    const query = `
        INSERT INTO usuario (
            id_persona,
            usuario,
            contrasena,
            activo
        )
        VALUES ($1, $2, $3, $4)
        RETURNING ${publicColumns}
    `;

    const values = [
        data.id_persona,
        data.usuario,
        data.contrasena,
        data.activo
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
};

export const update = async (id, data) => {
    const fields = {
        id_persona: data.id_persona,
        usuario: data.usuario,
        contrasena: data.contrasena,
        activo: data.activo
    };

    const updates = [];
    const values = [];

    for (const [field, value] of Object.entries(fields)) {
        if (value !== undefined) {
            values.push(value);
            updates.push(`${field} = $${values.length}`);
        }
    }

    if (updates.length === 0) {
        return getById(id);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `
        UPDATE usuario
        SET ${updates.join(', ')}
        WHERE id_usuario = $${values.length}
          AND is_active = TRUE
          AND deleted_at IS NULL
        RETURNING ${publicColumns}
    `;

    const { rows } = await pool.query(query, values);
    return rows[0] ?? null;
};

export const remove = async (id) => {
    const query = `
        UPDATE usuario
        SET is_active = FALSE,
            deleted_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id_usuario = $1
          AND is_active = TRUE
          AND deleted_at IS NULL
        RETURNING id_usuario, is_active, deleted_at
    `;

    const { rows } = await pool.query(query, [id]);
    return rows[0] ?? null;
};