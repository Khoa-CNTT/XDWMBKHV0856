package com.vlearning.KLTN_final.domain.dto.response;

public class ResponseDTO<T> {
    private Integer status;

    private String error;

    // message có thể là String hoặc ArrayList<String>, nghĩa là sẽ có 1 lỗi hoặc
    // nhiều lỗi
    private Object message;

    private T data;

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public Object getMessage() {
        return message;
    }

    public void setMessage(Object message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

}
