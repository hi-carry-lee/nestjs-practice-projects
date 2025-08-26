# project description

## install dependencies

pnpm add @nestjs/passport passport
pnpm add passport-local
pnpm add @nestjs/jwt
pnpm add passport-jwt
pnpm add -D @types/passport-jwt
pnpm add -D @types/passport-local

合并安装开发依赖
pnpm add -D @types/passport-local @types/passport-jwt

## github 登录

1. 学习了使用联合类型来扩展Request
2. 学习了如何处理联合类型，创建单独的Guard函数
3. github的Strategy，它的validate方法返回数据的处理；

## todo

1. controller里面使用Guard函数之后，是否需要对原有逻辑进行调整？
