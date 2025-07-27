import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { DollarSign, PieChart, Clock } from "lucide-react"

const features = [
  {
    title: "Add & Categorize Expenses",
    icon: <DollarSign className="w-6 h-6" />,
    desc: "Log and organize your spending by category.",
  },
  {
    title: "Visualize with Charts",
    icon: <PieChart className="w-6 h-6" />,
    desc: "See where your money goes with dynamic reports.",
  },
  {
    title: "Track Daily/Monthly",
    icon: <Clock className="w-6 h-6" />,
    desc: "Stay on top of your daily and monthly spending habits.",
  },
]

export default function Features() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-12">
      {features.map((feature) => (
        <Card key={feature.title}>
          <CardHeader>
            <div className="text-blue-600">{feature.icon}</div>
            <CardTitle>{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{feature.desc}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
