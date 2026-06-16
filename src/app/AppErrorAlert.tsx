import {Alert} from "react-bootstrap";
import type {FallbackProps} from "react-error-boundary";

export default function AppErrorAlert({error, resetErrorBoundary}: FallbackProps) {
    const resetHandler = () => {
        if (resetErrorBoundary) {
            resetErrorBoundary();
        }
    }
    if (!(error instanceof Error)) {
        return (
            <Alert variant="danger" onClose={resetHandler} dismissible>Error: an unknown error occurred.</Alert>
        )
    }
    return (
        <Alert variant="danger" onClose={resetHandler} dismissible>
            <Alert.Heading>Something went wrong!</Alert.Heading>
            <pre>{error.message}</pre>
            {error.stack && (
                <code>
                    <pre>{error.stack}</pre>
                </code>
            )}
        </Alert>
    )
}
