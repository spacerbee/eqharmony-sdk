import { RetryableError } from './RetryableError'

interface ErrorDetails {
    error: any
    status: number
    retryable?: boolean
    metadata?: Record<string, any>
}

export class ErrorHandler {
    public static handleError(error: Error, metadata?: Record<string, any>): void {
        const errorDetails: ErrorDetails = {
            error,
            status: (error as any)?.status,
            retryable: ErrorHandler.isRetryable(error),
            metadata
        }
        const anyError = error as any
        const statusCode: number = anyError?.status || anyError?.response?.status
        const logType = statusCode && statusCode >= 500 ? 'critical' : 'error'
        if (errorDetails.retryable) {
            console.error('Retryable Error:', errorDetails)
        } else { // if it cannot be retried, just log the error
            // Return a Response with success: false where error is caught
            console.error('Non-Retryable Error:', errorDetails)
        }

    }

    public static isRetryable(error: Error): boolean {
        if (!error || typeof error !== 'object') {
            return false
        }

        if (error instanceof RetryableError) {
            return true
        }

        // Additional detection logic for retryable errors
        const anyError = error as any
        const statusCode: number = anyError.response?.status || anyError.status

        // Retryable status codes
        if (statusCode && (statusCode >= 500 || statusCode === 429)) {
            return true
        }

        const message: string = anyError?.message || ''
        return message.includes('ECONNRESET') || message.includes('ETIMEDOUT')
    }
}
