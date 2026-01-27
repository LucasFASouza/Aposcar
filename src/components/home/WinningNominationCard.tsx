"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import { api } from "@/trpc/react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts";

type WinningNominationCardProps = {
  nomination: {
    id: string;
    categoryName: string;
    category: string;
    isWinnerLastUpdate: Date | null;
    movie: {
      name: string | null;
    };
  };
  editionYear?: number;
};

export function WinningNominationCard({
  nomination,
  editionYear,
}: WinningNominationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: voteData, isLoading } =
    api.nominations.getCategoryVoteStats.useQuery(
      { categoryId: nomination.category, editionYear },
      { enabled: isExpanded },
    );

  const totalVotes =
    voteData?.voteStats.reduce(
      (sum, stat) => sum + Number(stat.voteCount),
      0,
    ) ?? 0;

  const chartData =
    voteData?.voteStats.map((stat) => {
      const votes = Number(stat.voteCount);
      const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;

      return {
        name: stat.movieName ?? stat.receiverName ?? "Unknown",
        votes: percentage,
        voteCount: votes,
        isWinner: stat.isWinner,
        nominationId: stat.nominationId,
      };
    }) ?? [];

  const chartConfig: ChartConfig = {
    votes: {
      label: "Votes",
      color: "hsl(var(--primary))",
    },
  };

  const hasWinner = chartData.some((d) => d.isWinner);
  const getBarColor = (isWinner: boolean) => {
    if (!hasWinner) {
      return "hsl(var(--primary))";
    }
    if (isWinner) {
      return "hsl(var(--primary))";
    }
    return "hsl(var(--contrasting-secondary))";
  };

  return (
    <div className="space-y-1 border-b p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left transition-colors hover:opacity-80"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm">{nomination.categoryName}</h3>
            {nomination.isWinnerLastUpdate && (
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(nomination.isWinnerLastUpdate)} ago
              </p>
            )}
          </div>
          <div className="ml-2">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </div>

        <h2 className="text-lg font-semibold text-primary">
          {nomination.movie.name}
        </h2>
      </button>

      {isExpanded && (
        <div className="pt-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading votes...</p>
          ) : chartData.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="w-full"
              style={{ height: `${25 * chartData.length + 25}px` }}
            >
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ left: 20, right: 60 }}
              >
                <XAxis
                  type="number"
                  tickFormatter={(value: number) => `${value.toFixed(0)}%`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  tick={(props: {
                    x: number;
                    y: number;
                    payload: { value: string };
                  }) => {
                    const { x, y, payload } = props;
                    const entry = chartData.find(
                      (d) => d.name === payload.value,
                    );
                    const isWinner = entry?.isWinner ?? false;

                    let color = "hsl(var(--foreground))";
                    if (isWinner) {
                      color = "hsl(var(--primary))";
                    }

                    return (
                      <text
                        x={x}
                        y={y}
                        textAnchor="end"
                        style={{
                          fill: color,
                        }}
                        fontSize={11}
                        dy={4}
                      >
                        {payload.value}
                      </text>
                    );
                  }}
                  tickLine={false}
                  interval={0}
                />
                <ChartTooltip
                  content={({
                    active,
                    payload,
                  }: {
                    active?: boolean;
                    payload?: Array<{ payload?: (typeof chartData)[0] }>;
                  }) => {
                    if (active && payload?.[0]?.payload) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="text-sm font-semibold">
                            {data.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {data.voteCount} votes ({data.votes.toFixed(1)}%)
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                  cursor={false}
                />
                <Bar dataKey="votes" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getBarColor(entry.isWinner)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          ) : (
            <p className="text-sm text-muted-foreground">No votes yet</p>
          )}
        </div>
      )}
    </div>
  );
}
