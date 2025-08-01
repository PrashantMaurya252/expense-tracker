import express from 'express'
import { userEmailSignIn, userEmailSignUp } from '../controllers/userController'

const router = express.Router()

router.post('/email-login',userEmailSignIn)
router.post('/email-signup',userEmailSignUp)
router.post('/')

export default router