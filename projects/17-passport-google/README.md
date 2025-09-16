# 17-passport-google

1. 用来演示使用Google登录Nestjs应用；
2. index.html使用live server来运行，所以它的回调地址是http://127.0.0.1:5500/projects/17-passport-google/index.html；
3. 使用Neon数据库；
4. 使用passport + passport-google-oauth20来实现Google登录；
5. 直接读取.env文件中的变量需要安装dotenv，且它需要在main.ts的最前面加载
