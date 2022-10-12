-- create databases
CREATE DATABASE IF NOT EXISTS `spring_microservices_fraud`;
CREATE DATABASE IF NOT EXISTS `spring_microservices_customer`;
CREATE DATABASE IF NOT EXISTS `spring_microservices_taskevent`;
CREATE DATABASE IF NOT EXISTS `spring_microservices_notification`;
CREATE DATABASE IF NOT EXISTS `spring_microservices_authorization`;

-- grant rights to root user
GRANT ALL ON `spring_microservices_fraud`.* TO 'root'@'%';
GRANT ALL ON `spring_microservices_customer`.* TO 'root'@'%';
GRANT ALL ON `spring_microservices_taskevent`.* TO 'root'@'%';
GRANT ALL ON `spring_microservices_notification`.* TO 'root'@'%';
GRANT ALL ON `spring_microservices_authorization`.* TO 'root'@'%';