package com.example.fraud;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import com.example.clients.fraud.FraudCheckResponse;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/fraud-check")
public class FraudController {

  private final FraudCheckService fraudCheckService;

  @GetMapping("{customerId}")
  public FraudCheckResponse isFraudster(
    @PathVariable("customerId") Integer customerId
  ) {
    boolean isFraudulentCustomer = fraudCheckService.isFraudulentCustomer(
      customerId
    );
    log.info("fraud check request for customer {}", customerId);

    return new FraudCheckResponse(isFraudulentCustomer);
  }
}
