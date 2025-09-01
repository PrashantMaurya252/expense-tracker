"use client";

import * as React from "react";
import { format, subMonths } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ExpenseModal from "@/components/ExpenseModal";

const Expense = () => {
  const [fromDate, setFromDate] = React.useState<Date | undefined>(
    subMonths(new Date(), 1)
  );
  const [toDate, setToDate] = React.useState<Date | undefined>(new Date());
  const [openModal,setOpenModal] = React.useState<boolean>(false)

  const invoices = [
    {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV004",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV005",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV006",
      paymentStatus: "Pending",
      totalAmount: "$200.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV007",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
  ];

  const handleSubmit = async()=>{
    console.log("formSubmitted")
  }

  return (
    <div className="flex flex-col w-full px-4 py-6 md:px-8 lg:px-12">
      {/* Filters Section */}
      <div className="w-full bg-white dark:bg-neutral-900 shadow-md rounded-2xl p-4 md:p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* From Date */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">From Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-empty={!fromDate}
                  className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? format(fromDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                  required={false}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* To Date */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">To Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-empty={!toDate}
                  className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                  required={false}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Total Expense */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Total Expense</label>
            <span className="text-lg font-semibold text-primary">5000</span>
          </div>

          {/* Order */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Order</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ascending">Ascending</SelectItem>
                <SelectItem value="descending">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add Expense */}
          <div className="flex flex-col gap-1 justify-end items-center">
            <Button className="w-full sm:w-auto" onClick={()=>setOpenModal(true)}>Add Expense</Button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white dark:bg-neutral-900 shadow-md rounded-2xl p-4 md:p-6 mb-6">
        <Table>
          <TableCaption>A list of your recent expenses.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>{invoice.paymentStatus}</TableCell>
                <TableCell>{invoice.paymentMethod}</TableCell>
                <TableCell>{invoice.totalAmount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="font-semibold">
                Total
              </TableCell>
              <TableCell className="font-semibold text-primary">
                $2,500.00
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <ExpenseModal open={openModal} onClose={()=>setOpenModal(false)} onSubmit={handleSubmit}/>
    </div>
  );
};

export default Expense;
