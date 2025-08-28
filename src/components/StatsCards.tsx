import { CheckCircle, XCircle, AlertTriangle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  stats: {
    total: number;
    success: number;
    failed: number;
    warnings: number;
  };
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const cards = [
    {
      title: "Total de Jobs",
      value: stats.total,
      icon: Clock,
      className: "border-l-4 border-l-primary",
    },
    {
      title: "Sucessos",
      value: stats.success,
      icon: CheckCircle,
      className: "border-l-4 border-l-success",
    },
    {
      title: "Falhas",
      value: stats.failed,
      icon: XCircle,
      className: "border-l-4 border-l-destructive",
    },
    {
      title: "Avisos",
      value: stats.warnings,
      icon: AlertTriangle,
      className: "border-l-4 border-l-warning",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className={`transition-all hover:shadow-md ${card.className}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;