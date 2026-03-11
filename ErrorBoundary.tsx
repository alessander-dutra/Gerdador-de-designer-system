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

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Atualiza o state para que a próxima renderização mostre a UI alternativa.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-slate-200 animate-fade-in-up">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Ops! Algo deu errado.</h1>
            <p className="text-slate-500 mb-6">
              A aplicação encontrou um erro inesperado. Tente recarregar a página para continuar.
            </p>
            
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              Recarregar Aplicação
            </button>

            {this.state.error && (
              <details className="mt-8 text-left bg-slate-50 p-4 rounded-lg border border-slate-100 group">
                <summary className="text-xs font-bold text-slate-400 cursor-pointer hover:text-slate-600 uppercase tracking-wider mb-2 flex items-center justify-between">
                  Detalhes do Erro
                  <span className="text-[10px] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <pre className="text-xs text-slate-600 font-mono overflow-auto whitespace-pre-wrap break-words max-h-40 custom-scrollbar">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;