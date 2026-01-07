import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

export class ClientSecretsServices {
    private secretsClient: SecretsManagerClient;
    private cache: Map<string, { value: any; timestamp: number }> = new Map();
    private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    constructor(region: string = 'us-east-1') {
        this.secretsClient = new SecretsManagerClient({ region });
    }

    /**
     * Get a secret value from AWS Secrets Manager with caching
     * @param secretArn - The ARN of the secret
     * @param key - The key within the secret JSON (optional)
     * @returns The secret value
     */
    public async getSecretValue(secretArn: string, key?: string): Promise<any> {
        const cacheKey = `${secretArn}:${key || 'full'}`;

        // Check cache first
        const cached = this.cache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
            return cached.value;
        }

        try {
            const command = new GetSecretValueCommand({
                SecretId: secretArn
            });

            const response = await this.secretsClient.send(command);
            const secretData = JSON.parse(response.SecretString || '{}');

            const value = key ? secretData[key] : secretData;

            // Cache the result
            this.cache.set(cacheKey, {
                value,
                timestamp: Date.now()
            });

            return value;
        } catch (error) {
            console.error(`Failed to retrieve secret ${secretArn}:`, error);
            throw new Error(`Secret retrieval failed: ${error}`);
        }
    }

    /**
     * Get the encryption key specifically
     * @param secretArn - The ARN of the encryption key secret
     * @returns The encryption key value
     */
    public async getEncryptionKey(secretArn: string): Promise<string> {
        return await this.getSecretValue(secretArn, 'encryption_key');
    }

    /**
     * Get the email key specifically (legacy method)
     * @param secretArn - The ARN of the email key secret
     * @returns The email key value
     */
    public async getEmailKey(secretArn: string): Promise<string> {
        return await this.getSecretValue(secretArn, 'email_key');
    }

    /**
     * Clear the cache (useful for testing or when secrets are rotated)
     */
    public clearCache(): void {
        this.cache.clear();
    }
}
