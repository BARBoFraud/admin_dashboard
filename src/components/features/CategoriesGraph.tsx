"use client"

import { Label, Pie, PieChart } from "recharts"
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
import { usePercentagesApi } from "@/api/Categories.api"
import { useEffect, useState } from "react"

const CHART_COLORS = {
  "Página de internet": "var(--chart-1)",
  "Red social": "var(--chart-2)",
  "Mensaje": "var(--chart-3)",
  "Llamada": "var(--chart-4)",
  "Correo electrónico": "var(--chart-5)",
}

export function CategoriesGraph() {
  const { getCategoriesPercentages } = usePercentagesApi();
  const [chartData, setChartData] = useState<{ name: string; count: number; fill: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCategoriesPercentages();
        const formattedData = data.map(item => ({
          name: item.name,
          count: Number(item.count),
          fill: CHART_COLORS[item.name as keyof typeof CHART_COLORS] || "var(--muted)"
        }));
        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching categories data:", error);
      }
    };

    fetchData();
  }, [getCategoriesPercentages]);

  const totalCount = chartData.reduce((acc, curr) => acc + curr.count, 0);

  const chartConfig: ChartConfig = {
    count: {
      label: "Cantidad",
    },
    ...Object.fromEntries(
      chartData.map(item => [
        item.name,
        { label: item.name, color: item.fill }
      ])
    )
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Distribución de Categorías</CardTitle>
        <CardDescription>Conteo por categoría</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalCount.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 pt-4">
        <div className="grid grid-cols-2 gap-2 w-full">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.fill }}
              />
              <span>{item.name}: {item.count}</span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}
