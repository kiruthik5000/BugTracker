package com.backend.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CompareCodeRequest {
    private String email;

    @JsonProperty("input-code")
    private String inputCode;
}
