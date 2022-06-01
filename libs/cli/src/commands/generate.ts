import { getPixelConfig } from "../helpers/config"

export default async () => {
    console.log('generate')
    const config = getPixelConfig()
    console.log(config.entities)
}