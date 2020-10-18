import * as http from 'http'
import { DecodedUser } from '@src/services/auth'

/*
typescript module augmentation: extending the Request interface from express
and adding the DecodedUser property
 */
declare module 'express-serve-static-core' {
  export interface Request extends http.IncomingMessage, Express.Request {
    decoded?: DecodedUser
  }
}
