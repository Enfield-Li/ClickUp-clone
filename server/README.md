### A basic structure presenting both synchronous connection and asynchronous messaging between services:

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