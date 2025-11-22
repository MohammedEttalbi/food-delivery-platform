package org.example.order_service.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  HttpHeaders headers,
                                                                  HttpStatusCode status,
                                                                  WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("message", "Validation failed");
        Map<String, String> errors = new HashMap<>();
        for (var error : ex.getBindingResult().getAllErrors()) {
            String field = error instanceof FieldError fe ? fe.getField() : error.getObjectName();
            errors.put(field, error.getDefaultMessage());
        }
        body.put("errors", errors);
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> handleRuntime(RuntimeException ex) {
        // Map specific known message to 404; otherwise 400
        if ("Order not found".equals(ex.getMessage()) || "Restaurant not found".equals(ex.getMessage())) {
            Map<String, Object> body = Map.of("message", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
        }
        Map<String, Object> body = Map.of("message", ex.getMessage());
        return ResponseEntity.badRequest().body(body);
    }
}
