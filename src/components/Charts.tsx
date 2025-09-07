import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LogEntry {
  jobName: string;
  date: string;
  status: 'success' | 'failed' | 'warning' | 'no-files' | 'incremental';
  errors: number;
  warnings: number;
}

interface ChartsProps {
  data: LogEntry[];
}

const Charts = ({ data }: ChartsProps) => {
  const statusData = [
    {
      name: "Sucessos",
      value: data.filter(d => d.status === 'success').length,
      color: "hsl(var(--success))",
    },
    {
      name: "Falhas",
      value: data.filter(d => d.status === 'failed').length,
      color: "hsl(var(--destructive))",
    },
    {
      name: "Avisos",
      value: data.filter(d => d.status === 'warning').length,
      color: "hsl(var(--warning))",
    },
    {
      name: "Sem novos arquivos",
      value: data.filter(d => d.status === 'no-files').length,
      color: "hsl(var(--muted-foreground))",
    },
    {
      name: "Incremental",
      value: data.filter(d => d.status === 'incremental').length,
      color: "#3b82f6",
    },
  ];

  const timelineData = data.reduce((acc, entry) => {
    const date = entry.date.split(' ')[0];
    const existing = acc.find(item => item.date === date);
    
    if (existing) {
      existing[entry.status === 'no-files' ? 'noFiles' : entry.status]++;
    } else {
      acc.push({
        date,
        success: entry.status === 'success' ? 1 : 0,
        failed: entry.status === 'failed' ? 1 : 0,
        warning: entry.status === 'warning' ? 1 : 0,
        noFiles: entry.status === 'no-files' ? 1 : 0,
        incremental: entry.status === 'incremental' ? 1 : 0,
      });
    }
    
    return acc;
  }, [] as any[]).slice(-7);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Distribuição de Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Timeline (Últimos 7 dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Bar dataKey="success" stackId="a" fill="hsl(var(--success))" />
              <Bar dataKey="failed" stackId="a" fill="hsl(var(--destructive))" />
              <Bar dataKey="warning" stackId="a" fill="hsl(var(--warning))" />
              <Bar dataKey="noFiles" stackId="a" fill="hsl(var(--muted-foreground))" />
              <Bar dataKey="incremental" stackId="a" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Charts;