import inquirer from "inquirer"
import path from "path"
import shell from "shelljs"
import * as ejs from "ejs"
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync, copyFileSync } from "fs"
import { info, log, warning } from "../helpers/colors"

interface CreateOptions {
  root: string
  projectName: string
  templatePath: string
  targetPath: string
  useGithub: boolean
  useLint: boolean
  useTest: boolean
  useGit: boolean
  useVSCode: boolean
}

// create folder
function createProject(projectPath: string) {
  if (existsSync(projectPath)) {
    console.log(warning(`Folder ${projectPath} exists. Delete or use another name.`))
    return false
  }

  console.log(log(" > Creating Folder"))
  mkdirSync(projectPath)
  return true
}

// list of file/folder that should not be copied
const SKIP_FILES = ["node_modules", ".template.json"]
function createDirectoryContents(templatePath: string, filepath: string, options: CreateOptions) {
  const filesToCreate = readdirSync(templatePath)
  filesToCreate.forEach((file) => {
    const origFilePath = path.join(templatePath, file)

    const stats = statSync(origFilePath)
    if (SKIP_FILES.indexOf(file) > -1) return

    if (stats.isFile()) {
      const writePath = path.join(options.root, filepath, file)

      if ([".json", ".md", ".ts"].includes(path.extname(origFilePath))) {
        // use template rendering for text files
        let contents = readFileSync(origFilePath, "utf8")
        contents = templateRender(contents, options)
        writeFileSync(writePath, contents, "utf8")
      } else {
        // binary content (straight copy)
        copyFileSync(origFilePath, writePath)
      }
    } else if (stats.isDirectory()) {
      if (!existsSync(path.join(options.root, filepath, file))) {
        mkdirSync(path.join(options.root, filepath, file))
      }
      createDirectoryContents(path.join(templatePath, file), path.join(filepath, file), options)
    }
  })
}

function templateRender(content: string, data: CreateOptions) {
  return ejs.render(content, data)
}

function postProcess(options: CreateOptions) {
  const isNode = existsSync(path.join(options.templatePath, "package.json"))
  if (isNode) {
    shell.cd(options.targetPath)
    const result = shell.exec("yarn install")
    if (result.code !== 0) {
      return false
    }

    const resultformat = shell.exec("yarn format")
    if (resultformat.code !== 0) {
      return false
    }
  }

  return true
}

export default async (name: string, args: { template: string; features: string }) => {
  const root = path.resolve(".").replace(/\\/g, "/")
  const targetPath = path.join(root, name).replace(/\\/g, "/")
  if (existsSync(targetPath)) return console.log(warning(`Folder ${targetPath} exists. Delete or use another name.`))

  // console.log(args)
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "renderer",
      message: "Which project template do you want ?",
      when: () => !args.template?.trim(),
      choices: [
        { name: "2D (pixi.js)", value: "pixi" },
        { name: "3D (babylon.js)", value: "babylon" },
        { name: "Minimalist (canvas)", value: "mini" },
      ],
    },
    // {
    //   type: "list",
    //   name: "options",
    //   message: "Which type of build would you like for your Pixel Project ?",
    //   choices: [
    //     { name: "Web & Desktop App", value: "all" },
    //     { name: "HTML5 (Web Only)", value: "web" },
    //     { name: "Desktop (App Only)", value: "desktop" },
    //   ],
    // },
    {
      type: "checkbox",
      name: "features",
      message: "Which features do you need?",
      pageSize: 12,
      when: () => !args.features?.trim(),
      choices: [
        new inquirer.Separator(`--- Tooling ---`),
        {
          name: "Git Integration",
          checked: true,
          value: "git",
        },
        {
          name: "VSCode Integration (launch, debug, workspace)",
          checked: true,
          value: "vscode",
        },
        {
          name: "Code style (Lint)",
          value: "lint",
          checked: true,
        },
        {
          name: "Unit Testing",
          checked: true,
          value: "test",
        },
        {
          name: "Github Actions (CI)",
          value: "github",
        },
        new inquirer.Separator(`--- Features ---`),
        {
          name: "Audio (Howler.js : https://howlerjs.com/)",
          value: "physic",
          checked: true,
        },
        {
          name: "Localization (vue-i18n)",
          value: "localization",
        },
        // {
        //   name: "Physics / Collision (P2.js : https://github.com/schteppe/p2.js/#demos)",
        //   value: "physic",
        // },
        // {
        //   name: "2D Character Animation (Spine : http://esotericsoftware.com/spine-demos )",
        //   value: "spine",
        // },
        // {
        //   name: "2D Layered Animations (Live2d : https://www.live2d.com/en/about/ )",
        //   value: "live2d",
        // },
      ],
    },
  ])

  const getTemplate = (base: string, subfolder: string) => {
    return path.join(__dirname, "../..", base, subfolder).replace(/\\/g, "/")
  }

  // get values from either arg parameter or questions
  const renderer = args.template ? args.template : answers.renderer
  const features = args.features ? args.features.split(",") : answers.features

  const templatePath = getTemplate("templates", renderer)

  console.log(info.bold(`Create a new Pixel Project '${name}'`))
  console.log(
    info(`    Template: ${renderer}
    Path: ${targetPath})`)
  )
  if (!createProject(targetPath)) return
  const options: CreateOptions = {
    root,
    projectName: name.replace(/[\W_]/g, "-"),
    templatePath,
    targetPath,
    useLint: features.includes("lint"),
    useTest: features.includes("test"),
    useGit: features.includes("git"),
    useGithub: features.includes("github"),
    useVSCode: features.includes("vscode"),
  }

  console.log(log(" > Copying Files"))
  createDirectoryContents(templatePath, name, options)

  // console.log(answers)
  if (options.useGit) {
    console.log(log(" > Adding Git"))
    createDirectoryContents(getTemplate("templates/features", "git"), name, options)
  }

  if (options.useVSCode) {
    console.log(log(" > Adding VSCode"))
    createDirectoryContents(getTemplate("templates/features", "vscode"), name, options)
  }

  if (options.useLint) {
    console.log(log(" > Adding Lint"))
    createDirectoryContents(getTemplate("templates/features", "lint"), name, options)
  }

  if (options.useTest) {
    console.log(log(" > Adding Test"))
    createDirectoryContents(getTemplate("templates/features", "test"), name, options)
  }

  if (options.useGithub) {
    console.log(log(" > Adding Github Actions"))
    createDirectoryContents(getTemplate("templates/features", "github"), name, options)
  }

  console.log(log(" > Installing Dependencies"))
  postProcess(options)

  console.log(info(`------`))
  console.log(info.bold(`Your "${options.projectName}" project is Ready !`))
  console.log(
    info(`
To get started, Run the following command:
  cd ${name}
  yarn dev
And check README.md for more informations
------
`)
  )
}
