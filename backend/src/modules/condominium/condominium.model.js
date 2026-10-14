import pool from '../../config/database.js';

const getAll = async ({ limit, offset }) => {
    const query = `
        SELECT
            id_condominio,
            nombre,
            direccion,
            cantidad_pisos,
            cantidad_sotanos,
            activo,
            fecha_registro,
            created_at,
            updated_at,
            is_active
        FROM condominio
        WHERE deleted_at IS NULL
        ORDER BY id_condominio
        LIMIT $1 OFFSET $2
    `;

    const { rows } = await pool.query(query, [limit, offset]);
    return rows;
};

const getById = async (id) => {
    const { rows } = await pool.query(
        `SELECT *
         FROM condominio
         WHERE id_condominio = $1
           AND deleted_at IS NULL`,
        [id]
    );

    return rows[0] ?? null;
};

const create = async (data) => {
    const {
        nombre,
        direccion,
        cantidad_pisos,
        cantidad_sotanos,
        activo,
        is_active,
    } = data;

    const query = `
        INSERT INTO condominio (
            nombre,
            direccion,
            cantidad_pisos,
            cantidad_sotanos,
            activo,
            is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;

    const values = [
        nombre,
        direccion,
        cantidad_pisos,
        cantidad_sotanos,
        activo,
        is_active,
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
        'direccion',
        'cantidad_pisos',
        'cantidad_sotanos',
        'activo',
        'is_active',
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
        UPDATE condominio
        SET ${fields.join(', ')}
        WHERE id_condominio = $${index}
          AND deleted_at IS NULL
        RETURNING *
    `;

    const { rows } = await pool.query(query, values);
    return rows[0] ?? null;
};

const remove = async (id) => {
    const query = `
        UPDATE condominio
        SET deleted_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id_condominio = $1
          AND deleted_at IS NULL
        RETURNING id_condominio, deleted_at
    `;

    const { rows } = await pool.query(query, [id]);
    return rows[0] ?? null;
};

export { getAll, getById, create, update, remove };