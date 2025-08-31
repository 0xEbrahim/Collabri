import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class BcryptService {
  private saltOrRounds: number;
  constructor(private cfg: ConfigService) {
    this.saltOrRounds = parseInt(
      this.cfg.get<string>('BCRYPT_SALT_ROUNDS')!,
      10,
    );
  }

  async hash(password: string): Promise<any> {
    return await bcrypt.hash(password, this.saltOrRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
