'use strict'
const Generator = require('yeoman-generator')
const chalk = require('chalk')
const yosay = require('yosay')
const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')

module.exports = class extends Generator {
  initializing() {
    this.props = {}

    this.option('name', { type: String })
    this.option('desc', { type: String })
    this.option('command', { type: String })
  }

  async _inputScaffoldName(force) {
    let scaffoldName = force ? '' : this.options.name
    if (!scaffoldName) {
      scaffoldName = await this.prompt({
        type: 'input',
        name: 'scaffoldName',
        message: 'What is the name of your scaffold?',
        validate: name => {
          if (name === '') {
            this.log('\nscaffold name is required')
            return false
          }

          return true
        },
      }).then(({ scaffoldName }) => scaffoldName)
    }

    // Check if the directory is existed
    if (fs.existsSync(`${this.contextRoot}/${scaffoldName}`)) {
      const confirm = await this.prompt({
        type: 'confirm',
        name: 'confirmName',
        message: `${scaffoldName} is existed, do you want to overwrite`,
        default: true,
      }).then(({ confirmName }) => confirmName)

      if (!confirm) {
        const scaffoldName = this._inputScaffoldName(true)
        return scaffoldName
      }
    }

    return scaffoldName
  }

  async prompting() {
    // have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the remarkable ${chalk.red('generator-builder')} generator!`
      )
    )

    // input scaffold name
    this.props.scaffoldName = await this._inputScaffoldName()

    // input description
    this.props.desc = this.options.desc
    this.props.command = this.options.command
    const props = await this.prompt([
      {
        type: 'input',
        name: 'desc',
        message: 'Description',
        when: !this.options.desc,
      },
      {
        type: 'input',
        name: 'command',
        message: 'What is the command name?',
        default: this.props.scaffoldName,
        when: !this.options.command,
      },
    ])

    this.props = {
      ...this.props,
      ...props,
    }
  }

  default() {
    const destination = this.destinationPath(this.props.scaffoldName)
    fs.removeSync(destination)
    fs.ensureDirSync(destination)
    // set destination path
    this.destinationRoot(destination)

    // create .yo-rc.json
    this.config.save()

    // create generator
    this.composeWith(path.resolve(__dirname, '../../generator-generator/app'), {
      arguments: [this.props.scaffoldName],
    })
  }

  writing() {
    const { scaffoldName, command, desc } = this.props

    this.fs.copy(this.templatePath(), this.destinationPath(), {
      globOptions: { dot: true },
    })

    // merge package.json
    const pkg = this.fs.readJSON(this.destinationPath('package.json'), {})
    _.merge(pkg, {
      name: scaffoldName,
      description: desc,
      bin: {
        [command]: './dist/src/bin.js',
      },
    })
    pkg.keywords = pkg.keywords || []
    pkg.keywords.push('scaffold')
    this.fs.writeJSON(this.destinationPath('package.json'), pkg)
  }

  install() {
    this.npmInstall()
  }
}
