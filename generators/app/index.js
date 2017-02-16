'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _ = require('lodash');
var pascalCase = require('pascal-case');
var path = require('path');

var APIGenerator = module.exports = yeoman.generators.Base.extend({

    initializing: function () {
        this.appname = _.kebabCase(path.basename(process.cwd()));
    },

    prompting: function () {
        var done = this.async();

        var logo = "  _   _       ______ _____             \n" +
            " | \\ | |     |  ____|  __ \\            \n" +
            " |  \\| | ___ | |__  | |  | | _____   __\n" +
            " | . ` |/ _ \\|  __| | |  | |/ _ \\ \\ / /\n" +
            " | |\\  | (_) | |    | |__| |  __/\\ V / \n" +
            " |_| \\_|\\___/|_|    |_____/ \\___| \\_/  \n" +
            "                                       \n";
        this.log(chalk.green(logo) + '欢迎使用' + chalk.red('generator-groovy-api') + ' 代码生成器!' + '\n' + chalk.yellow('Usually the default prompt is recommended. '));

        var prompts = [
            {
                type: 'string',
                name: 'organizationName',
                message: '(1/11) 组织名称?',
                default: 'net.tfgzs'
            },
            {
                type: 'string',
                name: 'extraMavenRepo',
                message: '(2/11) 私有maven仓库地址?',
                default: 'http://nexus.yintai.org:8081/nexus/content/groups/public/'
            },
            {
                type: 'string',
                name: 'authorName',
                message: '(3/11) 作者的名字?',
                default: this.user.git.name()
            },
            {
                type: 'string',
                name: 'authorEmail',
                message: '(4/11) 作者的邮箱?',
                default: this.user.git.email()
            },
            {
                type: 'string',
                name: 'baseName',
                message: '(5/11) 项目的名字?',
                default: this.appname
            },
            {
                type: 'string',
                name: 'packageName',
                message: '(6/11) 项目基础包名?',
                default: function (response) {
                    return response.organizationName + '.' + response.baseName.replace(/\-/g, '');
                }
            },
            {
                type: 'string',
                name: 'description',
                message: '(7/11) 项目描述?'
            },
            {
                type: 'confirm',
                name: 'hasSample',
                message: '(8/11) 您想生成一些代码案例吗?',
                default: true
            }
        ];

        this.prompt(prompts, function (props) {
            // To access props later use this.props.someOption;
            this.props = props;
            this.props.applicationName = pascalCase(this.appname) + 'Application';
            done();
        }.bind(this));
    },

    writing: function () {
        var sourceDir = "src/main/groovy/";
        var resourcesDir = "src/main/resources/";

        var packageDir = this.props.packageName.replace(/\./g, '/') + '/';

        var sampleDir = sourceDir + "net/tfgzs/sample/";
        var sampleDestDir = sourceDir + packageDir + "sample/";

        //gradle
        this.template('build.gradle', 'build.gradle', this.props, {'interpolate': /<%=([\s\S]+?)%>/g});
        this.template('gradle.properties', 'gradle.properties', this.props, {'interpolate': /<%=([\s\S]+?)%>/g});
        this.fs.copy(this.templatePath('gradlew'), this.destinationPath('gradlew'));
        this.fs.copy(this.templatePath('gradlew.bat'), this.destinationPath('gradlew.bat'));
        this.fs.copy(this.templatePath('gradle/wrapper/gradle-wrapper.jar'), this.destinationPath('gradle/wrapper/gradle-wrapper.jar'));
        this.fs.copy(this.templatePath('gradle/wrapper/gradle-wrapper.properties'), this.destinationPath('gradle/wrapper/gradle-wrapper.properties'));

        //readme
        this.template('README.md', 'README.md', this.props, {'interpolate': /<%=([\s\S]+?)%>/g});

        //git
        this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));

        //sample
        if (this.props.hasSample) {
            this.template(sampleDir + "dto/UserDTO.groovy", sampleDestDir + "dto/UserDTO.groovy", this.props);
            this.template(sampleDir + "UserFacade.groovy", sampleDestDir + "UserFacade.groovy", this.props);
        }

    },

    install: function () {
        // this.installDependencies();
    }
});