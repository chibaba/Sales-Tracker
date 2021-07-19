import express from 'express';
import salesCtrl from '../controllers/sales.controller';
import authCtrl from '../controllers/auth.controller';

const router = express.Router()

router.route('/api/sales/current/preview')
.get(authCtrl.requireSignin, salesCtrl.currentMonthReview)

router.route('/api/sales/by/category')
.get(authCtrl.requireSignin, salesCtrl.salesByCategory)