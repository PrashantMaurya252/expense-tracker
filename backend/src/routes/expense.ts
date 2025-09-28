import express from 'express'
import { addExpense, getAllExpenses } from '../controllers/expenseController.ts'
import { verifyUser } from '../middlewares/auth.ts'

const router = express.Router()

router.post('/add-expense',verifyUser,addExpense)
router.get('/all-expenses',verifyUser,getAllExpenses)

export default router