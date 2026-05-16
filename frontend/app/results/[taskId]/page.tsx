import ResultsDisplay from "@/components/ResultsDisplay";

type ResultsPageProps = {
  params: {
    taskId: string;
  };
};

export default function ResultsPage({ params }: ResultsPageProps) {
  return <ResultsDisplay taskId={params.taskId} />;
}
