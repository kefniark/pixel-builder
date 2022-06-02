#!/usr/bin/env node
import { Command } from "commander"
import pack from "./commands/pack"
import dev from "./commands/dev"
import build from "./commands/build"
import create from "./commands/create"

const program = new Command()

program.name("Pixel Builder").description("CLI to create and build HTML5 Games")

program.command("create").description("Create a new pixel project").argument("[string]", "project name").action(create)

// Dev : Use Vite Dev Server to run Project
program
  .command("pack")
  .description("Auto-Generate assets for a Pixel Project (spritesheet)")
  .argument("[string]", "files to convert into spritesheet")
  .option("-f, --format <string>", "format of spritesheet (pixi.js, json, ...)")
  .option("-o, --output <string>", "output spritesheet")
  .option("-p, --padding <number>", "padding between images in spritesheet")
  .option("-t, --no-trim", "disable trim (removes transparent whitespaces around images)")
  .option("-e, --no-skip-extension", "use file extension name in spritesheet frame name")
  .option("-n, --no-extrude", "use extrusion to avoid edge bleeding")
  .action(pack)

// program.command('generate')
//     .description('Auto-Generate code (entities, ...)')
//     .action(generate)

// Dev : Use Vite Dev Server to run Project
program.command("dev").description("Run a Pixel Project").action(dev)

// Build : Create a final build
program.command("build").description("Build a Project Project").action(build)

// Parse
program.parse(process.argv)
