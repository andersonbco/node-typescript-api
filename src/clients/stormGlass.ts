import { AxiosStatic } from 'axios'

export interface StormGlassPointSource {
  [key: string]: number
}

export interface StormGlassPoint {
  readonly time: string
  readonly swellDirection: StormGlassPointSource
  readonly swellHeight: StormGlassPointSource
  readonly swellPeriod: StormGlassPointSource
  readonly waveDirection: StormGlassPointSource
  readonly waveHeight: StormGlassPointSource
  readonly windDirection: StormGlassPointSource
  readonly windSpeed: StormGlassPointSource
}

export interface StormGlassForecastResponse {
  hours: StormGlassPoint[]
}

export interface ForecastPoint {
  time: string
  swellDirection: number
  swellHeight: number
  swellPeriod: number
  waveDirection: number
  waveHeight: number
  windDirection: number
  windSpeed: number
}

export class StormGlass {
  readonly stormGlassParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection'
  readonly stormGlassSource = 'noaa'

  constructor(protected request: AxiosStatic) {}

  public async fetchPoints(lat: number, lng: number): Promise<{}> {
    const response = await this.request.get(
      `https://api.stormglass.io/v2/weather/point?params=${this.stormGlassParams}&source=${this.stormGlassSource}&end=1592113802&lat=${lat}&lng=${lng}`
    )
    return this.normalizeResponse(response.data)
  }

  private normalizeResponse(
    points: StormGlassForecastResponse
  ): ForecastPoint[] {
    return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
      time: point.time,
      swellDirection: point.swellDirection[this.stormGlassSource],
      swellHeight: point.swellHeight[this.stormGlassSource],
      swellPeriod: point.swellPeriod[this.stormGlassSource],
      waveDirection: point.waveDirection[this.stormGlassSource],
      waveHeight: point.waveHeight[this.stormGlassSource],
      windDirection: point.windDirection[this.stormGlassSource],
      windSpeed: point.windSpeed[this.stormGlassSource],
    }))
  }

  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection?.[this.stormGlassSource] &&
      point.swellHeight?.[this.stormGlassSource] &&
      point.swellPeriod?.[this.stormGlassSource] &&
      point.waveDirection?.[this.stormGlassSource] &&
      point.waveHeight?.[this.stormGlassSource] &&
      point.windDirection?.[this.stormGlassSource] &&
      point.windSpeed?.[this.stormGlassSource]
    )
  }
}
