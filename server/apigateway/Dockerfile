FROM openjdk:8-jdk-alpine

COPY /target/api-gateway-0.0.1-SNAPSHOT.jar gateway.jar

ENTRYPOINT ["java","-jar","gateway.jar"]