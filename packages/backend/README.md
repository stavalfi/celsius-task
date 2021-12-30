# CSM-IM Service

(aka Cloud System Manager In-Memory)

CSM-IM is the first entry-point for Singer. It triggers Punteam to send us Punteam-Fixture (PF) messages matching a Molly game to Rb Game. It then requests registration in Molly-Crawler service (Rb - We count on Punteam to register us - Singer is configured as 2nd end-point for Punteam's RB callback).
Then Molly-Crawler starts putting Molly offers in that specific game Redis-Stream. Rb-Crawler does same
for Rb game events. CSM-IM reads both Rb and Molly redis streams and build snapshots and call Research models
during live game offer/event changes.

## Overview

Service URL: https://singer-csm-im.octopol.io/
Service Swagger Docs: https://singer-csm-im.octopol.io/api/docs
Async Pub/Sub Swagger: https://singer-csm-im.octopol.io/async-api/docs
Prometheus Metrics: https://singer-csm-im.octopol.io/metrics

CSM-IM is the service responsible for running Research written systems (python systems) and act upon them, i.e: Execute based on the system responses.

In order to do so, CSM-IM gets input data from the following providers through Redis Streams:

- MollyBet - Get events on "offer"(s) and "remove_offer"(s) messages.
- Running Ball - Get events on in-play events in LIVE games.
- Punteam Matching - Matching information to allow Molly to RunningBall game matching. In addition we receive meta data on games and any information needed for Execution or Research system running. This info is received from Splitter.

## Scheduled Jobs or Tasks performed

CSM-IM schedules for execution the following Singer related batch operations or tasks:

- CheckAnomalies - Check data anomalies between a Punteam and Singer research triggers

## Tweaks

Sometimes you want to debug CSM-IM and have it run on an existing Redis Stream Pool X Session
topic, rather then to ask Splitter for a new Pool X Session to be created. To do it Use the below:

CSM_IM_HARD_CODED_REDIS_STREAM=pool0_2021_11_28_11_46_02_048Z yarn start:csm-im:dev

## How to view raw Prometheus metrics on the browser

1. run: `kubectl port-forward svc/confluent-exporter 8080:2112`
2. navigate to: `http://localhost:8080/metrics`

## View conf in Grafana

1. navigate to: `https://grafana-singer.octopol.io/d/3d6jLWeMk/confluent-cloud?orgId=1&refresh=5s`

## View conf in Prometheus UI

1. prefix: `ccloud` (choose one of the auto-completed options)

---

Logging

https://73010b99d03749d0900dfeab4467d69d.eu-west-1.aws.found.io:9243/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-15m,to:now))&_a=(columns:!(_source),filters:!(),index:'filebeat-*',interval:auto,query:(language:kuery,query:''),sort:!())

1. click add filter
2. field: kubernetes.labels.workload_user_cattle_io/workloadselector
3. equal to: deployment-default-csm
4. search in free text in the "search" box of KQL.

for example:
https://73010b99d03749d0900dfeab4467d69d.eu-west-1.aws.found.io:9243/app/discover#/?_g=(filters:!(('$state':(store:globalState),meta:(alias:csm,disabled:!f,index:'filebeat-*',key:kubernetes.labels.workload_user_cattle_io%2Fworkloadselector,negate:!f,params:(query:deployment-default-csm),type:phrase),query:(match_phrase:(kubernetes.labels.workload_user_cattle_io%2Fworkloadselector:deployment-default-csm)))),refreshInterval:(pause:!t,value:0),time:(from:now-15d,to:now))&_a=(columns:!(_source),filters:!(),index:'filebeat-*',interval:auto,query:(language:kuery,query:'%22scheduling%20first-half-finished%20task%20for%20master-game-id:%201335669%22'),sort:!())

phrase: "scheduling first-half-finished task for master-game-id: 1335669" (With "...")
