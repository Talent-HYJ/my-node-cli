const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const spawn = require('cross-spawn')
const ora = require('ora')
const figlet = require('figlet')
const chalk = require('chalk')

async function selectTemplate() {
  const { template } = await inquirer.prompt([
    {
      name: 'template',
      type: 'list',
      message: '请选择模板：',
      choices: [
        {
          name: 'Electron-React',
          value: 'electron-react',
        },
        {
          name: 'Electron-Vue',
          value: 'vue',
        },
        {
          name: 'Taro',
          value: 'taro',
        },
      ],
    },
  ])
  return template
}

async function gitCloneProject(name) {
  const template = await selectTemplate()
  if (template !== 'electron-react') {
    console.log(chalk.yellow('暂不支持该模板下载'))
    process.exit(0)
  }
  const cwd = process.cwd()
  const targetDir = path.join(cwd, name)
  const spinner = ora('正在下载模板...').start()
  const result = spawn.sync('git', [
    'clone',
    'https://gitee.com/Talent-HYJ/electron-react-template.git',
    name,
  ])
  spinner.stop()
  const spinnerDev = ora('正在安装依赖...').start()
  spawn.sync('yarn', [], { stdio: 'inherit', cwd: targetDir, shell: true })
  spinnerDev.stop()
  figlet('SUCCESS!', (err, data) => {
    if (err) {
      console.log('Something went wrong...')
      console.dir(err)
      return
    }
    console.log(data)
  })
}

module.exports = async function create(name, options) {
  // 当前命令行执行的目录
  const cwd = process.cwd()
  // 创建的项目的路径
  const targetDir = path.join(cwd, name)
  if (fs.existsSync(targetDir)) {
    // 是否覆盖
    if (options.force) {
      await fs.remove(targetDir)
    } else {
      let { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: '目录已存在，是否覆盖？',
          choices: [
            {
              name: '覆盖',
              value: 'overwrite',
            },
            {
              name: '取消',
              value: 'cancel',
            },
          ],
        },
      ])
      if (!action) {
        return
      } else if (action === 'overwrite') {
        // 删除目录
        await fs.remove(targetDir)
        gitCloneProject(name)
      }
    }
  } else {
    // https://gitee.com/Talent-HYJ/electron-react-template.git
    try {
      gitCloneProject(name)
    } catch (error) {
      console.log(error)
    }
  }
}
