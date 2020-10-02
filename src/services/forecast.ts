import { ForecastPoint, StormGlass } from '@src/clients/stormGlass'

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N',
}

export interface Beach {
  name: string
  position: BeachPosition
  lat: number
  lng: number
  user: string
}

// Merge the Beach and ForecastPoint interfaces omitting the field 'user'
export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

// grouping the the beach forecasts by time
export interface TimeForecast {
  time: string
  forecast: BeachForecast[]
}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: Beach[]
  ): Promise<TimeForecast[]> {
    const pointsWithCorrectSources: BeachForecast[] = []
    for (const beach of beaches) {
      // query each beach forecast from the stormglass client
      const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng)
      // merge the forecast and beach data into a single object
      const enrichedBeachData = points.map((e) => ({
        ...{
          lat: beach.lat,
          lng: beach.lng,
          name: beach.name,
          position: beach.position,
          rating: 1, //TODO need to be implemented
        },
        ...e,
      }))
      pointsWithCorrectSources.push(...enrichedBeachData)
    }
    return this.mapForecastByTime(pointsWithCorrectSources)
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
