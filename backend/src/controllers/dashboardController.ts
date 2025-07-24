import { Request, Response } from "express";
import Expense from "../models/expenseModal.ts";
import { AppError } from "../utils/AppError";
import dayjs from "dayjs";
import mongoose from "mongoose";
import minMax from "dayjs/plugin/minMax"
dayjs.extend(minMax)

export const monthlyExpenseCategory = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const months = parseInt(req.query.months as string) || 6;
    const startDate = dayjs()
      .subtract(months - 1, "month")
      .startOf("month")
      .toDate();
    const result = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            month: { $dateToString: { format: "%Y-%m", date: "$date" } },
            category: "$category",
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          categories: {
            $push: {
              k: "$_id.category",
              v: "$total",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          categories: { $arayToObject: "$categories" },
        },
      },
      { $sort: { month: 1 } },
    ]);

    res.status(200).json({ success: true, summary: result });
  } catch (error: any) {
    throw new AppError("monthly Expense Error", 500, error.message);
  }
};

export const compareMonths = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { month1, month2 } = req.query;

    if (!month1 || !month2) {
      throw new AppError(
        "Please Provide month 1 and month 2 in YYYY-MM-DD format",
        400
      );
    }

    const start1 = dayjs(`${month1}-01`).startOf("month").toDate();
    const end1 = dayjs(start1).endOf("month").toDate();

    const start2 = dayjs(`${month2}-01`).startOf("month").toDate();
    const end2 = dayjs(start2).endOf("month").toDate();

    const minDate = dayjs.min(dayjs(start1), dayjs(start2)).toDate();
    const maxDate = dayjs.max(dayjs(end1), dayjs(end2)).toDate();

    const aggregation = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: minDate, $lte: maxDate }
        }
      },
      {
        $project: {
          amount: 1,
          category: 1,
          month: { $dateToString: { format: "%Y-%m", date: "$date" } }
        }
      },
      {
        $match: {
          month: { $in: [month1, month2] }
        }
      },
      {
        $facet: {
          categoryComparison: [
            {
              $group: {
                _id: { category: "$category", month: "$month" },
                totalAmount: { $sum: "$amount" }
              }
            },
            {
              $group: {
                _id: "$_id.category",
                data: {
                  $push: {
                    k: "$_id.month",
                    v: "$totalAmount"
                  }
                }
              }
            },
            {
              $project: {
                _id: 0,
                category: "$_id",
                amounts: { $arrayToObject: "$data" }
              }
            }
          ],
          monthTotals: [
            {
              $group: {
                _id: "$month",
                totalAmount: { $sum: "$amount" }
              }
            },
            {
              $project: {
                _id: 0,
                month: "$_id",
                totalAmount: 1
              }
            }
          ]
        }
      }
    ]);

    const { categoryComparison, monthTotals } = aggregation[0];

    return res.status(200).json({
      categoryComparison,
      monthTotals
    });
  } catch (error: any) {
    throw new AppError("Compare monthly expenses Error", 500, error.message);
  }
};
