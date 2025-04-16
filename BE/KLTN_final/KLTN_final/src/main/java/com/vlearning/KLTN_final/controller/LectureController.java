package com.vlearning.KLTN_final.controller;

import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.vlearning.KLTN_final.domain.Lecture;
import com.vlearning.KLTN_final.domain.LectureProcess;
import com.vlearning.KLTN_final.domain.dto.response.ResponseDTO;
import com.vlearning.KLTN_final.service.LectureService;
import com.vlearning.KLTN_final.util.exception.CustomException;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/v1")
public class LectureController {

    @Autowired
    private LectureService lectureService;

    @PostMapping("/lecture")
    public ResponseEntity<ResponseDTO<Lecture>> createLecture(@RequestBody @Valid Lecture lecture)
            throws CustomException {

        ResponseDTO<Lecture> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.CREATED.value());
        res.setMessage("Create lecture success");
        res.setData(this.lectureService.handleCreateLecture(lecture));

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @GetMapping("/lecture/{id}")
    public ResponseEntity<ResponseDTO<Lecture>> fetchLecture(@PathVariable Long id) throws CustomException {

        ResponseDTO<Lecture> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Fetch lecture success");
        res.setData(this.lectureService.handleFetchLecture(id));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @PutMapping("/lecture")
    public ResponseEntity<ResponseDTO<Lecture>> updateLecture(@RequestBody Lecture lecture) throws CustomException {
        ResponseDTO<Lecture> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Update lecture success");
        res.setData(this.lectureService.handleUpdateLecture(lecture));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @DeleteMapping("/lecture/{id}")
    public ResponseEntity<ResponseDTO<Object>> deleteLecture(@PathVariable Long id)
            throws CustomException, IOException {
        ResponseDTO<Object> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Delete lecture success");
        this.lectureService.handleDeleteLecture(id);

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @PatchMapping("/lecture.file/{id}")
    public ResponseEntity<ResponseDTO<Lecture>> updateLectureFile(@PathVariable Long id,
            @RequestParam(name = "file") MultipartFile file)
            throws CustomException, IOException {

        ResponseDTO<Lecture> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Upload lecture file success");
        res.setData(this.lectureService.handleUpdateLectureFile(id, file));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @PatchMapping("/lecture.process")
    public ResponseEntity<ResponseDTO<LectureProcess>> updateLectureProcess(
            @RequestParam(name = "user_id") Long uid, @RequestParam(name = "lecture_id") Long lid)
            throws CustomException, IOException {

        ResponseDTO<LectureProcess> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("Update process success");
        res.setData(this.lectureService.handleUpdateProcess(uid, lid));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @GetMapping("/check-lecture.process")
    public ResponseEntity<ResponseDTO<LectureProcess>> checkLectureProcess(
            @RequestParam(name = "user_id") Long uid, @RequestParam(name = "lecture_id") Long lid)
            throws CustomException, IOException {

        ResponseDTO<LectureProcess> res = new ResponseDTO<>();
        res.setStatus(HttpStatus.OK.value());
        res.setMessage("check process success");
        res.setData(this.lectureService.handleCheckLectureProcess(uid, lid));

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }
}
