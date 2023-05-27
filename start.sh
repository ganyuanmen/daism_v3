#!/bin/sh

cd /root/smile

count=$(ps -ef | grep node | grep index.js | cut -c 9-16 )
if [[ $count>0 ]]
then
 kill -9 $count
fi
nohup node index.js > out.out 2>&1 &
echo 'restart ok!'

