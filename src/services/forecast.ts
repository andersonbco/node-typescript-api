import { ForecastPoint, StormGlass } from '@src/clients/stormGlass'
import { InternalError } from '@src/util/errors/internal-error'
import { Beach } from '@src/models/beach'

// Merge the Beach and ForecastPoint interfaces omitting the field 'user'
export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

// grouping the the beach forecasts by time
export interface TimeForecast {
  time: string
  forecast: BeachForecast[]
}

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`)
  }
}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: Beach[]
  ): Promise<TimeForecast[]> {
    try {
      const pointsWithCorrectSources: BeachForecast[] = []
      for (const beach of beaches) {
        // query each beach forecast from the stormglass client
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng)
        // merge the forecast and beach data into a single object
        const enrichedBeachData = this.getEnrichedBeachData(points, beach)
        pointsWithCorrectSources.push(...enrichedBeachData)
      }
      return this.mapForecastByTime(pointsWithCorrectSources)
    } catch (e) {
      throw new ForecastProcessingInternalError(e.message)
    }
  }

  private getEnrichedBeachData(points: ForecastPoint[], beach: Beach) {
    return points.map((e) => ({
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: 1, //TODO need to be implemented
      },
      ...e,
    }))
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = []
    for (const point of forecast) {
      const timePoint = forecastByTime.find((f) => f.time === point.time)
      if (timePoint) {
        timePoint.forecast.push(point)
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point],
        })
      }
    }
    return forecastByTime
  }
}
