const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || 'Eroare internă de server'
  });
};

module.exports = errorMiddleware;