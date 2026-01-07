import { Response, Meta } from './Response'

export class DynamoResponse<T = any> extends Response<T> {
    readonly destination = 'DynamoDB';
    readonly metadata: any
    protected readonly data: any

    constructor(
        success: boolean,
        data?: T,
        metadata: Meta = {},
        message?: string
    ) {
        super(success, data, metadata, message ?? 'DynamoDB Response');
    }
}
