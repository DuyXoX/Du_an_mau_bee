const express = require('express');
const productRouter = require('./productRoutes');

const loginsignupRouter = require('./loginsignupRouter');
const producttypeRoutes = require('./producttypeRoutes');
const donvitinhRoutes = require('./donvitinhRoutes');
const cartRoutes = require('./cartRoutes');
const donhangRoutes = require('./donhangRoutes');
const paymentzalo = require('./paymentRountZalo');
const ThanhToan = require('./ThanhToanRoutes');
const chitietsanphamRoutes = require('./chitietsanphamRoutes');
const { isAdmin, isManager, checkLogin } = require('../middlewares/authMiddleware');
const userAuthen = require('./userAuthen');
const userRoutes = require('./userRoutes');
const emailRouter = require('./email');
const authenLoginSignupRouter = require('./authenLoginSignupRouter');
const productProductTypeRouter = require('./productProductTypeRouter');
const apiRouter = express.Router();

apiRouter.use("/", authenLoginSignupRouter);
apiRouter.use('/', loginsignupRouter);
apiRouter.use('/', donvitinhRoutes);
apiRouter.use('/email', emailRouter)
apiRouter.use('/', productRouter);


apiRouter.use('/cart', checkLogin, cartRoutes);
apiRouter.use('/user', checkLogin, userRoutes);
apiRouter.use('/', checkLogin, donhangRoutes);
apiRouter.use('/', checkLogin, paymentzalo);
apiRouter.use('/', checkLogin, ThanhToan);

apiRouter.use('/user', checkLogin, isManager, isAdmin, userAuthen);
apiRouter.use('/', checkLogin, isManager, isAdmin, producttypeRoutes);
apiRouter.use('/', checkLogin, isManager, isAdmin, chitietsanphamRoutes);

// apiRouter.use('/DVT', donvitinhRoutes);
// apiRouter.use('/', donhangRoutes);
// apiRouter.use('/', chitietsanphamRoutes);

module.exports = apiRouter;