-- create databases
CREATE DATABASE IF NOT EXISTS `spring_microservices_team`;
CREATE DATABASE IF NOT EXISTS `spring_microservices_task`;
CREATE DATABASE IF NOT EXISTS `spring_microservices_authorization`;
CREATE DATABASE IF NOT EXISTS `spring_microservices_teamStatusCategory`;

-- grant rights to root user
GRANT ALL ON `spring_microservices_team`.* TO 'root'@'%';
GRANT ALL ON `spring_microservices_task`.* TO 'root'@'%';
GRANT ALL ON `spring_microservices_authorization`.* TO 'root'@'%';
GRANT ALL ON `spring_microservices_teamStatusCategory`.* TO 'root'@'%';
