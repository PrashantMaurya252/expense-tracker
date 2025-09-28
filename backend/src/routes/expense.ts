import express from 'express'
import { addExpense } from '../controllers/expenseController.ts'
import { verifyUser } from '../middlewares/auth.ts'

const router = express.Router()

router.post('/add-expense',verifyUser,addExpense)

export default router