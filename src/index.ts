import Redis from 'ioredis'

(async () => {
  // Redisクライアントの作成。
  const redis = new Redis({
    host: 'redis',
    port: 6379
  })

  // イベントハンドラの設定。
  redis.on('error', (err) => {
    console.error('Redis error: ', err)
  })
  redis.on('connect', () => {
    console.log('Redis connected!!!')
  })
  redis.on('close', () => {
    console.info('Disconnected...')
  })

  // Redis操作イロイロ。

  // シンプルな文字列の操作。
  await redis.set('my-key', 'hogehoge')
  const value = await redis.get('my-key')
  console.log('my-key: ', value)

  // リストの操作。
  await redis.rpush('my-list', 'a', 'b', 'c', 'd', 'e')
  console.log('my-list: ', await redis.lrange('my-list', 0, -1))
  console.log('my-list[0]: ', await redis.lindex('my-list', 0))
  console.log('my-list[1]: ', await redis.lindex('my-list', 1))
  console.log('my-list[2]: ', await redis.lindex('my-list', 2))
  console.log('my-list[2:5]', await redis.lrange('my-list', 2, 5))
  await redis.lrem('my-list', 1, 'a')
  console.log('my-list(removed a): ', await redis.lrange('my-list', 0, -1))

  // セットの操作。
  await redis.sadd('my-set', 'a', 'b', 'c', 'd', 'e', 'a')
  console.log('my-set: ', await redis.smembers('my-set'))
  console.log('my-set has a: ', await redis.sismember('my-set', 'a'))
  console.log('my-set has z: ', await redis.sismember('my-set', 'z'))
  console.log('my-set(1, 3): ', await redis.srandmember('my-set', 3))
  await redis.srem('my-set', 'a')
  console.log('my-set(removed a): ', await redis.smembers('my-set'))

  // ソート済みセットの操作。
  await redis.zadd('my-sorted-set', 5, 'a', 4, 'b', 3, 'c', 2, 'd', 1, 'e', 0, 'a')
  console.log('my-sorted-set: ', await redis.zrange('my-sorted-set', 0, -1))
  console.log('my-sorted-set(reverse): ', await redis.zrevrange('my-sorted-set', 0, -1))
  console.log('my-sorted-set has a: ', await redis.zscore('my-sorted-set', 'a'))
  console.log('my-sorted-set has z: ', await redis.zscore('my-sorted-set', 'z'))
  console.log('my-sorted-set(1, 3): ', await redis.zrange('my-sorted-set', 1, 3))

  // ハッシュの操作。
  await redis.hset('my-hash', 'a', '1', 'b', '2', 'c', '3')
  console.log('my-hash: ', await redis.hgetall('my-hash'))
  console.log('my-hash.a: ', await redis.hget('my-hash', 'a'))
  console.log('my-hash.b: ', await redis.hget('my-hash', 'b'))
  console.log('my-hash.c: ', await redis.hget('my-hash', 'c'))
  await redis.hdel('my-hash', 'a')
  console.log('my-hash(removed a): ', await redis.hgetall('my-hash'))

  // Redisから切断。
  await redis.quit()
})().then(() => {
  console.log('Done!!!')
}).catch((err) => {
  console.error('Error: ', err)
})
