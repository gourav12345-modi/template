import express from "express";
import * as restaurantController from "../controllers/restaurant.controller";
import categoryRoutes from './category.routes'
import menuRoutes from './menu.routes'
import auth from "../middlewares/auth.middleware";

const router = express.Router()

router.use('/:restaurantId/category/', categoryRoutes)
router.use('/:restaurantId/menu-item/', menuRoutes)
router.post('/', auth, restaurantController.createRestaurant)
router.get('/all', auth, restaurantController.getAllRestaurants)
router.get('/:restaurantId', restaurantController.getRestaurant)
router.post('/:restaurantId/staff', auth, restaurantController.addStaff)

export default router
