"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Chart from "chart.js/auto"

interface AnalyticsChartsProps {
  type?: "overview" | "transactions" | "users" | "contracts"
}

export function AnalyticsCharts({ type = "overview" }: AnalyticsChartsProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const [chart, setChart] = useState<Chart | null>(null)
  const [timeperiod, setTimeperiod] = useState("30days")

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart instance if it exists
    if (chart) {
      chart.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Configure labels based on selected time period
    let labels = []
    let dataPoints = 0

    if (timeperiod === "7days") {
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      dataPoints = 7
    } else if (timeperiod === "30days") {
      labels = Array.from({ length: 30 }, (_, i) => `${i + 1}`)
      dataPoints = 30
    } else if (timeperiod === "90days") {
      labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].slice(0, 3)
      dataPoints = 3
    } else if (timeperiod === "1year") {
      labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      dataPoints = 12
    }

    // Generate random data based on chart type and time period
    const generateData = (count: number, min: number, max: number) => {
      // Create data with trends based on time period
      const baseValue = Math.floor((Math.random() * (max - min)) / 2) + min

      if (timeperiod === "7days") {
        // Weekly pattern: higher in middle of week, lower on weekends
        return Array.from({ length: count }, (_, i) => {
          const dayFactor = i === 0 || i === 6 ? 0.7 : 1.2
          return Math.floor(baseValue * dayFactor + (Math.random() * (max - min)) / 5)
        })
      } else if (timeperiod === "30days") {
        // Monthly pattern: gradual increase
        return Array.from({ length: count }, (_, i) => {
          const growthFactor = 1 + (i / count) * 0.5
          return Math.floor(baseValue * growthFactor + (Math.random() * (max - min)) / 4)
        })
      } else if (timeperiod === "90days") {
        // Quarterly pattern: seasonal variation
        return Array.from({ length: count }, (_, i) => {
          const seasonFactor = [1.1, 0.9, 1.2][i % 3]
          return Math.floor(baseValue * seasonFactor + (Math.random() * (max - min)) / 3)
        })
      } else {
        // Yearly pattern: seasonal trends
        return Array.from({ length: count }, (_, i) => {
          // Higher in summer and winter holidays, lower in spring/fall
          const monthFactor = i >= 5 && i <= 7 ? 1.3 : i >= 10 || i <= 1 ? 1.2 : 0.9
          return Math.floor(baseValue * monthFactor + (Math.random() * (max - min)) / 3)
        })
      }
    }

    // Configure datasets based on chart type
    let datasets = []
    const gradient = ctx.createLinearGradient(0, 0, 0, 400)

    if (type === "transactions") {
      gradient.addColorStop(0, "rgba(59, 130, 246, 0.5)")
      gradient.addColorStop(1, "rgba(59, 130, 246, 0.0)")
      datasets = [
        {
          label: "Transactions",
          data: generateData(dataPoints, 500, 2500),
          borderColor: "#3b82f6",
          backgroundColor: gradient,
          tension: 0.4,
          fill: true,
        },
      ]
    } else if (type === "users") {
      gradient.addColorStop(0, "rgba(16, 185, 129, 0.5)")
      gradient.addColorStop(1, "rgba(16, 185, 129, 0.0)")
      datasets = [
        {
          label: "New Users",
          data: generateData(dataPoints, 100, 800),
          borderColor: "#10b981",
          backgroundColor: gradient,
          tension: 0.4,
          fill: true,
        },
      ]
    } else if (type === "contracts") {
      gradient.addColorStop(0, "rgba(249, 115, 22, 0.5)")
      gradient.addColorStop(1, "rgba(249, 115, 22, 0.0)")
      datasets = [
        {
          label: "Deployed Contracts",
          data: generateData(dataPoints, 20, 150),
          borderColor: "#f97316",
          backgroundColor: gradient,
          tension: 0.4,
          fill: true,
        },
      ]
    } else {
      // Overview - show multiple datasets
      const transactionGradient = ctx.createLinearGradient(0, 0, 0, 400)
      transactionGradient.addColorStop(0, "rgba(59, 130, 246, 0.5)")
      transactionGradient.addColorStop(1, "rgba(59, 130, 246, 0.0)")

      const userGradient = ctx.createLinearGradient(0, 0, 0, 400)
      userGradient.addColorStop(0, "rgba(16, 185, 129, 0.5)")
      userGradient.addColorStop(1, "rgba(16, 185, 129, 0.0)")

      datasets = [
        {
          label: "Transactions",
          data: generateData(dataPoints, 500, 2500),
          borderColor: "#3b82f6",
          backgroundColor: "transparent",
          tension: 0.4,
          borderWidth: 2,
        },
        {
          label: "Users",
          data: generateData(dataPoints, 100, 800),
          borderColor: "#10b981",
          backgroundColor: "transparent",
          tension: 0.4,
          borderWidth: 2,
        },
      ]
    }

    // Create new chart
    const newChart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 2000,
          easing: "easeOutQuart",
        },
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 20,
            bottom: 10,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: timeperiod === "30days" ? 10 : 12,
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
            ticks: {
              maxTicksLimit: 5,
            },
          },
        },
        plugins: {
          legend: {
            display: type === "overview",
            position: "top",
            align: "start",
            labels: {
              usePointStyle: true,
              pointStyle: "circle",
              boxWidth: 8,
              boxHeight: 8,
              padding: 15,
              font: {
                size: 12,
              },
              // Increase spacing between point and text
              generateLabels: (chart) => {
                const datasets = chart.data.datasets
                return datasets.map((dataset, i) => {
                  return {
                    text: dataset.label,
                    fillStyle: dataset.borderColor,
                    strokeStyle: dataset.borderColor,
                    lineWidth: 0,
                    hidden: !chart.isDatasetVisible(i),
                    index: i,
                  }
                })
              },
            },
            // Add more space between legend items
            itemMarginTop: 5,
            itemMarginBottom: 5,
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            padding: 8,
            cornerRadius: 4,
            boxPadding: 3,
          },
        },
        elements: {
          point: {
            radius: 2,
            hoverRadius: 4,
          },
          line: {
            borderWidth: 2,
          },
        },
        interaction: {
          mode: "index",
          intersect: false,
        },
      },
    })

    setChart(newChart)

    return () => {
      newChart.destroy()
    }
  }, [type, timeperiod])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {type === "transactions"
              ? "Transaction Activity"
              : type === "users"
                ? "User Growth"
                : type === "contracts"
                  ? "Contract Usage"
                  : "Platform Overview"}
          </CardTitle>
          <CardDescription>
            {type === "transactions"
              ? "Transaction volume over time"
              : type === "users"
                ? "User acquisition and retention"
                : type === "contracts"
                  ? "Smart contract deployment and usage"
                  : "Key metrics for your dapps"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="30days" onValueChange={setTimeperiod}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="7days">7 days</TabsTrigger>
                <TabsTrigger value="30days">30 days</TabsTrigger>
                <TabsTrigger value="90days">90 days</TabsTrigger>
                <TabsTrigger value="1year">1 year</TabsTrigger>
              </TabsList>
            </div>
            <div className="h-[300px] w-full px-2">
              <canvas ref={chartRef} width={800} height={300} className="w-full h-full"></canvas>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {type === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Projects</CardTitle>
              <CardDescription>Most active projects by transaction volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="font-medium">NFT Marketplace</div>
                  <div className="text-muted-foreground">42,381 XLM</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-medium">Community DAO</div>
                  <div className="text-muted-foreground">38,192 XLM</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-medium">StellarSwap</div>
                  <div className="text-muted-foreground">27,845 XLM</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-medium">Fund My Project</div>
                  <div className="text-muted-foreground">18,293 XLM</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Network Distribution</CardTitle>
              <CardDescription>Deployment distribution across networks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[200px]">
                <div className="flex flex-col items-center">
                  <div className="flex gap-4 mb-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm">Testnet (65%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Mainnet (35%)</span>
                    </div>
                  </div>
                  <div className="w-32 h-32 rounded-full border-8 border-blue-500 relative">
                    <div
                      className="absolute inset-0 rounded-full border-8 border-green-500"
                      style={{ clipPath: "polygon(0 0, 100% 0, 100% 35%, 0 35%)" }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

