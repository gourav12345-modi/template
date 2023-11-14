import express from "express";
import * as categoryController from "../controllers/category.controllers";
import auth from "../middlewares/auth.middleware";

const router = express.Router({mergeParams: true}) // mergeParams to get parent routes param restaurantId 

router.post('/', auth, categoryController.addCategory)
router.put('/:categoryId', auth, categoryController.updateCategory)
router.delete('/:categoryId', auth, categoryController.deleteCategory)

export default router
