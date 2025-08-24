## 介绍
一个AI聊天助手,可以辅助解卦,塔罗占卜,八字命理
## 后端
[lyts-backend](https://github.com/let-fate/lyts-backend)
## 部署
1. 请先安装NodeJS 20+
2. 确保lyts-backend已经运行
3. 修改`src/lib/untils.ts`将里面的API_URL修改为后端网址，不要带最后的`/`
4. 运行`npm build`打包项目
5. 运行`npm start`启动项目
