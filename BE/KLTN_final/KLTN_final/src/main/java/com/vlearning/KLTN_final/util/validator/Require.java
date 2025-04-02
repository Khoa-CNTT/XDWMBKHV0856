package com.vlearning.KLTN_final.util.validator;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Constraint(validatedBy = RequireValidator.class)
@Target({ ElementType.METHOD, ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME) // khi chương trình chạy thì nó cũng chạy
@Documented
public @interface Require {
    String message() default "Require";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
