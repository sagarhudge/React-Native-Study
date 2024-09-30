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

