"use client";

import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// ✅ Zod schema
const expenseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z
    .number(),
    // .min(1, "Amount is required")
    // .refine((val) => !isNaN(Number(val)), "Amount must be a number"),
  category: z.string(),
  description: z.string().optional(),
});

// ✅ Types inferred from schema
type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ExpenseFormData) => void;
}

export default function ExpenseModal({
  open,
  onClose,
  onSubmit,
}: ExpenseModalProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: "",
      amount: undefined,
      category: "",
      description: "",
    },
  });

  const handleFormSubmit: SubmitHandler<ExpenseFormData> = (data) => {
    onSubmit(data);
    reset()
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Title */}
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <div>
                <Input placeholder="Title" {...field} />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>
            )}
          />

          {/* Amount */}
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <div>
                <Input type="number" placeholder="Amount" {...field} value={field.value} onChange={(e)=>field.onChange(Number(e.target.value))}/>
                {errors.amount && (
                  <p className="text-red-500 text-sm">{errors.amount.message}</p>
                )}
              </div>
            )}
          />

          {/* Category */}
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <div className="w-full">
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value ?? ""}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Rent&Bills">Rent & Bills</SelectItem>
                    <SelectItem value="Shopping">Shopping</SelectItem>
                    <SelectItem value="Grocery">Grocery</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-red-500 text-sm">
                    {errors.category.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Description */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div>
                <Textarea
                  placeholder="Description (optional)"
                  className="resize-none"
                  {...field}
                />
              </div>
            )}
          />

          <div className="w-full flex justify-end items-center gap-3">
            <Button className=" cursor-pointer" onClick={()=>reset()}>
            Cancel
          </Button>
            <Button type="submit" className=" cursor-pointer">
            Add Expense
          </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}
