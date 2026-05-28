"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
  /** Short label for which section failed (e.g. "Dashboard"). */
  section?: string;
  onReset?: () => void;
};

type ErrorBoundaryState = {
  hasError: boolean;
  message: string | null;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, message: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || "Something went wrong.",
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, message: null });
    this.props.onReset?.();
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const label = this.props.section ?? "This section";

    return (
      <div
        role="alert"
        className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-10 text-center"
      >
        <p className="text-sm font-semibold text-foreground">
          {label} could not be displayed
        </p>
        <p className="text-xs text-muted-foreground">
          {this.state.message ??
            "An unexpected error occurred. Try again or refresh the page."}
        </p>
        <button
          type="button"
          onClick={this.handleReset}
          className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    );
  }
}
