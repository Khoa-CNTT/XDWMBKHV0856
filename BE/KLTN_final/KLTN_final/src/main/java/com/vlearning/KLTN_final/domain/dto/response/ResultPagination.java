package com.vlearning.KLTN_final.domain.dto.response;

public class ResultPagination {
    private Object result;

    private Meta meta;

    public Object getResult() {
        return result;
    }

    public void setResult(Object result) {
        this.result = result;
    }

    public Meta getMeta() {
        return meta;
    }

    public void setMeta(Meta meta) {
        this.meta = meta;
    }

    public static class Meta {
        // số trang hiện tại
        private int page;

        // số lượng phần tử tối đa mỗi trang
        private int size;

        // tổng số trang
        private int totalPage;

        // tổng số phần tử
        private long totalElement;

        public int getPage() {
            return page;
        }

        public void setPage(int page) {
            this.page = page;
        }

        public int getSize() {
            return size;
        }

        public void setSize(int size) {
            this.size = size;
        }

        public int getTotalPage() {
            return totalPage;
        }

        public void setTotalPage(int totalPage) {
            this.totalPage = totalPage;
        }

        public long getTotalElement() {
            return totalElement;
        }

        public void setTotalElement(long totalElement) {
            this.totalElement = totalElement;
        }

    }
}
