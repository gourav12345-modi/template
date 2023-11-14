import express from "express"
import * as memberController from "../controllers/owner.controllers"

const router = express.Router()

router.post('/register', memberController.register)
router.post('/login', memberController.login)

export default router
