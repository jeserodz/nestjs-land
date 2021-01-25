export class ConfigProvider {
  constructor(config: ConfigProvider) {
    process.env.NESTJS_STORAGE_ENDPOINT = config.endpoint;
    process.env.NESTJS_STORAGE_BUCKET = config.bucket;

    {
      Object.assign(this, config);
    }
  }

  endpoint: string;
  bucket: string;
  region: string;
  accessKey: string;
  secretKey: string;
}
