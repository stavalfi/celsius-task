Included:

1. Redis (For persistency) - docker-compose
2. Backend (Stateless, Can scale) - packages/backend
3. Frontend (React) - packages/ui

---

Run:

```
yarn install
yarn dev-resources:up
yarn start:backend
yarn start:ui
```

Encode Url (Long -> Short):

```
curl --request POST 'localhost:8080/encode' \
--header 'Content-Type: application/json' \
--data-raw '{
    "longUrl": "https://long-url.com/jefhiuewhf734fh4y783fg438gf834gf9878h4yu8fh8"
}'
```

Decode Url (Short -> Long):

```
curl --location --request POST 'localhost:8080/decode' \
--header 'Content-Type: application/json' \
--data-raw '{
    "shortUrl": "https://short.url/swqlg0.fco"
}'
```

---

## Scaling Notes

The backend service is stateless and all his operations run atomically on the redis-db. So It can be infinitily scale.

I chose Redis based on RAM master-slave architecture.

Pros:

1. Sutiable for this task (only long and short urls are required to be persisted)
1. Sutiable for alot of reads
1. Easy to implement and maintain.

Cons:

1. Cost alot of \$\$\$ becaue all data is replciated to all nodes
2. Master node is a bottleneck for all writes

> In procuction I would try Redis-Cluster SSD-RAM solution to overcome all the problems of the chosen architecture (cost-\$\$\$ of RAM, alot of writes such that each master-slaves group will save different set of key-values). RedisLabs is a good fit to easily implement and administrate this solution.

I will try to explain my decisions in minimal writing. Sorry if some parts are missing.

In this solution all write commands will be sent to the master-node and will be replciated to all other nodes and all read commands will be sent to any node/ only slave nodes (to prevent race-conditions in this art=chitecture, slaves won't process write commands).

I also wrote a (long) answer about [Can/Should You Really Persist Unrecoverable Data/State On Redis?](https://stackoverflow.com/questions/25328317/does-redis-persist-data/68226187#68226187) on stackoverflow.
