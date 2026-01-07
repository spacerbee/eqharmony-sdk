export type Meta = Record<string, any>;

export class Response<T = any> {
    readonly success: boolean
    readonly message?: string
    readonly metadata: any
    protected readonly data?: any

    constructor(
        success: boolean,
        data?: any,
        metadata?: any,
        message?: string
    ) {
        this.success = success;
        this.data = data;
        this.metadata = metadata;
        this.message = message;
    }

    public getData(): any {
        return this.data
    }

    public getMessage(): string | undefined {
        return this.message
    }

    public getMetadata(): any {
        return this.metadata
    }

    public isSuccess(): boolean {
        return this.success
    }

    getStatusCode(): number {
        if (this.success) return 200;
        return 500;
    }


}