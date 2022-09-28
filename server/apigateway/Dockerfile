FROM openjdk:17-alpine

COPY /target/apigateway-0.0.1-SNAPSHOT.jar gateway.jar

ENTRYPOINT ["java","-jar","gateway.jar"]