import AuthService from '@src/services/auth'
import { authMiddleware } from '@src/middlewares/auth'

describe('AuthMiddleware', () => {
  it('should verify a JWT token and call the next middleware', async () => {
    const jwtToken = AuthService.generateToken({ data: 'fake' })
    const reqFake = {
      headers: {
        'x-access-token': jwtToken,
      },
    }
    const resFake = {}
    const nextFake = jest.fn()
    authMiddleware(reqFake, resFake, nextFake)
    expect(nextFake).toHaveBeenCalled()
  })

  it('should return UNAUTHORIZED if there is a problema on the token verification', async () => {
    const reqFake = {
      headers: {
        'x-access-token': 'invalid token',
      },
    }
    const sendMock = jest.fn()
    const resFake = {
      status: jest.fn(() => ({
        send: sendMock,
      })),
    }
    const nextFake = jest.fn()
    authMiddleware(reqFake, resFake as object, nextFake)
    expect(resFake.status).toHaveBeenCalledWith(401)
    expect(sendMock).toHaveBeenCalledWith({
      code: 401,
      error: 'jwt malformed',
    })
  })

  it('should return UNAUTHORIZED middleware if there is no token', async () => {
    const reqFake = {
      headers: {},
    }
    const sendMock = jest.fn()
    const resFake = {
      status: jest.fn(() => ({
        send: sendMock,
      })),
    }
    const nextFake = jest.fn()
    authMiddleware(reqFake, resFake as object, nextFake)
    expect(resFake.status).toHaveBeenCalledWith(401)
    expect(sendMock).toHaveBeenCalledWith({
      code: 401,
      error: 'jwt must be provided',
    })
  })
})
