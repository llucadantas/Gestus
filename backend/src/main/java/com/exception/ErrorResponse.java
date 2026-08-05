package com.exception;

import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ErrorResponse {
    public String error;
    public String message;
    public Integer status;
}
