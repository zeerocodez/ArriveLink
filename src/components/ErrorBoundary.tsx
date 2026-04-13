import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends (React.Component as any) {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      
      let errorMessage = this.state.error?.message || "An unexpected error occurred.";
      let isFirestoreError = false;
      
      try {
        const parsed = JSON.parse(errorMessage);
        if (parsed.error && parsed.operationType) {
          errorMessage = `Firestore Error: ${parsed.error} (${parsed.operationType} on ${parsed.path})`;
          isFirestoreError = true;
        }
      } catch (e) {
        // Not a JSON error
      }
      
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-12 text-center glass rounded-[2.5rem] border border-white/10 shadow-mockup">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-8 shadow-cta">
            <AlertTriangle className="text-red-500" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Something went wrong</h2>
          <p className="text-slate max-w-md mb-10 text-lg leading-relaxed">
            We encountered an error. This might be due to a connection issue or a temporary glitch.
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-3 bg-gradient-accent text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-all shadow-cta"
          >
            <RefreshCw size={20} /> Reload Section
          </button>
          
          <div className="mt-12 w-full max-w-lg">
            <div className="text-[10px] uppercase tracking-widest text-slate font-bold mb-3">Error Details</div>
            <pre className="p-6 bg-black/40 rounded-2xl border border-white/5 text-left text-[12px] text-red-400/80 overflow-auto font-mono leading-relaxed">
              {errorMessage}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
