import { Config } from '@eqharmony/core-config'

export interface ICredentials {
    accessKeyId: string
    secretAccessKey: string
    sessionToken: string
}

export abstract class Client<ClientType = unknown> {
    protected config: Config

    constructor(
        config: Config
    ) {
        this.config = config
    }

    protected getCredentials(): ICredentials {
        if (!this.config.getField('AWS_ACCESS_KEY_ID')) {
            throw new Error('Error: AWS_ACCESS_KEY_ID not configured!')
        }

        if (!this.config.getField('AWS_SECRET_ACCESS_KEY')) {
            throw new Error('Error: AWS_SECRET_ACCESS_KEY not configured!')
        }

        return {
            accessKeyId: this.config.getField('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.config.getField('AWS_SECRET_ACCESS_KEY'),
            sessionToken: this.config.getField('AWS_SESSION_TOKEN')
        }
    }

    protected getRegion(): string {
        return this.config.getField('AWS_REGION_NAME')
    }

    protected abstract createClient(): ClientType

    public abstract execute(data: any): Promise<any>
}