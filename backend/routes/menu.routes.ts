import express from "express";
import * as menuController from "../controllers/menu.controllers";
import auth from "../middlewares/auth.middleware";

const router = express.Router({ mergeParams: true }) // mergeParams to get parent routes param restaurantId 

router.post('/', auth, menuController.addItem)
router.put('/:itemId', auth, menuController.updateItem)
router.delete('/:itemId', auth, menuController.deleteItem)

export default router
