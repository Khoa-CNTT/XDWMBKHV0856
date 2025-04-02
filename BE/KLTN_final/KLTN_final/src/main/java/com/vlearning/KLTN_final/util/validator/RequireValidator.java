package com.vlearning.KLTN_final.util.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class RequireValidator implements ConstraintValidator<Require, Object> {

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        try {
            return value != null ? true : false;
        } catch (Exception e) {
            return false;
        }
    }

}
