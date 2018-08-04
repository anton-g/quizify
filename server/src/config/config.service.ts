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
      SPOTIFY_REDIRECT_URI: Joi.string().required(),
      SPOTIFY_SCOPE: Joi.string().required(),
      JWT_SECRET: Joi.string().required(),
      JWT_EXPIRES_IN: Joi.number()
        .default(3600)
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

  get spotifyRedirectUri(): string {
    return String(this.envConfig.SPOTIFY_REDIRECT_URI);
  }

  get spotifyScope(): string {
    return String(this.envConfig.SPOTIFY_SCOPE);
  }

  get jwtSecret(): string {
    return String(this.envConfig.JWT_SECRET);
  }

  get jwtExpiresIn(): number {
    return Number(this.envConfig.JWT_EXPIRES_IN)
  }
}