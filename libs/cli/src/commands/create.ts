import inquirer from "inquirer"
import path from "path"
import { existsSync } from "fs"

export default async (name: string) => {
  const filename = path.resolve(".", name).replace(/\\/g, "/")
  if (existsSync(filename)) {
    throw new Error("Sorry but a similar folder is already there !")
  }

  console.log("Thanks for answering the following questions")

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "renderer",
      message: "Which project template do you want ?",
      choices: [
        { name: "2D (pixi.js)", value: "pixi" },
        { name: "3D (babylon.js)", value: "babylon" },
        { name: "Minimalist (canvas)", value: "mini" },
      ],
    },
    {
      type: "list",
      name: "options",
      message: "Which type of build would you like for your Pixel Project ?",
      choices: [
        { name: "Web & Desktop App", value: "all" },
        { name: "HTML5 (Web Only)", value: "web" },
        { name: "Desktop (App Only)", value: "desktop" },
      ],
    },
    {
      type: "checkbox",
      name: "features",
      message: "Which features do you need?",
      pageSize: 12,
      choices: [
        new inquirer.Separator(`--- Tooling ---`),
        {
          name: "Git Integration",
          checked: true,
          value: "test",
        },
        {
          name: "VSCode Integration (launch, debug, workspace)",
          checked: true,
          value: "test",
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
          name: "Localization (vue-i18n)",
          value: "localization",
        },
        new inquirer.Separator(`--- Features ---`),
        {
          name: "Audio (Howler.js : https://howlerjs.com/)",
          value: "physic",
          checked: true,
        },
        {
          name: "Physics / Collision (P2.js : https://github.com/schteppe/p2.js/#demos)",
          value: "physic",
        },
        {
          name: "2D Character Animation (Spine : http://esotericsoftware.com/spine-demos )",
          value: "spine",
        },
        {
          name: "2D Layered Animations (Live2d : https://www.live2d.com/en/about/ )",
          value: "live2d",
        },
      ],
    },
  ])

  console.log(JSON.stringify(answers, null, "  "))
  const src = path.relative(".", path.join(__dirname, "..", "..", "templates", answers.renderer)).replace(/\\/g, "/")
  const dest = path.relative(".", filename).replace(/\\/g, "/")
  console.log(`${src} => ${dest}`)
}
