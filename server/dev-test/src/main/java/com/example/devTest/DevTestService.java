package com.example.devTest;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DevTestService {

    private final DevTestRepository devTestRepository;

    public Boolean test(Image statusColumn) {
        devTestRepository.save(statusColumn);
        return true;
    }
}
