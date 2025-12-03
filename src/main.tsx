import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
// Note: @github/spark import is provided by GitHub Spark runtime
// Commenting out for standalone development
// import "@github/spark/spark"

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'

import "./main.css"

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
   </ErrorBoundary>
)
