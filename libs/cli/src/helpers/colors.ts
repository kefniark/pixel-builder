import clc from "cli-color"

export const log = (str: string) => str
export const info = clc.green
export const warning = clc.yellow.bold
export const error = clc.red.bold
