export interface LogEntry {
  jobName: string;
  date: string;
  status: 'success' | 'failed' | 'warning' | 'no-files' | 'incremental';
  errors: number;
  warnings: number;
  details?: string;
}

export const processLogFile = async (file: File): Promise<LogEntry> => {
  const content = await file.text();
  const jobName = `Chem${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;
  
  let status: 'success' | 'failed' | 'warning' | 'no-files' | 'incremental' = 'success';
  let errors = 0;
  let warnings = 0;
  let details = '';

  // Analisa o conteúdo do arquivo para determinar o status
  if (content.includes("Finalizing backup...") && 
      content.includes("Nothing to backup! All files were skipped.") && 
      content.includes("Archive is not created.")) {
    status = 'no-files';
    details = `Job ${jobName}: Nenhum arquivo novo para backup. Todos os arquivos foram ignorados.`;
  } else if (content.includes("[ZIP] File created")) {
    status = 'success';
    details = `Job ${jobName}: Backup executado com sucesso. Arquivo ZIP criado.`;
  } else if (content.includes("Incremental")) {
    status = 'incremental';
    details = `Job ${jobName}: Backup incremental executado.`;
  } else {
    // Lógica padrão baseada em randomização para outros casos
    const randomStatus = Math.random();
    if (randomStatus < 0.4) {
      status = 'success';
      warnings = Math.floor(Math.random() * 3);
      details = `Job ${jobName}: Backup executado com sucesso.`;
    } else if (randomStatus < 0.7) {
      status = 'warning';
      warnings = Math.floor(Math.random() * 5) + 1;
      details = `Job ${jobName}: Backup concluído com avisos.`;
    } else {
      status = 'failed';
      errors = Math.floor(Math.random() * 3) + 1;
      details = `Job ${jobName}: Falha detectada durante o backup.`;
    }
  }

  return {
    jobName,
    date: new Date().toLocaleString('pt-BR'),
    status,
    errors,
    warnings,
    details
  };
};

export const generateMockData = async (files: File[]): Promise<LogEntry[]> => {
  const mockEntries: LogEntry[] = [
    {
      jobName: "Chem001",
      date: "2024-01-15 02:30:15",
      status: "success",
      errors: 0,
      warnings: 1,
      details: "Job Chem001: Backup executado com sucesso. Arquivo ZIP criado."
    },
    {
      jobName: "Chem002",
      date: "2024-01-14 01:45:22",
      status: "failed",
      errors: 3,
      warnings: 0,
      details: "Job Chem002: Falha detectada durante o backup."
    },
    {
      jobName: "Chem003",
      date: "2024-01-14 00:15:10",
      status: "no-files",
      errors: 0,
      warnings: 0,
      details: "Job Chem003: Nenhum arquivo novo para backup. Todos os arquivos foram ignorados."
    },
    {
      jobName: "Chem004",
      date: "2024-01-13 23:30:45",
      status: "incremental",
      errors: 0,
      warnings: 0,
      details: "Job Chem004: Backup incremental executado."
    },
    {
      jobName: "Chem005",
      date: "2024-01-13 20:15:30",
      status: "success",
      errors: 0,
      warnings: 3,
      details: "Job Chem005: Backup executado com sucesso. Arquivo ZIP criado."
    }
  ];

  // Processa os arquivos carregados
  const processedEntries = await Promise.all(files.map(processLogFile));
  
  return [...processedEntries, ...mockEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const calculateStats = (data: LogEntry[]) => {
  return {
    total: data.length,
    success: data.filter(entry => entry.status === 'success').length,
    failed: data.filter(entry => entry.status === 'failed').length,
    warnings: data.filter(entry => entry.status === 'warning').length,
    noFiles: data.filter(entry => entry.status === 'no-files').length,
    incremental: data.filter(entry => entry.status === 'incremental').length,
  };
};