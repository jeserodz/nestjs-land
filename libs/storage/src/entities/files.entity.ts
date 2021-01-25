import { Column, Entity, PrimaryGeneratedColumn, AfterLoad } from 'typeorm';
import urlParse = require('url-parse-lax');

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  key: string;

  @Column({ nullable: false })
  mimeType: string;

  url: string;

  @AfterLoad()
  setUrl() {
    const url = urlParse(process.env.NESTJS_STORAGE_ENDPOINT);
    this.url = `${url.href}${process.env.NESTJS_STORAGE_BUCKET}/${this.key}`;
  }
}
