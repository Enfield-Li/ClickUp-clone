package com.example.customer;

import static com.example.clients.UrlConstants.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping(CUSTOMER_API_VERSION)
class CustomerController {

  private final CustomerService customerService;

  @GetMapping
  String test() {
    System.out.println("***called***");
    return "Got it";
  }

  @PostMapping
  void registerCustomer(
    @RequestBody CustomerRegistrationRequest customerRegistrationRequest
  ) {
    log.info("new customer registration {}", customerRegistrationRequest);
    customerService.registerCustomer(customerRegistrationRequest);
  }
}
