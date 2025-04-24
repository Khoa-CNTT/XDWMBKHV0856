package com.vlearning.KLTN_final.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.vlearning.KLTN_final.repository.CourseRepository;
import com.vlearning.KLTN_final.repository.LectureRepository;
import com.vlearning.KLTN_final.repository.UserRepository;
import com.vlearning.KLTN_final.util.exception.CustomException;

@Service
public class FileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LectureRepository lectureRepository;

    @Value("${storage-default-path}")
    private String defaultPath;

    private final List<String> ALLOWED_EXTENSIONS = Arrays.asList("mp4", "avi", "mkv", "jpeg", "png");

    public String uploadFile(MultipartFile file, String entity, long id) throws CustomException {
        if (file.isEmpty()) {
            throw new CustomException("File upload is empty");
        }

        try {
            // Xây dựng đường dẫn
            Path path = Paths.get(defaultPath, entity, String.valueOf(id)).toAbsolutePath();

            String fileName = file.getOriginalFilename();

            // Kiểm tra thư mục
            if (!Files.exists(path)) {
                throw new CustomException("Entity not found (wrong id or entity)");
            }

            /*
             * forech, check fileName (viết thường - lower case) có chứa 1 trong các hậu tố
             * mở rộng ở trên hay không
             */
            boolean isValid = ALLOWED_EXTENSIONS.stream().anyMatch(item -> fileName.toLowerCase().endsWith(item));
            if (!isValid) {
                throw new CustomException("File type not allowed");
            }

            // Xóa tất cả file cũ trong thư mục
            Files.list(path)
                    .filter(Files::isRegularFile)
                    .forEach(t -> {
                        try {
                            Files.delete(t);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    });

            // Tạo tên file
            Path filePath = path.resolve(fileName);

            // Lưu file (tự động ghi đè nếu tồn tại)
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (Exception e) {
            throw new CustomException("Failed to upload file: " + e.getMessage());
        }
    }

    public void createFolder(String entity, Long id) throws CustomException {
        try {
            String path = Paths.get(defaultPath, entity, String.valueOf(id)).toAbsolutePath().toString();

            File directory = new File(path);
            if (!directory.exists()) {
                directory.mkdirs();
            } else {
                // Xóa tất cả file cũ trong thư mục
                Files.list(Paths.get(defaultPath, entity, String.valueOf(id)).toAbsolutePath())
                        .filter(Files::isRegularFile)
                        .forEach(t -> {
                            try {
                                Files.delete(t);
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                        });
            }
        } catch (Exception e) {
            throw new CustomException("Could not create folder");
        }
    }

    public void deleteFolder(String entity, Long id) throws IOException {
        String path = Paths.get(defaultPath, entity, String.valueOf(id)).toAbsolutePath().toString();

        Path folderPath = Paths.get(path);

        if (Files.exists(folderPath)) {
            Files.walk(folderPath)
                    .sorted(Comparator.reverseOrder())
                    .forEach(t -> {
                        try {
                            Files.delete(t);
                        } catch (IOException e) {
                            // TODO Auto-generated catch block
                            e.printStackTrace();
                        }
                    });
        }
    }

    @Scheduled(cron = "0 0/30 * * * ?")
    @Async
    public void autoCleanStorage() throws IOException {
        String[] entities = { "avatar", "background", "course", "lecture" };

        // chạy kiểm tra từng entity
        for (String entity : entities) {
            Path path = Paths.get(defaultPath, entity).toAbsolutePath();

            if (Files.exists(path) && Files.isDirectory(path)) {
                Files.list(path)
                        .filter(Files::isDirectory) // Chỉ lọc folder
                        .forEach(p -> {
                            // false
                            try {
                                if (!this.checkExist(entity, Long.valueOf(p.getFileName().toString()))) {

                                    Files.walk(p)
                                            .sorted(Comparator.reverseOrder())
                                            .forEach(t -> {
                                                try {
                                                    Files.delete(t);
                                                } catch (IOException e) {
                                                    // TODO Auto-generated catch block
                                                    e.printStackTrace();
                                                }
                                            });
                                }
                            } catch (IOException e) {
                                // TODO Auto-generated catch block
                                e.printStackTrace();
                            }
                        });
            }
        }

        System.out.println(">>>>>>>>>>>>>> CLEANED STORAGE SUCCESS: " + LocalDateTime.now());
    }

    private boolean checkExist(String entity, Long id) {
        switch (entity) {
            case "avatar":
                return this.userRepository.findById(id).isPresent();
            case "background":
                return this.userRepository.findById(id).isPresent();
            case "course":
                return this.courseRepository.findById(id).isPresent();
            case "lecture":
                return this.lectureRepository.findById(id).isPresent();
        }
        return false;
    }

}
