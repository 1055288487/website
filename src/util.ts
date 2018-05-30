import * as crypto from 'crypto';
export default class {

  public static uuid(len: number = 32): string {
    return crypto.randomBytes(len / 2).toString('hex');
  }

}