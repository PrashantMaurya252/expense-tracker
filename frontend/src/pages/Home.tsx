// src/pages/Home.tsx
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const data = [
  { name: "Travel", value: 150 },
  { name: "Food", value: 300 },
  { name: "Rent & Bills", value: 700 },
  { name: "Shopping", value: 200 },
  { name: "Others", value: 100 },
]

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ec4899", "#6366f1"]

const Home = () => {
  return (
    <main className="w-full text-gray-800">
      {/* Hero */}
      <section className="py-16 px-6 text-center bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to SmartExpense</h1>
        <p className="text-lg max-w-xl mx-auto">
          Track, analyze, and take control of your spending. Manage your expenses effortlessly.
        </p>
      </section>

      {/* Features */}
      <section className="py-12 px-6 bg-white text-center">
        <h2 className="text-3xl font-semibold mb-6">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
          {[
            "Perform CRUD operations on your expenses",
            "Compare spending between two time periods",
            "Visualize spending by category",
            "Secure and fast authentication",
            "Mobile-friendly interface",
            "Real-time data updates",
          ].map((feature, idx) => (
            <div key={idx} className="p-4 border rounded-xl shadow-sm">
              <p>✅ {feature}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-3xl font-semibold mb-6 text-center">How It Works</h2>
        <ol className="list-decimal max-w-3xl mx-auto space-y-4 text-left pl-6">
          <li>Sign up and log in to your account</li>
          <li>Add your daily/weekly/monthly expenses</li>
          <li>Categorize each expense for better insights</li>
          <li>View charts to analyze your spending patterns</li>
          <li>Compare different time ranges for better planning</li>
        </ol>
      </section>

      {/* Expense Chart */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-2xl font-semibold mb-6 text-center">Expense Category Breakdown</h2>
        <div className="flex flex-col items-center">
          <ResponsiveContainer width={300} height={300}>
            <PieChart>
              <Pie data={data} dataKey="value" outerRadius={100} label>
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <ul className="mt-6 grid grid-cols-2 gap-4 text-sm">
            {data.map((item, index) => (
              <li key={index} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 text-center bg-gray-100 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} SmartExpense. Built with ❤️ by Prashant Maurya.
      </footer>
    </main>
  )
}

export default Home
