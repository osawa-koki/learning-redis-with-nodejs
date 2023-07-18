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
  await redis.set('my-key', 'hogehoge')
  const value = await redis.get('foo')
  console.log('my-key: ', value)

  // Redisから切断。
  await redis.quit()
})().then(() => {
  console.log('Done!!!')
}).catch((err) => {
  console.error('Error: ', err)
})
