export class ClientSecretsServices {
    constructor(region: string = 'us-east-1') {
    }

    async getSecretValue(secretArn: string, key?: string): Promise<any> {
        return Promise.resolve(undefined);
    }

    async getEncryptionKey(secretArn: string): Promise<string> {
        return Promise.resolve('');
    }

    async getEmailKey(secretArn: string): Promise<string> {
        return Promise.resolve('');
    }

    clearCache(): void {
    }
}

