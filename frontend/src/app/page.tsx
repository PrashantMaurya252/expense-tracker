"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const dataExpenses = [
  { name: "Food", value: 400 },
  { name: "Rent", value: 700 },
  { name: "Shopping", value: 300 },
  { name: "Transport", value: 200 },
];

const dataTrends = [
  { month: "Jan", expense: 400 },
  { month: "Feb", expense: 600 },
  { month: "Mar", expense: 800 },
  { month: "Apr", expense: 500 },
  { month: "May", expense: 700 },
];

const dataComparison = [
  { category: "Food", thisMonth: 400, lastMonth: 350 },
  { category: "Rent", thisMonth: 700, lastMonth: 700 },
  { category: "Shopping", thisMonth: 300, lastMonth: 250 },
  { category: "Transport", thisMonth: 200, lastMonth: 180 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Smart Expense Tracker
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
          Track your spending, visualize trends, and stay on top of your budget
          — anytime, anywhere.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-md">
            Get Started
          </button>
          <button className="px-6 py-3 rounded-2xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300">
            Learn More
          </button>
        </div>
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-16 max-w-7xl mx-auto">
        {/* Pie Chart */}
        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dataExpenses}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                  dataKey="value"
                >
                  {dataExpenses.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line Chart */}
        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dataTrends}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="expense" stroke="#2563eb" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>Category Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dataComparison}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="thisMonth" fill="#3b82f6" />
                <Bar dataKey="lastMonth" fill="#a855f7" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
