const redis = require('redis');
require('dotenv').config();

const REDIS_URL = process.env.REDIS_URL



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
  
    async get(key) {
      return this.client.get(key);
    }
  }
  
  module.exports = RedisProvider;