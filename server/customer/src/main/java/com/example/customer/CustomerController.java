package com.example.customer;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/customers")
class CustomerController {

  private final CustomerService customerService;

  @PostMapping
  void registerCustomer(
    @RequestBody CustomerRegistrationRequest customerRegistrationRequest
  ) {
    log.info("new customer registration {}", customerRegistrationRequest);
    customerService.registerCustomer(customerRegistrationRequest);
  }
}
