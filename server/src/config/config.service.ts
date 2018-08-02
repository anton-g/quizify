import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import * as fs from 'fs';

export interface EnvConfig {
  [prop: string]: string;
}

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(config);
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid(['development', 'production'])
        .default('development'),
      SPOTIFY_CLIENT_ID: Joi.string().required(),
      SPOTIFY_CLIENT_SECRET: Joi.string().required(),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envVarsSchema,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  get nodeEnv(): string {
    return String(this.envConfig.NODE_ENV)
  }

  get spotifyClientId(): string {
    return String(this.envConfig.SPOTIFY_CLIENT_ID);
  }

  get spotifyClientSecret(): string {
    return String(this.envConfig.SPOTIFY_CLIENT_SECRET);
  }
}
