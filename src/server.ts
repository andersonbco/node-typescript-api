import './util/module-alias'
import { Server } from '@overnightjs/core'
import bodyParser from 'body-parser'
import { BeachesController } from '@src/controllers/beaches'
import { ForecastController } from '@src/controllers/forecast'
import { Application } from 'express'
import * as database from '@src/database'

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super()
  }

  public async init(): Promise<void> {
    this.setupExpress()
    this.setupControllers()
    await SetupServer.databaseSetup()
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json())
  }

  private setupControllers(): void {
    const beachesController = new BeachesController()
    const forecastController = new ForecastController()
    this.addControllers([beachesController, forecastController])
  }

  private static async databaseSetup(): Promise<void> {
    await database.connect()
  }

  public async close(): Promise<void> {
    await database.close()
  }

  public getApp(): Application {
    return this.app
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.info('Server listening on port: ', this.port)
    })
  }
}
