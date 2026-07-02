import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false ,errorMessage:""};
  }

  static getDerivedStateFromError(error) {
    return { hasError: true ,errorMessage:String(error) };
  }

  componentDidCatch(error, info) {

  }

  render() {
    if (this.state.hasError) {
      return (
      <div className="flex flex-col justify-center items-center  w-full">
        <h1 className="text-5xl mb-10">Something went wrong:</h1>
        <h2  className="text-4xl mb-10 text-center bg-red-200">{this.state.errorMessage}</h2>
      </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;