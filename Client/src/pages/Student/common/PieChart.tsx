"use client";

import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";


interface CorrectAnswersProps {
  correctQuestions: number,
  wrongQuestions: number,
  skippedQuestions: number,
  para?: string;

}

export const CorrectAnswers: React.FC<CorrectAnswersProps> = ({ correctQuestions, wrongQuestions, skippedQuestions, para }) => {
  const total = correctQuestions + wrongQuestions + skippedQuestions;

  // Updated chart data for test analysis
  const chartDataQuestion = [
    { category: "correct", value: correctQuestions, fill: "var(--color-unattempted)" },
    { category: "unattempted", value: wrongQuestions, fill: "var(--color-correct)" },
    { category: "wrong", value: skippedQuestions, fill: "var(--color-wrong)" },
  ];

  // Updated chart config for test analysis
  const chartConfigQuestion = {
    correct: {
      label: "Correct",
      color: "hsl(var(--chart-1))", // Green color for correct answers
    },
    unattempted: {
      label: "Unattempted",
      color: "hsl(var(--chart-2))", // Gray color for unattempted questions
    },
    wrong: {
      label: "Wrong",
      color: "hsl(var(--chart-3))", // Red color for wrong answers
    },
  } satisfies ChartConfig;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Questions Analysis</CardTitle>
        <CardDescription>Performance Overview</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        {total > 0 ? (
          <ChartContainer
            config={chartConfigQuestion}
            className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="value" hideLabel />}
              />
              <Pie data={chartDataQuestion} dataKey="value">
                <LabelList
                  dataKey="category"
                  className="fill-background"
                  stroke="none"
                  fontSize={10}
                  formatter={(value: keyof typeof chartConfigQuestion) =>
                    chartConfigQuestion[value]?.label
                  }
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="w-full h-full flex justify-center items-center text-muted-foreground text-semibold">
            <p>No questions attempted yet</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-center items-center text-sm">
        {para || "Showing analysis for the latest test"}
      </CardFooter>
    </Card>
  );
}



import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

interface BeatsStudentsProps {
  totalMarks: number,
  marksScored: number,
}
export const BeatsStudents: React.FC<BeatsStudentsProps> = ({ marksScored, totalMarks }) => {
  const percent = totalMarks > 0 ? marksScored / totalMarks : 0;


  // Updated chart data for student beats
  const chartDataBeats = [
    { category: "beats", value: percent * 100, fill: "var(--color-beats)" },
  ];

  //student beats
  const chartConfigBeats = {
    beats: {
      label: "Beats Benchmark",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;



  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Student Performance</CardTitle>
        <CardDescription>Percentage of Marks Scored</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfigBeats}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartDataBeats}
            startAngle={0}
            endAngle={250}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="value" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartDataBeats[0].value}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          out of full marks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex justify-center items-center text-sm">
        {marksScored} of marks scored out off {totalMarks}
      </CardFooter>
    </Card>
  );
}









import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { MonthWiseTests } from "@/types/studentTestHistory";

interface MarksBarChartProps {
  correctMarks: number,
  wrongMarks: number,
  skippedMarks: number,
  hintsMarks: number,
}

export const MarksBarChart: React.FC<MarksBarChartProps> = ({ correctMarks, wrongMarks, skippedMarks, hintsMarks }) => {

  const chartData = [
    { category: "Correct", marks: correctMarks, color: "#22c55e" },
    { category: "Wrong", marks: wrongMarks },
    { category: "Skipped", marks: skippedMarks },
    { category: "Hints", marks: hintsMarks },
  ];

  const chartConfig = {
    marks: {
      label: "Marks",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Performance Breakdown</CardTitle>
        <CardDescription>Marks Distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20 }}
            barGap={10}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="marks" fill="blue" radius={4}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Performance Analysis <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Breakdown of marks based on correctness and attempts.
        </div>
      </CardFooter>
    </Card>
  );
}





export const TestsAttempted: React.FC<{ data: MonthWiseTests[] }> = ({ data }) => {
  const chartData = data.map(item => ({
    month: item.month,
    desktop: item.tests,
  }));

  const allZero = chartData.every(item => item.desktop === 0);


  const chartConfig = {
    desktop: {
      label: "Tests",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tests Attempted</CardTitle>
        <CardDescription>Monthly test count for last 1 Year</CardDescription>
      </CardHeader>
      <CardContent>
        {allZero ? (
          <div className="w-full h-[200px] flex items-center justify-center text-muted-foreground">
            No tests attempted in the last 12 months
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} >
                <LabelList
                  dataKey="desktop"
                  position="top"
                  formatter={(value: number) => (value === 0 ? "0" : value)}
                />
              </Bar>

            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Showing total tests attempted over the last 12 months
        </div>
      </CardFooter>
    </Card>
  );
};

