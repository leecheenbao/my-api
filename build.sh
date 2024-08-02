#!/bin/bash

# 版本號文件
VERSION_FILE="version.txt"

# 檢查版本號文件是否存在，如果不存在則創建並設置初始版本號
if [ ! -f "$VERSION_FILE" ]; then
    echo "1" > "$VERSION_FILE"
fi

# 讀取當前版本號
VERSION=$(cat "$VERSION_FILE")

# 構建 Docker 映像並設置標籤為當前版本號
docker build -t my-node-app:$VERSION --platform=linux/amd64 .

# 檢查構建是否成功
if [ $? -eq 0 ]; then
    echo "Docker image my-node-app:$VERSION built successfully."

    # 增量版本號
    NEW_VERSION=$((VERSION + 1))

    # 更新版本號文件
    echo "$NEW_VERSION" > "$VERSION_FILE"

    echo "Updated version to $NEW_VERSION"

    # 處理先前的版本
    PREVIOUS_VERSION=$((VERSION - 1))
    if [ $PREVIOUS_VERSION -ge 1 ]; then
        # 標籤並推送先前的版本到 GCP
        docker tag my-node-app:$PREVIOUS_VERSION asia-east1-docker.pkg.dev/driven-slice-355713/my-api/my-api:$PREVIOUS_VERSION
        docker push asia-east1-docker.pkg.dev/driven-slice-355713/my-api/my-api:$PREVIOUS_VERSION

        if [ $? -eq 0 ]; then
            echo "Docker image my-node-app:$PREVIOUS_VERSION pushed to GCP successfully."
        else
            echo "Failed to push Docker image my-node-app:$PREVIOUS_VERSION to GCP."
        fi

        # 刪除先前的版本映像
        docker rmi my-node-app:$PREVIOUS_VERSION
        if [ $? -eq 0 ]; then
            echo "Docker image my-node-app:$PREVIOUS_VERSION removed successfully."
        else
            echo "Failed to remove Docker image my-node-app:$PREVIOUS_VERSION."
        fi

        # 刪除先前的版本映像
        docker rmi asia-east1-docker.pkg.dev/driven-slice-355713/my-api/my-api:$PREVIOUS_VERSION
        if [ $? -eq 0 ]; then
            echo "Docker image asia-east1-docker.pkg.dev/driven-slice-355713/my-api/my-api:$PREVIOUS_VERSION removed successfully."
        else
            echo "Failed to remove Docker image asia-east1-docker.pkg.dev/driven-slice-355713/my-api/my-api:$PREVIOUS_VERSION."
        fi
    fi
else
    echo "Docker build failed."
fi
