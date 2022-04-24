// import other routes
const productRoutes = require('./products');

const appRouter = (app, fs) => {
    // products routes
    productRoutes(app, fs);
};

module.exports = appRouter;