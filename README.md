# 脚手架生成器

这是一套脚手架生成器工具。

## 一、依赖模块

1. **[func](https://github.com/unix/func)**: Func 是一个命令行开发框架，可以使用 typescript 和修饰器开发命令行；
2. **[yeoman](https://yeoman.io/learning/)**: Yeoman 是一个通用的脚手架开发系统，允许开发各种应用的脚手架；

## 二、如何开发/构建脚手架生成器

1. 开发：npm start
2. 构建：npm build

## 三、生成新的脚手架

1. 将当前脚手架命令注册为全局命令

- 开发环境运行 npm start 以后会自动注册；
- 构建以后需要手动执行 npm link 手动注册；

2. 生成一个新的脚手架：

```
scaffold create --name frontend-scaffold --desc frontend scaffold --command create-fe
```

运行上述命令将会生成一个名为 frontend-scaffold 的脚手架目录，desc 参数用于定义脚手架描述，command 参数用于定义脚手架的使用命令。

3. 脚手架的开发/发布流程与“开发/发布脚手架生成器”一致。

## 五、目录说明

- dist：打包文件存放目录；
- scripts/build.js：打包构建脚本
- src：src 目录与 func 初始化生成的目录一致；
- static：该目录下存放直接 copy 进 dist 目录的文件，因为 func 的 build 只会编译输出 ts 文件，一些直接引用的文件需要放在 static 目录中；
- tests：单元测试代码；
