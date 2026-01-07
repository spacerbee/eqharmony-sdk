import { Config } from '@eqharmony/core-config'

import { Data } from './Data'
import { IEvent } from '../Interface/IEvent'

export class Event extends Data<IEvent, any> {

    constructor(
        config: Config,
        rawEvent: any
    ) {
        super(config, rawEvent)
    }

    // Define Event DTO
    protected setData(): IEvent {
        try {
            return {
                type: this.setType(),
                origin: this.setOrigin(),
                body: this.setBody(this.dataInput),
                timestamp: new Date().toISOString(),
            }
        } catch (error) {
            throw new Error(`Failed to set data: ${error}`)
        }
    }

    // Origin = '/write', 'arn:aws:sns:us-east-1:123456789012:my-topic'
    protected setOrigin(): string {
        const event = this.dataInput

        // API Gateway - extract path
        if (event.body && event.requestContext) {
            let path = event.requestContext.http?.path || event.rawPath || event.path

            // Strip stage prefix (e.g. /dev/leads -> /leads, /staging/leads -> /leads)
            if (path) {
                const parts = path.split('/')
                // If path has format like /{stage}/{resource}, strip the stage
                if (parts.length >= 3 && parts[0] === '' && parts[2]) {
                    // Remove the stage (index 1) and rebuild path
                    path = '/' + parts.slice(2).join('/')

                }
            }

            return path
        }

        // SNS - extract topic ARN
        if (event.Records && event.Records[0]?.Sns) {
            return event.Records[0].Sns.TopicArn
        }

        // SQS - extract queue URL
        if (event.Records && event.Records[0]?.eventSource === 'aws:sqs') {
            return event.Records[0].eventSourceARN
        }

        // DynamoDB - extract table name
        if (event.Records && event.Records[0]?.dynamodb) {
            return event.Records[0].eventSourceARN?.split('/').pop()
        }

        // EventBridge - extract detail-type
        if (event.detail) {
            return event['detail-type']
        }

        // CloudWatch Events - extract detail-type
        if (event.source && event['detail-type']) {
            return event['detail-type']
        }

        // Lambda direct invocation - extract function name from context if available
        if (typeof event === 'object' && !event.Records && !event.body && !event.detail) {
            return 'direct-invocation'
        }

        return 'unknown'
    }

    // Type = 'sns', 'api-gateway', 'dynamodb', 'sqs', 'eventbridge', 'cloudwatch-events', 'lambda-direct'
    protected setType(): string {
        const event = this.dataInput

        if (event.body && event.requestContext) return 'api-gateway'
        if (event.Records && Array.isArray(event.Records)) {
            if (event.Records[0]?.Sns) return 'sns'
            if (event.Records[0]?.dynamodb) return 'dynamodb'
            return 'sqs'
        }
        if (event.detail) return 'eventbridge'
        if (event.source && event['detail-type']) return 'cloudwatch-events'
        if (typeof event === 'object' && !event.Records && !event.body && !event.detail) return 'lambda-direct'

        return 'unknown'
    }

    // Body = sns message body, api gateway event body, etc.
    private setBody(
        dataInput: any
    ) {
        const event = this.dataInput

        // API Gateway events (HTTP API v2.0)
        if (event.body && event.requestContext) {
            try {
                return JSON.parse(event.body)
            } catch (error) {
                throw new Error(`Failed to parse API Gateway event body: ${error}`)
            }
        }

        // SQS events
        if (event.Records && Array.isArray(event.Records)) {
            const records = event.Records.map((record: any) => {
                try {
                    return JSON.parse(record.body)
                } catch (error) {
                    throw new Error(`Failed to parse SQS record body: ${error}`)
                }
            })
            return {
                data: records.length === 1 ? records[0] : records
            }
        }

        // SNS events
        if (event.Records && event.Records[0]?.Sns) {
            try {
                return {
                    data: JSON.parse(event.Records[0].Sns.Message)
                }
            } catch (error) {
                throw new Error(`Failed to parse SNS message: ${error}`)
            }
        }

        // EventBridge events
        if (event.detail) {
            return {
                data: event.detail
            }
        }

        // DynamoDB events
        if (event.Records && event.Records[0]?.dynamodb) {
            return {
                data: event.Records
            }
        }

        // Lambda direct invocation
        if (typeof event === 'object' && !event.Records && !event.body && !event.detail) {
            return {
                data: event
            }
        }

        // CloudWatch Events (legacy)
        if (event.source && event['detail-type']) {
            return {
                data: event.detail || event
            }
        }

        return new Error('Unknown event type')

    }

    public getData(): IEvent {
        return this.data
    }

    public getBody(): any {
        return this.data.body
    }

    public getType(): string {
        return this.data.type
    }

    public getOrigin(): string {
        return this.data.origin
    }

    public getTimestamp(): string {
        return this.data.timestamp
    }
}
