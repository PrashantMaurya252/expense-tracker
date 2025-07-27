import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const data = [
  { name: "Food", value: 300 },
  { name: "Rent", value: 700 },
  { name: "Shopping", value: 200 },
]

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"]

export default function ChartPreview() {
  return (
    <section className="p-8 bg-white">
      <h2 className="text-center text-2xl font-semibold mb-4">Sample Expense Chart</h2>
      <div className="flex justify-center">
        <ResponsiveContainer width={300} height={300}>
          <PieChart>
            <Pie data={data} dataKey="value" outerRadius={100} label>
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
