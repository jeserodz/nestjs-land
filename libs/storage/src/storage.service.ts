import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import Minio = require('minio');
import FileType = require('file-type');
import UUID = require('uuid');
import { ConfigProvider } from './providers/config.provider';
import { File } from './entities/files.entity';

@Injectable()
export class StorageService {
  endpoint: string;
  bucket: string;
  minioClient: Minio.Client;

  constructor(
    @Inject(ConfigProvider) private readonly config: ConfigProvider,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    this.endpoint = config.endpoint;
    this.bucket = config.bucket;
    this.minioClient = new Minio.Client({
      endPoint: this.endpoint,
      useSSL: true,
      region: config.region,
      accessKey: config.accessKey,
      secretKey: config.secretKey,
    });
  }

  async listFiles() {
    return new Promise<Minio.BucketItem[]>((resolve, reject) => {
      const files = [] as Minio.BucketItem[];
      const stream = this.minioClient.listObjects(this.bucket);
      stream.on('data', (item) => files.push(item));
      stream.on('error', (error) => reject(error));
      stream.on('end', () => resolve(files));
    });
  }

  async saveFile(buffer: Buffer) {
    const { ext, mime } = await FileType.fromBuffer(buffer);
    const key = `${UUID.v4()}.${ext}`;
    const metadata = { 'Content-Type': mime };

    await this.minioClient.putObject(this.bucket, key, buffer, metadata);

    const file = new File();
    file.key = key;
    file.mimeType = mime;

    await this.entityManager.save(File, file);

    return file;
  }

  async saveFiles(buffers: Buffer[]) {
    const results = [] as File[];

    for (const buffer of buffers) {
      const file = await this.saveFile(buffer);
      results.push(file);
    }

    return results;
  }

  async deleteFile(file: File) {
    await this.minioClient.removeObject(this.bucket, file.key);
    await this.entityManager.remove(file);
  }

  async deleteFiles(files: File[]) {
    for (const file of files) {
      await this.deleteFile(file);
    }
  }

  async getFileStats(file: File) {
    return this.minioClient.statObject(this.bucket, file.key);
  }
}
