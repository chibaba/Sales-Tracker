import express from 'express';
import salesCtrl from '../controllers/sales.controller';
import authCtrl from '../controllers/auth.controller';

const router = express.Router()

router.route('/api/sales/current/preview')
.get(authCtrl.requireSignin, salesCtrl.currentMonthReview)

router.route('/api/sales/by/category')
.get(authCtrl.requireSignin, salesCtrl.salesByCategory)

router.route('/api/sales/plot')
.get(authCtrl.requireSignin, salesCtrl.plotSales)

router.route('/api/sales/averages')
.get(authCtrl.requireSignin, salesCtrl.averageCategories)

router.route('/api/sales/yearly')
.get(authCtrl.requireSignin, salesCtrl.yearlySales)

router.route('/api/sales')
.post(authCtrl.requireSignin, salesCtrl.create)
.get(authCtrl.requireSignin, salesCtrl.listByUser)

router.route('/api/sales/:salesId')
.put(authCtrl.requireSignin, salesCtrl.hasAuthorization, salesCtrl.update)
.delete(authCtrl.requireSignin, salesCtrl.hasAuthorization, salesCtrl.remove)

router.param('salesId', salesCtrl.salesByID)

export default router