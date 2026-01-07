import { Config } from '@eqharmony/core-config'

export interface ICredentials {
    accessKeyId: string
    secretAccessKey: string
    sessionToken: string
}

export abstract class Client<ClientType = unknown> {
    protected config: Config

    constructor(config: Config) {
        this.config = config
    }

    protected getCredentials(): ICredentials {
        return {
            accessKeyId: 'test-access-key',
            secretAccessKey: 'test-secret-key',
            sessionToken: 'test-session-token'
        }
    }

    protected getRegion(): string {
        return 'us-east-1'
    }

    protected abstract createClient(): ClientType

    public abstract execute(data: any): Promise<any>
}

