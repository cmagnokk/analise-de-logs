import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LogEntry {
  jobName: string;
  date: string;
  status: 'success' | 'failed' | 'warning';
  errors: number;
  warnings: number;
  details?: string;
}

interface ResultsTableProps {
  data: LogEntry[];
}

const ResultsTable = ({ data }: ResultsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof LogEntry>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(
      (entry) =>
        entry.jobName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [data, searchTerm, sortField, sortDirection]);

  const handleSort = (field: keyof LogEntry) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleRowExpansion = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "bg-success-soft text-success border-success/20",
      failed: "bg-destructive-soft text-destructive border-destructive/20",
      warning: "bg-warning-soft text-warning border-warning/20",
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || ""}>
        {status === 'success' ? 'Sucesso' : status === 'failed' ? 'Falha' : 'Aviso'}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg font-semibold">Resultados Detalhados</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por job ou status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("jobName")}
                    className="h-auto p-0 font-semibold"
                  >
                    Nome do Job
                    {sortField === "jobName" && (
                      sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("date")}
                    className="h-auto p-0 font-semibold"
                  >
                    Data/Hora
                    {sortField === "date" && (
                      sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("status")}
                    className="h-auto p-0 font-semibold"
                  >
                    Status
                    {sortField === "status" && (
                      sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="text-center">Erros</TableHead>
                <TableHead className="text-center">Avisos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedData.map((entry, index) => (
                <>
                  <TableRow key={index} className="hover:bg-muted/30">
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRowExpansion(index)}
                        className="h-8 w-8 p-0"
                      >
                        {expandedRows.has(index) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{entry.jobName}</TableCell>
                    <TableCell className="text-muted-foreground">{entry.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(entry.status)}
                        {getStatusBadge(entry.status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {entry.errors > 0 ? (
                        <span className="font-semibold text-destructive">{entry.errors}</span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {entry.warnings > 0 ? (
                        <span className="font-semibold text-warning">{entry.warnings}</span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(index) && (
                    <TableRow>
                      <TableCell colSpan={6} className="bg-muted/20 p-4">
                        <div className="text-sm">
                          <h4 className="font-semibold mb-2">Detalhes do Job:</h4>
                          <p className="text-muted-foreground">
                            {entry.details || "Backup executado com sucesso. Todos os arquivos foram processados corretamente."}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {filteredAndSortedData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum resultado encontrado.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsTable;