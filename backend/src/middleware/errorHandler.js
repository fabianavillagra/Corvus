
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    const status = err.status || 500;

    if (status >= 500) {
        console.error(err);
    }

    res.status(status).json({
        message:
            status >= 500
                ? 'Error interno del servidor'
                : err.message,
    });
};

export default errorHandler;