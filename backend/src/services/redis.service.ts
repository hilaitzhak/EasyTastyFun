import Redis from 'ioredis';
import zlib from 'zlib';

export class RedisService {
    private redis: Redis;
    private CACHE_DURATION = 3600; // 1 hour in seconds

    constructor(redisInstance: Redis) {
        this.redis = redisInstance;
    }


    async get(key: string) {
        const compressedData = await this.redis.get(key);
        if (!compressedData) return null;

        const decompressed = zlib.gunzipSync(Buffer.from(compressedData, 'base64')).toString();
        return JSON.parse(decompressed);
    }

    async set(key: string, value: any) {
        const jsonString = JSON.stringify(value);
        const compressed = zlib.gzipSync(jsonString).toString('base64'); // Compress JSON
        await this.redis.set(key, compressed, 'EX', this.CACHE_DURATION);
    }


    async del(key: string) {
    await this.redis.del(key);
    }
}