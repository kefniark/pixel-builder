#!/usr/bin/env node
import { Command } from "commander"
import pack from "./commands/pack"
import { dev, build, preview } from "./commands/build"
import create from "./commands/create"

const program = new Command()

program.name("Pixel Builder").description("CLI to create and build HTML5 Games")

program
  .command("create")
  .description("Create a new pixel project")
  .argument("[string]", "project name")
  .option("-t, --template <string>", "Pick a template to use (pixi, babylon, mini)")
  .option("-f, --features <string>", "Pick features (git, vscode, lint, test, github)")
  .action(create)

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
program.command("build")
  .description("Build a Project Project")
  .option("-b, --base <string>", "Base of the URL (if deployed in a sub folder)")
  .action(build)
program.command("preview").description("Preview a Build of a Pixel Project").action(preview)

// Parse
program.parse(process.argv)
