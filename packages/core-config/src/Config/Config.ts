export interface IConfig {
    getField(field: string): any;
    getAllFields(): any;
}

export abstract class Config implements IConfig {
    public source: string
    public config: object

    public constructor() {
        this.source = this.setSource()

        try {
            this.config = JSON.parse(this.source)
        } catch (e) {
            throw Error('Invalid Config Source')
        }
    }

    public getField(
        field: string
    ): any {
        // Check environment variables first
        const envValue = process.env[field]
        if (envValue !== undefined) {
            console.log(`Config: Using environment variable ${field} = ${envValue}`)
            return envValue
        }

        // Fallback to config file
        const configValue = (this.config as any)[field]
        if (configValue !== undefined) {
            console.log(`Config: Using config file value ${field} = ${configValue}`)
            return configValue
        }

        // Neither found
        console.error(`Config: Field '${field}' not found in environment variables or config file`)
        console.error(`Available environment variables:`, Object.keys(process.env).filter(key => key.startsWith('EQH_')))
        console.error(`Available config fields:`, Object.keys(this.config))
        throw Error('Invalid Field: ' + field)
    }

    public getAllFields(): any {
        return Object.assign(this.config, process.env)
    }

    protected abstract setSource(): string
}