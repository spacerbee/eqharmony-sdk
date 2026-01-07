import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Config } from '@eqharmony/core-config'

export class ClientDynamo {
    protected client: DynamoDBDocumentClient
    protected config: Config

    constructor(config: Config) {
        this.config = config
        this.client = this.createClient()
    }

    protected createClient(): DynamoDBDocumentClient {
        const region = this.config.getField('AWS_REGION_NAME')
        const awsCredentials = this.config.getField('AWS_CREDENTIALS')

        let credentials
        if (awsCredentials && typeof awsCredentials === 'object' && !Array.isArray(awsCredentials) && awsCredentials.accessKeyId) {
            credentials = awsCredentials
        } else {
            const accessKeyId = this.config.getField('AWS_ACCESS_KEY_ID')
            const secretAccessKey = this.config.getField('AWS_SECRET_ACCESS_KEY')
            const sessionToken = this.config.getField('AWS_SESSION_TOKEN')

            if (accessKeyId && secretAccessKey && accessKeyId !== 'test-value' && secretAccessKey !== 'test-value') {
                credentials = {
                    accessKeyId,
                    secretAccessKey,
                    ...(sessionToken && sessionToken !== 'test-value' && { sessionToken })
                }
            }
        }

        const clientConfig: any = { region }
        if (credentials) {
            clientConfig.credentials = credentials
        }

        return DynamoDBDocumentClient.from(new DynamoDBClient(clientConfig))
    }

    public execute(data: any): Promise<any> {
        return this.client.send(new PutCommand(data))
    }
}


