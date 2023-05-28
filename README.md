# 道易程网站
道易程网站是一个专注于道易程智能合约API使用和信息发布的平台。我们的合约API涵盖了道易程各种代币和兑换的功能，以及用户的各种统计信息，为用户提供便捷的交易和转换服务。同时，我们采用了activityPub协议来支持信息发布，这使得其他联邦软件可以方便地订阅并获取道易程发布的信息。我们致力于为用户提供高效、安全和便利的智能合约服务和信息共享平台。在道易程网站上，您可以轻松地使用智能合约API进行代币交易和兑换，并获取关于您的统计信息。我们的平台使用activityPub协议，让您的信息能够被其他联邦软件方便地订阅和获取。我们致力于为用户提供高效、安全和便利的智能合约服务和信息共享平台。

## 网站的部署

### 1. 数据库的部署：
   我们支持MySQL 8.0及以上版本。请使用以下命令初始化数据库：`source data.sql`，其中data.sql文件位于根目录下。

### 2. 智能合约操作的监听：
   该模块的功能是为网站提供数据缓存功能，将道易程智能合约的操作数据缓存到本地数据库中，以方便网站展示和数据提取。由于监听基于公网，受网络环境等不确定因素的影响，服务需要定时重启。

  ## 部署步骤如下：
   ### 2.1 配置数据库连接：
       打开daonodeservice目录下的sn.txt文件，进行连接数据库参数的配置。
  ### 2.2 在Linux终端输入`crontab -e`，添加定时任务脚本命令：
  ```js
       `5 * * * * /root/daonodeservice/start.sh`
```
       注意：这里要求使用绝对路径。

## 3. 网站的启动：
   ### 3.1 网站配置：
       在根目录下的config.json文件中进行配置：
       ```
       {
         "DOMAIN": "nngym.cn",     // 域名
         "PORT": "433",            // 端口号
         "PRIVKEY_PATH": "cer/private.key",  // HTTPS证书私钥
         "CERT_PATH": "cer/public.crt",     // HTTPS证书公钥
         "CA_PATH": "cer/ca.crt"              // CA证书路径
       }
       ```
   ### 3.2 数据库配置：
       打开根目录下的mysql_config.json文件，进行数据库连接配置。
  ### 3.3 启动网站：
       运行`./start.sh`命令来启动网站。

这些步骤将帮助您完成道易程网站的部署。请根据您的环境和需求进行相应的配置和操作。如有任何问题，请随时与我们联系。
