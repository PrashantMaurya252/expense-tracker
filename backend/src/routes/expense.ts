import express from 'express'
import { addExpense } from '../controllers/expenseController.ts'

const router = express.Router()

router.post('/add-expense',addExpense)

export default router