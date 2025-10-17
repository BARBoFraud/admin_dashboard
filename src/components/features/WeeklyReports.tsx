"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { useEffect, useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useWeeklyReportsApi } from "@/api/WeeklyReports.api"

const chartConfig = {
  num: {
    label: "Reportes",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function WeeklyReportsChart() {
  const { getWeeklyReports } = useWeeklyReportsApi()
  const [chartData, setChartData] = useState<{ date: string; num: number }[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWeeklyReports()
        setChartData(data)
      } catch (error) {
        console.error("Error fetching weekly reports:", error)
      }
    }

    fetchData()
  }, [getWeeklyReports])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', { 
      weekday: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reportes Semanales</CardTitle>
        <CardDescription>Últimos 7 días</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              right: 12,
              left: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatDate}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0,4]}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="num"
              type="natural"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Mostrando total de reportes de los últimos 7 días
        </div>
      </CardFooter>
    </Card>
  )
}
