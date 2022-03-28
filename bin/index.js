#! /usr/bin/env node
const program = require('commander')
// 初始化
const create = require('../lib/create')
// 创建一个项目
program
  .command('create <name>')
  .description('create a new project')
  .option('-f, --force', 'overwrite the project if it exists')
  .action((name, options) => {
    // 创建项目
    create(name, options)
  })
program
  .version(`${require('../package.json').version}`)
  .usage('<command> [options]')
program.parse(process.argv)
