import React from 'react';

interface ErrorBoundaryProps{

}

export default class ErrorBoundary extends React.Component {
    constructor(props: ErrorBoundaryProps) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error: any) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error: any, errorInfo: any) {
      // You can also log the error to an error reporting service
      console.error(error + errorInfo);
    }
  
    render() {
      if ((this.state as any).hasError) {
        // You can render any custom fallback UI
        return <h1>Something went wrong. Please contact the website admin github.com/Sheldonfrith.</h1>;
      }
  
      return this.props.children; 
    }
  }