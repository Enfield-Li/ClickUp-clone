-- create databases
CREATE DATABASE IF NOT EXISTS `spring_microservices_fraud`;
CREATE DATABASE IF NOT EXISTS `spring_microservices_customer`;
CREATE DATABASE IF NOT EXISTS `spring_microservices_notification`;

-- grant rights to root user
GRANT ALL ON `spring_microservices_fraud`.* TO 'root'@'%';
GRANT ALL ON `spring_microservices_customer`.* TO 'root'@'%';
GRANT ALL ON `spring_microservices_notification`.* TO 'root'@'%';