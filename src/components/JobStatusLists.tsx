import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogEntry } from "@/utils/mockData";

interface JobStatusListsProps {
  data: LogEntry[];
}

const JobStatusLists = ({ data }: JobStatusListsProps) => {
  const successJobs = data.filter(entry => entry.status === 'success');
  const failedJobs = data.filter(entry => entry.status === 'failed');
  const warningJobs = data.filter(entry => entry.status === 'warning');
  const noFilesJobs = data.filter(entry => entry.status === 'no-files');
  const incrementalJobs = data.filter(entry => entry.status === 'incremental');

  const JobList = ({ jobs, type, icon, badgeClass }: { 
    jobs: LogEntry[], 
    type: string, 
    icon: React.ReactNode,
    badgeClass: string 
  }) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          Jobs com {type}
          <Badge variant="outline" className={badgeClass}>
            {jobs.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {jobs.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            Nenhum job com {type.toLowerCase()}
          </p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {jobs.map((job, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{job.jobName}</p>
                  <p className="text-xs text-muted-foreground">{job.date}</p>
                </div>
                {type === 'Sucesso' && job.warnings > 0 && (
                  <Badge variant="outline" className="ml-2 text-xs bg-warning-soft text-warning border-warning/20">
                    {job.warnings} avisos
                  </Badge>
                )}
                {type === 'Falha' && (
                  <Badge variant="outline" className="ml-2 text-xs bg-destructive-soft text-destructive border-destructive/20">
                    {job.errors} erros
                  </Badge>
                )}
                {type === 'Aviso' && (
                  <Badge variant="outline" className="ml-2 text-xs bg-warning-soft text-warning border-warning/20">
                    {job.warnings} avisos
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <JobList 
        jobs={successJobs}
        type="Sucesso"
        icon={<CheckCircle className="h-4 w-4 text-success" />}
        badgeClass="bg-success-soft text-success border-success/20"
      />
      
      <JobList 
        jobs={failedJobs}
        type="Falha"
        icon={<XCircle className="h-4 w-4 text-destructive" />}
        badgeClass="bg-destructive-soft text-destructive border-destructive/20"
      />
      
      <JobList 
        jobs={warningJobs}
        type="Aviso"
        icon={<AlertTriangle className="h-4 w-4 text-warning" />}
        badgeClass="bg-warning-soft text-warning border-warning/20"
      />

      <JobList 
        jobs={noFilesJobs}
        type="Sem Novos Arquivos"
        icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
        badgeClass="bg-muted text-muted-foreground border-muted/20"
      />

      <JobList 
        jobs={incrementalJobs}
        type="Incremental"
        icon={<CheckCircle className="h-4 w-4 text-blue-500" />}
        badgeClass="bg-blue-50 text-blue-600 border-blue-200"
      />
    </div>
  );
};

export default JobStatusLists;