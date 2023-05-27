const redisObj=require('redis');
const { createClient } =redisObj;
const client = createClient({url:'redis://:222333@127.0.0.1:6379'})
client.on('error', err => console.log('Redis Client Error', err));

async function set(key,value,ex)
{
    console.log(`redis:set(${key},${value},${ex})`)
    await client.connect();
    if(ex)
        await client.set(key, value, {EX:ex});
    else 
        await client.set(key, value);
    await client.disconnect();
}

async function get(key)
{
    await client.connect();
    const value = await client.get(key);
    await client.disconnect();
    console.log(`redis:get(${key}==>${value})`)
    return value;
}

async function remove(key)
{
    await client.connect();
    let ex= await client.exists(key)
    if(ex===1) await client.del(key)
    await client.disconnect();
    console.log(`redis:remove(${key})`)
}

async function expire(key,v)
{
    await client.connect();
    let ex= await client.exists(key)
    if(ex===1) await client.expire(key, v);
    await client.disconnect();
    console.log(`redis:expire(${key}=>${v})`)
}

async function exists(key)
{
    await client.connect();
    let ex= await client.exists(key)
    await client.disconnect();
    console.log(`redis:exists(${key})`)
    return ex===1
}

module.exports = {set,get,remove,expire,exists};
