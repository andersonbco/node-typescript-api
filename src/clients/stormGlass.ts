import { AxiosStatic } from 'axios'

export class StormGlass {
  readonly stormGlassParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection'
  readonly stormGlassSource = 'noaa'

  constructor(protected request: AxiosStatic) {}
  public async fetchPoints(lat: number, lng: number): Promise<{}> {
    return this.request.get(
      `https://api.stormglass.io/v2/weather/point?params=${this.stormGlassParams}&source=${this.stormGlassSource}&end=1592113802&lat=${lat}&lng=${lng}`
    )
  }
}
