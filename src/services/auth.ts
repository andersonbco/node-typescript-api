import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config, { IConfig } from 'config'

export default class AuthService {
  public static async hashPassword(
    password: string,
    salt = 10
  ): Promise<string> {
    return await bcrypt.hash(password, salt)
  }

  public static async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
  }

  public static generateToken(payload: object): string {
    const authConfig: IConfig = config.get('App.auth')
    return jwt.sign(payload, authConfig.get('key'), {
      expiresIn: authConfig.get('tokenExpiresIn'),
    })
  }
}
