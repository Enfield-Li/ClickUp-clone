## A basic structure presenting both synchronous connection and asynchronous messaging between services:

```
+------------------+
|                  |
|                  |
|                  |
|                  |
|                  |
|                  |        +------------------+                 +----------------+                    +------------------+
|                  |        |                  | Sync connection |                |   Async message    |                  |
|     Gateway      |------->|   Fraud check    |---------------->|    Customer    |------------------->|   Notification   |
|                  |        |                  |                 |                |   (Spring AMQP)    |                  |
|                  |        +------------------+                 +----------------+          |         +------------------+
|                  |                                                                         |
|                  |                                                                         |
|                  |                                                                         |
|                  |                                                                         |
|                  |                                                                         |
|                  |                                                                         |
+------------------+                                             +---------------------------+
                                                                 |
                                                                 |
                                                                 v
                     +----------------------------------------------------------------------------------------+
                     |                                                                                        |
                     |                       +---------------+                                                |
                     |  +----------+  Send   |               | Bind   +---------+ Receive   +--------------+  |
                     |  | Customer |-------->|   Exchange    |------->|  Queue  |---------->| Notification |  |
                     |  +----------+         |               |        +---------+ (Async)   +--------------+  |
                     |    Producer           +---------------+                                  Consumer      |
                     |                                                                                        |
                     +----------------------------------------------------------------------------------------+
```

## Authorization workflow:

Implementation based on this [stackoverflow answer](https://stackoverflow.com/a/69631673/16648127), and this [tutorial](https://www.youtube.com/watch?v=25GS0MLT8JU) from Youtuber Ben Awad:

```
 +----------------+
 |                |
 |  React client  |
 |                |
 +----------------+
     ^    |    |
     |    |    |             +---------------+
     |    |    |  register   |               |                      +------------------------+
     |    |    |  login      |               |     # 1              |                        |
     |    |    +------------>|               |--------------------> | Authorization service  |
     |    |                  |               |                      |                        |
     |    |                  |               |                      +------------------------+
     |    |                  |               |                                   ^
     |    |  refresh token   |               |                                   |
     |    |                  |               |     # 2                           |
     |    +----------------->|    Gateway    |<----------------------------------+
     |                       |               |
     |                       |               |
     |   access resource     |               |                      +------------------------+
     |                       |               |     # 3              |                        |
     +---------------------->|               |<-------------------->|    Resource service    |
                             |               |                      |                        |
                             |               |                      +------------------------+
                             |               |
                             +---------------+
```

#### Step #1:

Authorization service authenticate the incoming register/login request, and issue an access token and a refresh token:

1. The access token stores `userId`, `subject`, `issuedAt`, and `expirationTime`. With the expiration time set to 30 min, the access token will be sent through response body, see `AuthorizationResponse` class;

2. The refresh token will store all of the claims(payload properties) like the access token, along with an extra one: `tokenVersion`. With the expiration time set to 7 days, the refresh token will be stored inside http session, so as to prevent client from accessing. The `tokenVersion` means to prevent the use of invalidated old token after user changes password.

#### Step #2:

Before access token expires, the client send a "refresh token" request, in order to get a new access token. The server will be checking the refresh `tokenVersion`. And then create a new access token and a new refresh token, and send back to client.

#### Step #3:

The client makes request to a protected resource server by presenting the access token. The resource server validates the access token, and if valid, serves the request.

### Ports:

    Customer: 8080
    Fraud: 8081
    Notification: 8082
    Gateway: 8083
    Auth: 8085

    Eureka server: 8761

### Run in Docker:

    Maven clean/install
    docker compose up -d
