package com.vlearning.KLTN_final.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import com.vlearning.KLTN_final.domain.ActivityLog;
import com.vlearning.KLTN_final.domain.Review;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.domain.dto.response.ResultPagination;
import com.vlearning.KLTN_final.repository.LogRepository;
import com.vlearning.KLTN_final.util.exception.CustomException;

@Service
public class LogService {

    @Autowired
    private LogRepository logRepository;

    @Autowired
    private UserService userService;

    public ActivityLog handleCreateLog(ActivityLog log) throws CustomException {
        User user = this.userService.handleFetchUser(log.getUser().getId());
        log.setUser(user);

        return this.logRepository.save(log);
    }

    public ResultPagination handleFetchSeveralLogs(Specification<ActivityLog> spec, Pageable pageable) {
        Page<ActivityLog> page = this.logRepository.findAll(spec, pageable);

        ResultPagination.Meta meta = new ResultPagination.Meta();
        meta.setPage(pageable.getPageNumber() + 1);
        meta.setSize(pageable.getPageSize());
        meta.setTotalPage(page.getTotalPages());
        meta.setTotalElement(page.getTotalElements());

        ResultPagination resultPagination = new ResultPagination();
        resultPagination.setResult(page.getContent());
        resultPagination.setMeta(meta);

        return resultPagination;
    }
}
