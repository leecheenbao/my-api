# 使用官方的 Node.js 基礎映像
FROM node:20

# 設定工作目錄
WORKDIR /usr/src/app

# 複製 package.json 和 package-lock.json（如果有）
COPY package*.json ./

# 列出當前目錄的文件以確認 package.json 已被複製
RUN ls -la

# 安裝專案依賴
RUN npm install

# 如果你有生產環境的專案依賴，可以使用下面這行
# RUN npm ci --only=production

# 複製專案檔案
COPY . .

# 暴露應用程式埠號（假設你的應用程式在埠號3000上運行）
EXPOSE 8080

# 定義 Docker 容器啟動時執行的命令
CMD [ "node", "app.js" ]
