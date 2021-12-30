Included:

1. Redis (For persistency) - docker-compose
2. Backend (Stateless, Can scale) - packages/backend
3. Frontend (React) - packages/ui

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
curl --request GET 'localhost:8080/decode/"aaaa"'
```
