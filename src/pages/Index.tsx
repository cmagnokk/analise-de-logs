import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import StatsCards from "@/components/StatsCards";
import Charts from "@/components/Charts";
import ResultsTable from "@/components/ResultsTable";
import JobStatusLists from "@/components/JobStatusLists";
import { generateMockData, calculateStats, LogEntry } from "@/utils/mockData";

const Index = () => {
  const [logData, setLogData] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesUploaded = async (files: File[]) => {
    setIsProcessing(true);
    
    toast({
      title: "Processando arquivos...",
      description: "Analisando logs de backup, por favor aguarde.",
    });
    
    try {
      // Processa os arquivos reais
      const newData = await generateMockData(files);
      setLogData(prev => [...newData, ...prev]);
      
      toast({
        title: "Arquivos processados com sucesso!",
        description: `${files.length} arquivo(s) analisado(s) e ${newData.length} entrada(s) de log processada(s).`,
      });
    } catch (error) {
      toast({
        title: "Erro ao processar arquivos",
        description: "Ocorreu um erro durante o processamento dos logs.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const stats = calculateStats(logData);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Análise Inteligente de Logs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Carregue seus arquivos de log de backup e obtenha insights detalhados sobre 
            o status dos jobs, identificando sucessos, falhas e avisos de forma visual e organizada.
          </p>
        </div>

        <FileUpload onFilesUploaded={handleFilesUploaded} />

        {isProcessing && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
              Processando arquivos...
            </div>
          </div>
        )}

        {logData.length > 0 && (
          <>
            <StatsCards stats={stats} />
            <JobStatusLists data={logData} />
            <Charts data={logData} />
            <ResultsTable data={logData} />
          </>
        )}

        {logData.length === 0 && !isProcessing && (
          <div className="text-center py-16">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted/50">
              <svg
                className="h-10 w-10 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nenhum arquivo carregado
            </h3>
            <p className="text-muted-foreground">
              Carregue seus arquivos de log para começar a análise
            </p>
          </div>
        )}
      </main>
      
      <Toaster />
    </div>
  );
};

export default Index;
