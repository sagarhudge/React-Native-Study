Here's a complete blog on React Native Error Boundaries with TypeScript using functional components, including the purpose, various error boundary types, and practical examples:


---

Title: Mastering Error Boundaries in React Native with TypeScript: Functional Components and Best Practices

Introduction:

Error boundaries in React Native play a crucial role in enhancing app stability and user experience. By handling JavaScript errors locally and displaying fallback UIs when things go wrong, error boundaries prevent crashes from propagating across the app. In this blog, we will explore how to implement error boundaries using functional components with TypeScript and provide various strategies, including feature-level, server-side, and partial error handling, to make your app more resilient.


---

Purpose of Error Boundaries in React Native

The purpose of error boundaries is to protect the user experience by preventing app crashes from unhandled JavaScript errors. These errors can arise from various factors like network failures, database issues, or invalid states in the app. Error boundaries help localize errors, preventing them from cascading across the entire app.

Key Objectives:

1. User Experience Protection: Isolates errors to prevent complete app crashes, displaying a fallback UI instead.


2. Resilience: Ensures that different features or components can fail without affecting the entire app.


3. Error Logging: Allows developers to catch and log errors for debugging and analytics.


4. Graceful Error Handling: Ensures that users see meaningful error messages rather than an app crash or unresponsive screen.




---

Section 1: What Are Error Boundaries?

Error boundaries in React are designed to catch JavaScript errors anywhere in the child component tree and display a fallback UI. In React Native, they are particularly useful for isolating errors that could crash the whole app.

However, error boundaries do not catch errors for:

Event handlers

Asynchronous code (e.g., setTimeout, fetch)

Server-side rendering

Errors thrown inside the error boundary itself



---

Section 2: Implementing Error Boundaries in Functional Components with TypeScript

In React 16.8+, we can utilize hooks to create functional component versions of error boundaries.

Step 1: Creating an ErrorBoundary Component with Hooks

Here’s a functional version of an error boundary using the useState and useEffect hooks.

import React, { ReactNode, useState, useEffect } from 'react';
import { Text, View, Button } from 'react-native';

interface ErrorBoundaryProps {
  children: ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error: Error, errorInfo: any) => {
      // Handle or log error
      console.error('Error caught by ErrorBoundary: ', error, errorInfo);
      setHasError(true);
    };

    // Set error boundary globally for this component
    window.onerror = errorHandler;

    // Cleanup on component unmount
    return () => {
      window.onerror = null;
    };
  }, []);

  const resetErrorBoundary = () => {
    setHasError(false);
  };

  if (hasError) {
    return (
      <View>
        <Text>Something went wrong. Please try again.</Text>
        <Button title="Retry" onPress={resetErrorBoundary} />
      </View>
    );
  }

  return <>{children}</>;
};

export default ErrorBoundary;

Step 2: Wrapping Components with Error Boundary

Wrap your components inside the ErrorBoundary so that any errors will be caught and displayed as a fallback UI:

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
};


---

Section 3: Advanced Error Boundaries: Feature, Server-Side, and Partial Error Handling

To improve error handling further, you can implement feature-level, server-side, and partial error boundaries that focus on specific areas of your app.

1. Feature-Level Error Boundaries

Feature-level error boundaries allow you to isolate errors within specific app features, such as authentication or payments.

const FeatureErrorBoundary: React.FC = () => {
  return (
    <ErrorBoundary>
      <PaymentComponent />
    </ErrorBoundary>
  );
};

Here, any error within PaymentComponent will not affect other parts of the app, keeping the user experience intact.

2. Server-Side Error Boundaries

Server-side error boundaries handle issues like failed API calls or server timeouts. These boundaries ensure that if the backend service fails, users receive feedback without crashing the app.

const ServerErrorBoundary: React.FC = ({ children }) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://api.example.com/data');
        if (!response.ok) throw new Error('API error');
      } catch (err) {
        setError(err.message);
      }
    }

    fetchData();
  }, []);

  if (error) {
    return <Text>Server error: {error}</Text>;
  }

  return <>{children}</>;
};

3. Partial Error Boundaries

Partial error boundaries are useful when you need to isolate errors in small sections of the UI, like individual widgets or dashboards.

const Dashboard: React.FC = () => {
  return (
    <View>
      <ErrorBoundary>
        <Widget1 />
      </ErrorBoundary>
      <ErrorBoundary>
        <Widget2 />
      </ErrorBoundary>
    </View>
  );
};

This ensures that if one widget fails, the rest of the dashboard remains functional.


---

Section 4: Enhancing Error Boundaries for Asynchronous Operations

When dealing with async operations like API calls or database access, you can enhance your error boundaries with hooks and state management.

Handling API Errors

const ApiErrorBoundary: React.FC = ({ children }) => {
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.example.com/data');
        if (!response.ok) throw new Error('API Error');
      } catch (error) {
        setApiError(error.message);
      }
    };

    fetchData();
  }, []);

  if (apiError) {
    return <Text>Failed to load data. Try again later.</Text>;
  }

  return <>{children}</>;
};

Handling Database Errors

const DatabaseErrorBoundary: React.FC = ({ children }) => {
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Database operations
    } catch (error) {
      setDbError("Database Error: " + error.message);
    }
  }, []);

  if (dbError) {
    return <Text>{dbError}</Text>;
  }

  return <>{children}</>;
};


