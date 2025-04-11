package com.vlearning.KLTN_final.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import com.vlearning.KLTN_final.domain.Coupon;
import com.vlearning.KLTN_final.domain.Field;
import com.vlearning.KLTN_final.domain.Skill;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.domain.Wallet;
import com.vlearning.KLTN_final.domain.dto.UserFields;
import com.vlearning.KLTN_final.domain.dto.UserSkills;
import com.vlearning.KLTN_final.domain.dto.request.InstructorRegisterReq;
import com.vlearning.KLTN_final.domain.dto.request.ReleaseCouponReq;
import com.vlearning.KLTN_final.domain.dto.response.BankLookupResponse;
import com.vlearning.KLTN_final.domain.dto.response.InstructorRegisterRes;
import com.vlearning.KLTN_final.domain.dto.response.ResultPagination;
import com.vlearning.KLTN_final.repository.CouponRepository;
import com.vlearning.KLTN_final.repository.FieldRepository;
import com.vlearning.KLTN_final.repository.SkillRepository;
import com.vlearning.KLTN_final.repository.UserRepository;
import com.vlearning.KLTN_final.repository.WalletRepository;
import com.vlearning.KLTN_final.util.constant.RoleEnum;
import com.vlearning.KLTN_final.util.exception.CustomException;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FieldRepository fieldRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private FileService fileService;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private CouponService couponService;

    @Autowired
    private WalletRepository walletRepository;

    @Value("${banklookup.api-key}")
    private String banklookupApiKey;

    @Value("${banklookup.api-secret}")
    private String banklookupApiSecret;

    private final WebClient webClient = WebClient.create();

    public User handleCreateUser(User user) throws CustomException {

        if (this.userRepository.findByEmail(user.getEmail()) != null) {
            throw new CustomException("User exist already!");
        }

        String passwordEncoded = encoder.encode(user.getPassword());
        user.setPassword(passwordEncoded);

        this.userRepository.save(user);

        if (user.getRole().equals(RoleEnum.STUDENT) || user.getRole().equals(RoleEnum.INSTRUCTOR)) {
            Coupon coupon = this.couponRepository.findByHeadCode("60CASHNEWUSER");
            List<User> users = Collections.singletonList(user);
            this.couponService.handleReleaseCoupon(new ReleaseCouponReq(coupon, users));
        }

        return user;
    }

    public User handleFetchUser(Long id) throws CustomException {
        if (!this.userRepository.findById(id).isPresent()) {
            throw new CustomException("User not found");
        }

        return this.userRepository.findById(id).isPresent() ? this.userRepository.findById(id).get() : null;
    }

    public User handleGetUserByUsername(String username) throws CustomException {
        if (this.userRepository.findByEmail(username) == null) {
            throw new CustomException("User not found");
        }
        return this.userRepository.findByEmail(username);
    }

    public ResultPagination handleFetchSeveralUser(Specification<User> spec, Pageable pageable) {

        Page<User> page = this.userRepository.findAll(spec, pageable);

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

    public void handleDeleteUser(Long id) throws CustomException, IOException {
        if (!this.userRepository.findById(id).isPresent()) {
            throw new CustomException("User not found");
        }

        User user = this.userRepository.findById(id).get();
        if (user.getRole().equals(RoleEnum.ROOT)) {
            throw new CustomException("You can't delete this user");
        }

        this.userRepository.deleteById(id);
    }

    public void handleDeleteSeveralUsers(Long[] users) {
        for (Long id : users) {
            if (this.userRepository.findById(id).isPresent()) {
                User user = this.userRepository.findById(id).get();
                if (!user.getRole().equals(RoleEnum.ROOT)) {
                    this.userRepository.deleteById(id);
                }
            }
        }
    }

    public User handleUpdateUser(User user) throws CustomException {
        User userDB = this.handleFetchUser(user.getId());

        // role
        if (user.getRole() != null) {
            userDB.setRole(user.getRole());
        }

        // full name
        if (user.getFullName() != null && !user.getFullName().equals("")) {
            userDB.setFullName(user.getFullName());
        }

        // bio
        if (user.getBio() != null && !user.getBio().equals("")) {
            userDB.setBio(user.getBio());
        }

        // address
        if (user.getAddress() != null && !user.getAddress().equals("")) {
            userDB.setAddress(user.getAddress());
        }

        // phone
        if (user.getPhone() != null && !user.getPhone().equals("")) {
            userDB.setPhone(user.getPhone());
        }

        return this.userRepository.save(userDB);
    }

    // update active
    public User handleUpdateActiveUser(long id) throws CustomException {
        if (!this.userRepository.findById(id).isPresent()) {
            throw new CustomException("User not found");
        }

        User user = this.userRepository.findById(id).get();
        if (!user.getRole().equals(RoleEnum.ROOT)) {
            user.setActive(!user.isActive());
        } else {
            user.setActive(true);
        }

        return this.userRepository.save(user);
    }

    // update protect
    public User handleUpdateProtectUser(long id) throws CustomException {
        if (!this.userRepository.findById(id).isPresent()) {
            throw new CustomException("User not found");
        }

        User user = this.userRepository.findById(id).get();
        user.setProtect(!user.isProtect());

        return this.userRepository.save(user);
    }

    public User handleUpdateUserImage(String entity, long id, MultipartFile file) throws CustomException {
        if (!this.userRepository.findById(id).isPresent()) {
            throw new CustomException("User not found");
        }

        User user = this.userRepository.findById(id).get();
        if (entity.equals("avatar")) {
            user.setAvatar(this.fileService.uploadFile(file, entity, id));
        } else if (entity.equals("background")) {
            user.setBackground(this.fileService.uploadFile(file, entity, id));
        } else {
            throw new CustomException("Wrong entity");
        }

        return this.userRepository.save(user);
    }

    public User handleUpdateUserPassword(User user) throws CustomException {
        if (!this.userRepository.findById(user.getId()).isPresent()) {
            throw new CustomException("User not found");
        }

        User userDB = this.userRepository.findById(user.getId()).get();
        String encodedPass = this.encoder.encode(user.getPassword());
        userDB.setPassword(encodedPass);

        return this.userRepository.save(userDB);
    }

    public UserFields handlePostUserFields(UserFields req) throws CustomException {

        if (!this.userRepository.findById(req.getUser().getId()).isPresent()) {
            throw new CustomException("User not found");
        }

        User user = this.userRepository.findById(req.getUser().getId()).get();
        List<Field> fields = new ArrayList<>();
        for (Field field : req.getFields()) {
            if (this.fieldRepository.findById(field.getId()).isPresent()) {
                field = this.fieldRepository.findById(field.getId()).get();
                fields.add(field);
            }
        }

        if (fields != null && fields.size() > 0) {
            user.setFields(fields);
            this.userRepository.save(user);
            req.setUser(user);
            req.setFields(fields);
            return req;
        } else {
            throw new CustomException("Field not found");
        }
    }

    public UserSkills handlePostUserSkills(UserSkills req) throws CustomException {

        if (!this.userRepository.findById(req.getUser().getId()).isPresent()) {
            throw new CustomException("User not found");
        }

        User user = this.userRepository.findById(req.getUser().getId()).get();
        List<Field> fields = user.getFields();
        if (fields != null && fields.size() > 0) {
            List<Skill> skills = new ArrayList<>();
            for (Skill skill : req.getSkills()) {
                if (this.skillRepository.findById(skill.getId()).isPresent()) {
                    skill = this.skillRepository.findById(skill.getId()).get();
                    for (Field field : user.getFields()) {
                        if (field.getSkills().contains(skill)) {
                            skills.add(skill);
                        }
                    }
                }
            }

            if (skills != null && skills.size() > 0) {
                user.setSkills(skills);
                this.userRepository.save(user);

                req.setUser(user);
                req.setSkills(skills);
                return req;
            } else {
                throw new CustomException("Skill not found");
            }
        } else {
            throw new CustomException("User's field is null");
        }
    }

    public void handleUpdateSingleField(Long id, Long fieldID) throws CustomException {
        if (!this.userRepository.findById(id).isPresent()) {
            throw new CustomException("User not found");
        }

        if (!this.fieldRepository.findById(fieldID).isPresent()) {
            throw new CustomException("Field not found");
        }

        User user = this.userRepository.findById(id).get();
        Field field = this.fieldRepository.findById(fieldID).get();

        if (!user.getFields().contains(field)) {
            user.getFields().add(field);
        } else {
            user.getFields().remove(field);
            field.getSkills().forEach(s -> user.getSkills().remove(s));
        }

        this.userRepository.save(user);
    }

    public void handleUpdateSingleSkill(Long id, Long skillID) throws CustomException {
        if (!this.userRepository.findById(id).isPresent()) {
            throw new CustomException("User not found");
        }

        if (!this.skillRepository.findById(skillID).isPresent()) {
            throw new CustomException("Skill not found");
        }

        User user = this.userRepository.findById(id).get();
        Skill skill = this.skillRepository.findById(skillID).get();

        if (user.getSkills().contains(skill)) {
            user.getSkills().remove(skill);
        } else {
            user.getSkills().add(skill);
            Field field = skill.getField();
            if (!user.getFields().contains(field))
                user.getFields().add(field);
        }

        this.userRepository.save(user);
    }

    @Transactional
    public InstructorRegisterRes handleInstructorRegister(InstructorRegisterReq req) throws CustomException {

        User user = this.handleFetchUser(req.getId());
        user.setFullName(req.getFullName());
        user.setBio(req.getBio());
        user.setAddress(req.getAddress());
        user.setPhone(req.getPhone());
        if (user.getRole().equals(RoleEnum.STUDENT)) {
            user.setRole(RoleEnum.INSTRUCTOR);
        }

        this.userRepository.save(user);
        Wallet wallet;
        try {

            BankLookupResponse res = webClient.post()
                    .uri("https://api.banklookup.net/api/bank/id-lookup-prod")
                    .header("x-api-key", banklookupApiKey)
                    .header("x-api-secret", banklookupApiSecret)
                    .bodyValue(req.getBankInformation())
                    .retrieve()
                    .bodyToMono(BankLookupResponse.class)
                    .block();

            wallet = Wallet.builder()
                    .bank(req.getBankInformation().getBank())
                    .accountNumber(req.getBankInformation().getAccount())
                    .accountName(res.getData().getOwnerName())
                    .user(user)
                    .build();

            this.walletRepository.save(wallet);
        } catch (Exception e) {
            throw new CustomException("Bank account not found");
        }

        InstructorRegisterRes res = InstructorRegisterRes.builder().user(user).wallet(wallet).build();

        return res;
    }
}
