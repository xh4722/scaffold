'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const fs = require('fs-extra')

module.exports = class extends Generator {
  initializing() {
    this.props = {}
  }

  async _inputAppName() {
    const appName = await this.prompt({
      type: 'input',
      name: 'appName',
      message: 'What is the name of your scaffold?',
      validate: name => {
        if (name === '') {
          this.log('\nscaffold name is required')
          return false
        }

        return true
      },
    }).then(({ appName }) => appName)

    // Check if the directory is existed
    if (fs.existsSync(`${this.contextRoot}/${appName}`)) {
      const confirm = await this.prompt({
        type: 'confirm',
        name: 'confirmName',
        message: `${appName} is existed, do you want to overwrite`,
        default: true,
      }).then(({ confirmName }) => confirmName)

      if (!confirm) {
        const appName = this._inputAppName()
        return appName
      }
    }

    return appName
  }

  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the <%- superb %> ${chalk.red('<%= generatorName %>')} generator!`)
    );

    // Input app name
    this.props.appName = await this._inputAppName()
  }

  default() {
    const destination = this.destinationPath(this.props.appName)
    fs.removeSync(destination)
    fs.ensureDirSync(destination)
    // Set destination path
    this.destinationRoot(destination)
  }

  writing() {
    this.fs.copy(this.templatePath(), this.destinationPath(), {
      globOptions: { dot: true },
    })
  }

  install() {
    this.npmInstall();
  }
};
