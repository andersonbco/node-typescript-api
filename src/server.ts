import './util/module-alias'
import { Server } from '@overnightjs/core'
import bodyParser from 'body-parser'
import { BeachesController } from '@src/controllers/beaches'
import { ForecastController } from '@src/controllers/forecast'
import { UsersController } from '@src/controllers/users'
import { Application } from 'express'
import config from 'config'
import * as database from '@src/database'

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super()
  }

  public async init(): Promise<void> {
    this.setupExpress()
    this.setupControllers()
    console.log(config.get('App.database.mongoUrl'))
    console.log('NODE_CONFIG: ' + config.util.getEnv('NODE_CONFIG'));
    await this.databaseSetup()
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json())
  }

  private setupControllers(): void {
    const beachesController = new BeachesController()
    const forecastController = new ForecastController()
    const usersController = new UsersController()
    this.addControllers([
      beachesController,
      forecastController,
      usersController,
    ])
  }

  private async databaseSetup(): Promise<void> {
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
