import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

import { Client } from '@eqharmony/core-aws'
import { Config } from '@eqharmony/core-config'


export class ClientDynamo extends Client {
    protected client: DynamoDBDocumentClient

    constructor(
        config: Config
    ) {
        super(config)
        this.client = this.createClient()
    }

    protected createClient(): DynamoDBDocumentClient {
        return DynamoDBDocumentClient.from(new DynamoDBClient({
            region: this.config.getField('AWS_REGION_NAME'),
            credentials: this.config.getField('AWS_CREDENTIALS')
        }))
    }

    public execute(data: any): Promise<any> {
        return this.client.send(new PutCommand(data))
    }
}