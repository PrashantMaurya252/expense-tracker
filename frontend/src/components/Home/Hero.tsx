import { Button } from "../ui/button"

export default function Hero() {
  return (
    <section className="text-center py-20 bg-gradient-to-r from-blue-100 to-purple-100">
      <h1 className="text-4xl font-bold mb-4">Track Your Expenses Smartly</h1>
      <p className="text-gray-700 mb-6">Visualize, Manage & Save better with our simple tracker.</p>
      <Button size="lg" className="text-white bg-blue-600 hover:bg-blue-700">
        Go to Dashboard
      </Button>
    </section>
  )
}