---

Section 5: Benefits of Combining Different Error Boundaries

By combining multiple error boundaries (feature-level, server-side, partial, async), you can ensure that:

Localized error handling: Errors in one part of the app don’t affect others.

Better user experience: Show specific error messages for different failures.

Robust logging: Log errors effectively for debugging.

Improved resilience: Keep the app functional even in cases of isolated failures.



---

Conclusion:

By using functional components and hooks in React Native with TypeScript, error boundaries can be implemented to catch and handle errors efficiently. Combining different types of error boundaries—feature-level, server-side, and partial—ensures that your app is resilient, user-friendly, and less prone to crashes. With the additional use of async error handling, you can build a robust system that protects the app and its users from unexpected failures.


---

This complete blog covers the essential concepts and advanced practices for implementing error boundaries in React Native, focusing on improving user experience and app stability using functional components and TypeScript.



To take error handling in React Native to the next level with typed custom hooks, context API, and reusable fallback components, here's how you can structure it in your blog. We'll use TypeScript to make the error boundaries strongly typed, build custom hooks for easier error handling, and utilize the Context API for managing error states globally.

Updated Section: Typed Custom Hooks, Context API, and Reusable Fallbacks in Error Boundaries


---

Section 6: Typed Custom Hooks, Context API, and Reusable Fallback Components

In this section, we'll implement typed custom hooks to manage errors, leverage the Context API to share the error state across components, and create a reusable fallback component that can be styled and customized easily for different parts of the app.

Step 1: Creating a Reusable Fallback Component

We’ll start by building a reusable FallbackComponent that displays an error message and a retry button.

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface FallbackProps {
  error: string;
  onRetry: () => void;
}

const FallbackComponent: React.FC<FallbackProps> = ({ error, onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>Error: {error}</Text>
      <Button title="Retry" onPress={onRetry} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    marginBottom: 10,
  },
});

export default FallbackComponent;

Step 2: Creating a Custom Hook for Error Handling

Next, we’ll create a typed custom hook that manages the error state. This will abstract the error-handling logic from the components, making it easier to reuse.

import { useState } from 'react';

export const useErrorHandler = () => {
  const [error, setError] = useState<string | null>(null);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const resetError = () => {
    setError(null);
  };

  return {
    error,
    handleError,
    resetError,
  };
};

Step 3: Using Context to Share Error State Across Components

Using the Context API, we can create a global error context to share the error state across multiple components.

1. Create the Error Context:



import React, { createContext, useContext, ReactNode } from 'react';
import { useErrorHandler } from './useErrorHandler';

interface ErrorContextType {
  error: string | null;
  handleError: (errorMessage: string) => void;
  resetError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { error, handleError, resetError } = useErrorHandler();

  return (
    <ErrorContext.Provider value={{ error, handleError, resetError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorContext = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorContext must be used within an ErrorProvider');
  }
  return context;
};

2. Wrap the App in ErrorProvider:



In the main entry point of the app, wrap your component tree with the ErrorProvider so that the error state is globally accessible.

import React from 'react';
import { ErrorProvider } from './context/ErrorContext';
import App from './App';

const Root: React.FC = () => (
  <ErrorProvider>
    <App />
  </ErrorProvider>
);

export default Root;

Step 4: Implementing Error Boundaries with Custom Hooks and Context

Now, we can use the custom error hook and context to handle errors in a reusable manner. Each component can tap into the global error state and the reusable fallback component.

1. ErrorBoundary Component using Context:



import React from 'react';
import { useErrorContext } from './context/ErrorContext';
import FallbackComponent from './FallbackComponent';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const { error, resetError } = useErrorContext();

  if (error) {
    return <FallbackComponent error={error} onRetry={resetError} />;
  }

  return <>{children}</>;
};

export default ErrorBoundary;

2. Using ErrorBoundary in a Component:



Now, we can wrap our components in the ErrorBoundary to catch errors and display fallback UIs.

import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { useErrorContext } from './context/ErrorContext';
import ErrorBoundary from './ErrorBoundary';

const MyComponent: React.FC = () => {
  const { handleError } = useErrorContext();

  useEffect(() => {
    try {
      // Simulate an error
      throw new Error('Something went wrong in MyComponent!');
    } catch (error) {
      handleError(error.message);
    }
  }, []);

  return <Text>My Component</Text>;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
};

export default App;


---

Benefits of This Approach:

1. Reusability: By creating a FallbackComponent and using a context provider, you can handle errors in a reusable and consistent manner across your entire app.


2. Type Safety: Using TypeScript ensures that your error handling is strongly typed, catching potential issues at compile time.


3. Separation of Concerns: The error handling logic is abstracted away into a hook and context, keeping your components clean and focused on rendering UI.


4. Global Error Handling: With the ErrorContext, any part of the app can trigger and reset the error state, allowing for better control over error display and recovery.




---

Conclusion

Using custom hooks, context, and a reusable fallback component makes error boundaries in React Native more powerful and flexible. This pattern allows you to handle errors globally, make your app more resilient, and improve maintainability by abstracting error logic into reusable, typed components.


---

This updated version incorporates typed custom hooks, context management, and reusable fallback components, providing a scalable error-handling solution for React Native apps.


