#!/bin/sh

cd /root/nodeserver

count=$(ps -ef | grep node | grep app.js | cut -c 9-16 )
if [[ $count>0 ]]
then
 kill -9 $count
fi
nohup /root/node-v18.14.0-linux-x64/bin/node app.js > outweb3.out 2>&1 &
echo 'restart ok!'

