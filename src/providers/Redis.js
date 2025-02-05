const redis = require('redis');
require('dotenv').config();

const REDIS_URL = process.env.REDIS_URL

/*
USE REDIS ON CONSOLE:
redis-cli -p 6380
keys *
flushall - deletes all db
*/


class RedisProvider {

  
    constructor() {
      this.client = redis.createClient({
        url: REDIS_URL
      });
      try {
        this.client.connect();
        console.log("Redis connected here")
           
         } catch (error) {
           console.log("Redis connection error", error)
       }
    }
  
    async set(key, value) {
      return this.client.set(key, value);
    }
    async  setWithExpiration(key, value, time) {
      await this.client.set(key, value, {EX: time});

  }
  
    async get(key) {
      return this.client.get(key);
    }
  }
  
  module.exports = RedisProvider;