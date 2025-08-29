export interface LogEntry {
  jobName: string;
  date: string;
  status: 'success' | 'failed' | 'warning';
  errors: number;
  warnings: number;
  details?: string;
}

export const generateMockData = (files: File[]): LogEntry[] => {
  const mockEntries: LogEntry[] = [
    {
      jobName: "Database_Backup_Daily",
      date: "2024-01-15 02:30:15",
      status: "success",
      errors: 0,
      warnings: 1,
      details: "Backup do banco de dados concluído com sucesso. Aviso: Alguns índices foram reconstruídos durante o processo."
    },
    {
      jobName: "Files_Backup_Weekly",
      date: "2024-01-14 01:45:22",
      status: "failed",
      errors: 3,
      warnings: 0,
      details: "Falha no backup dos arquivos. Erro: Não foi possível acessar o diretório de destino. Verificar permissões."
    },
    {
      jobName: "System_Config_Backup",
      date: "2024-01-14 00:15:10",
      status: "warning",
      errors: 0,
      warnings: 2,
      details: "Backup das configurações do sistema parcialmente concluído. Avisos: 2 arquivos de configuração não puderam ser lidos."
    },
    {
      jobName: "Log_Archive_Monthly",
      date: "2024-01-13 23:30:45",
      status: "success",
      errors: 0,
      warnings: 0,
      details: "Arquivamento de logs mensais concluído com sucesso. Todos os arquivos foram compactados e armazenados."
    },
    {
      jobName: "Application_Data_Backup",
      date: "2024-01-13 20:15:30",
      status: "success",
      errors: 0,
      warnings: 3,
      details: "Backup dos dados da aplicação concluído. Avisos: Alguns arquivos temporários foram ignorados durante o processo."
    },
    {
      jobName: "Database_Backup_Daily",
      date: "2024-01-12 02:30:18",
      status: "failed",
      errors: 1,
      warnings: 0,
      details: "Falha no backup do banco de dados. Erro: Timeout na conexão com o servidor de banco de dados."
    },
    {
      jobName: "Security_Backup_Critical",
      date: "2024-01-12 01:00:05",
      status: "success",
      errors: 0,
      warnings: 0,
      details: "Backup crítico de segurança executado com sucesso. Todos os certificados e chaves foram salvos com segurança."
    },
    {
      jobName: "User_Data_Sync",
      date: "2024-01-11 18:45:12",
      status: "warning",
      errors: 0,
      warnings: 5,
      details: "Sincronização de dados do usuário parcialmente concluída. Avisos: Alguns perfis de usuário não puderam ser sincronizados."
    }
  ];

  // Adiciona entradas baseadas nos arquivos carregados
  files.forEach((file, index) => {
    const randomStatus = Math.random();
    let status: 'success' | 'failed' | 'warning';
    let errors = 0;
    let warnings = 0;

    if (randomStatus < 0.6) {
      status = 'success';
      warnings = Math.floor(Math.random() * 3);
    } else if (randomStatus < 0.8) {
      status = 'warning';
      warnings = Math.floor(Math.random() * 5) + 1;
    } else {
      status = 'failed';
      errors = Math.floor(Math.random() * 3) + 1;
    }

    mockEntries.push({
      jobName: file.name.replace(/\.(log|txt)$/, '').replace(/[_-]/g, ' '),
      date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleString('pt-BR'),
      status,
      errors,
      warnings,
      details: `Processamento do arquivo ${file.name}. ${status === 'success' ? 'Backup executado com sucesso.' : status === 'failed' ? 'Falha detectada durante o processamento.' : 'Processamento concluído com avisos.'}`
    });
  });

  return mockEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const calculateStats = (data: LogEntry[]) => {
  return {
    total: data.length,
    success: data.filter(entry => entry.status === 'success').length,
    failed: data.filter(entry => entry.status === 'failed').length,
    warnings: data.filter(entry => entry.status === 'warning').length,
  };
};