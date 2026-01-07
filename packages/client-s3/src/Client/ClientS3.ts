import { Client } from '@eqharmony/core-aws'
import { Config } from '@eqharmony/core-config'
import { S3Client } from '@aws-sdk/client-s3'
import { PutObjectCommand } from '@aws-sdk/client-s3'

export class ClientS3 extends Client {
    protected client: S3Client

    constructor(
        config: Config
    ) {
        super(config)
        this.client = this.createClient()
    }

    protected createClient(): S3Client {
        return new S3Client({
            region: this.config.getField('AWS_REGION_NAME'),
            credentials: this.getCredentials()
        }) as S3Client
    }

    public execute(data: any): Promise<any> {
        return this.client.send(new PutObjectCommand(data))
    }
}