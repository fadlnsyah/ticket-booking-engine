package redis

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
)

type LockRepository interface {
	AcquireLock(ctx context.Context, key string, ttl time.Duration) (string, error)
	ReleaseLock(ctx context.Context, key string, lockValue string) (bool, error)
}

type redisLockRepository struct {
	client *redis.Client
}

func NewRedisLockRepository(client *redis.Client) LockRepository {
	return &redisLockRepository{client: client}
}

func (r *redisLockRepository) AcquireLock(ctx context.Context, key string, ttl time.Duration) (string, error) {
	lockValue := uuid.New().String()
	fullKey := fmt.Sprintf("lock:ticket:%s", key)

	success, err := r.client.SetNX(ctx, fullKey, lockValue, ttl).Result()
	if err != nil {
		return "", err
	}
	if !success {
		return "", fmt.Errorf("lock already held for key: %s", key)
	}

	return lockValue, nil
}

func (r *redisLockRepository) ReleaseLock(ctx context.Context, key string, lockValue string) (bool, error) {
	fullKey := fmt.Sprintf("lock:ticket:%s", key)
	luaScript := `
		if redis.call("get", KEYS[1]) == ARGV[1] then
			return redis.call("del", KEYS[1])
		else
			return 0
		end
	`

	result, err := r.client.Eval(ctx, luaScript, []string{fullKey}, lockValue).Int64()
	if err != nil {
		return false, err
	}

	return result == 1, nil
}
