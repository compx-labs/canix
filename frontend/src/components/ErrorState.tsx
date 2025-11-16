interface ErrorStateProps {
  error?: Error | null;
}

export default function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-graphite flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <div className="text-crimson text-6xl mb-4">⚠️</div>
        <h2 className="text-silver text-2xl font-bold mb-2">Unable to Load Data</h2>
        <p className="text-silver/70 mb-4">
          {error?.message || 'Failed to fetch yield opportunities. Please check if the API server is running.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-crimson hover:bg-crimson-dark text-white px-6 py-2 text-sm font-semibold transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

