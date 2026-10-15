
import pool from '../../config/database.js';

const getAll = async ({ limit, offset }) => {
    const query = `
        SELECT
            id_persona,
            nombre,
            apellido,
            ci,
            telefono,
            correo,
            fecha_registro,
            activo,
            created_at,
            updated_at,
            is_active
        FROM persona
        WHERE is_active = TRUE
          AND deleted_at IS NULL
        ORDER BY id_persona
        LIMIT $1 OFFSET $2
    `;

    const { rows } = await pool.query(query, [limit, offset]);
    return rows;
};

const getById = async (id) => {
    const query = `
        SELECT *
        FROM persona
        WHERE id_persona = $1
          AND is_active = TRUE
          AND deleted_at IS NULL
    `;

    const { rows } = await pool.query(query, [id]);
    return rows[0] ?? null;
};

const create = async (data) => {
    const {
        nombre,
        apellido,
        ci,
        telefono,
        correo,
        fecha_registro,
        activo,
    } = data;

    const query = `
        INSERT INTO persona (
            nombre,
            apellido,
            ci,
            telefono,
            correo,
            fecha_registro,
            activo
        )
        VALUES (
            $1, $2, $3, $4, $5,
            COALESCE($6::date, CURRENT_DATE),
            $7
        )
        RETURNING *
    `;

    const values = [
        nombre,
        apellido,
        ci,
        telefono ?? null,
        correo ?? null,
        fecha_registro ?? null,
        activo,
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
};

const update = async (id, data) => {
    const fields = [];
    const values = [];
    let index = 1;

    const editableFields = [
        'nombre',
        'apellido',
        'ci',
        'telefono',
        'correo',
        'fecha_registro',
        'activo',
    ];

    for (const field of editableFields) {
        if (Object.hasOwn(data, field)) {
            fields.push(`${field} = $${index}`);
            values.push(data[field]);
            index += 1;
        }
    }

    if (fields.length === 0) {
        return getById(id);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `
        UPDATE persona
        SET ${fields.join(', ')}
        WHERE id_persona = $${index}
          AND is_active = TRUE
          AND deleted_at IS NULL
        RETURNING *
    `;

    const { rows } = await pool.query(query, values);
    return rows[0] ?? null;
};

const remove = async (id) => {
    const query = `
        UPDATE persona
        SET is_active = FALSE,
            deleted_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id_persona = $1
          AND is_active = TRUE
          AND deleted_at IS NULL
        RETURNING id_persona, is_active, deleted_at
    `;

    const { rows } = await pool.query(query, [id]);
    return rows[0] ?? null;
};

export { getAll, getById, create, update, remove };