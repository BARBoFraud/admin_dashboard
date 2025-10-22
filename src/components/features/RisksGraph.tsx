"use client";

import { Bar, BarChart, CartesianGrid, XAxis, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { usePercentagesApi } from "@/api/Risks.api";
import { useEffect, useState } from "react";

const CHART_COLORS = {
  "Alto": "var(--chart-1)",
  "Medio": "var(--chart-2)",
  "Bajo": "var(--chart-3)",
};

const chartConfig = {
  count: {
    label: "Cantidad",
  },
  Alto: {
    label: "Alto",
    color: CHART_COLORS.Alto,
  },
  Medio: {
    label: "Medio",
    color: CHART_COLORS.Medio,
  },
  Bajo: {
    label: "Bajo",
    color: CHART_COLORS.Bajo,
  },
} satisfies ChartConfig;

export function RisksGraph() {
  const { getRisksPercentages } = usePercentagesApi();
  const [chartData, setChartData] = useState<
    { name: string; count: number; fill: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRisksPercentages();
        const formattedData = data.map((item) => ({
          name: item.name,
          count: Number(item.count),
          fill: CHART_COLORS[item.name as keyof typeof CHART_COLORS] || "var(--muted)",
        }));
        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching risks data:", error);
      }
    };

    fetchData();
  }, [getRisksPercentages]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Riesgos</CardTitle>
        <CardDescription>Conteo por nivel de riesgo</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" strokeWidth={2} radius={8}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="grid grid-cols-3 gap-4 w-full">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="font-medium">
                {item.name}: {item.count}
              </span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}