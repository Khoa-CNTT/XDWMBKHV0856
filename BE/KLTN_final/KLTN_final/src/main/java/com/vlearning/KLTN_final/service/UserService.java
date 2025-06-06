package com.vlearning.KLTN_final.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.vlearning.KLTN_final.domain.Coupon;
import com.vlearning.KLTN_final.domain.Course;
import com.vlearning.KLTN_final.domain.Field;
import com.vlearning.KLTN_final.domain.Order;
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
import com.vlearning.KLTN_final.domain.dto.response.UserDetails;
import com.vlearning.KLTN_final.repository.CouponRepository;
import com.vlearning.KLTN_final.repository.FieldRepository;
import com.vlearning.KLTN_final.repository.OrderRepository;
import com.vlearning.KLTN_final.repository.SkillRepository;
import com.vlearning.KLTN_final.repository.UserRepository;
import com.vlearning.KLTN_final.util.constant.OrderStatus;
import com.vlearning.KLTN_final.util.constant.RoleEnum;
import com.vlearning.KLTN_final.util.exception.AnonymousUserException;
import com.vlearning.KLTN_final.util.exception.CustomException;
import com.vlearning.KLTN_final.util.security.SecurityUtil;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseService courseService;

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
    private WalletService walletService;

    @Autowired
    private OrderRepository orderRepository;

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

    public UserDetails handleFetchUserDetails(Long id) throws CustomException {
        if (!this.userRepository.findById(id).isPresent()) {
            throw new CustomException("User not found");
        }

        User user = this.userRepository.findById(id).get();

        List<Course> boughtCourses = new ArrayList<>();
        List<Order> orders = this.orderRepository.findAllByBuyer(user);
        for (Order order : orders) {
            if (order.getStatus().equals(OrderStatus.PAID)) {
                boughtCourses.add(order.getCourse());
            }
        }

        // Tạo UserDetails từ User
        UserDetails userDetails = UserDetails.builder()
                .id(user.getId())
                .email(user.getEmail())
                .password(user.getPassword())
                .role(user.getRole())
                .fullName(user.getFullName())
                .bio(user.getBio())
                .avatar(user.getAvatar())
                .background(user.getBackground())
                .address(user.getAddress())
                .phone(user.getPhone())
                .active(user.isActive())
                .protect(user.isProtect())
                .fields(user.getFields())
                .skills(user.getSkills())
                .ownCourses(user.getOwnCourses())
                .boughtCourses(boughtCourses)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();

        return userDetails;
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

    private void deleteRelatedPartsOfUser(User user) throws CustomException {
        // clear liên kết Field và Skill
        user.getFields().clear();
        user.getSkills().clear();

        // xóa từng course một cách an toàn
        for (Course course : user.getOwnCourses()) {
            this.courseService.handleDeleteCourse(course.getId());
        }
        user.getOwnCourses().clear(); // quan trọng để tránh lỗi khóa ngoại

        // xoa wishlist
        user.getWishlist().getCourses().clear();

        userRepository.save(user); // lưu thay đổi để clear joinTable
    }

    public void handleDeleteUser(Long id) throws CustomException, AnonymousUserException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new CustomException("User not found"));

        if (user.getRole().equals(RoleEnum.ROOT)) {
            throw new CustomException("You can't delete this user");
        } else if (user.getRole().equals(RoleEnum.ADMIN)) {

            String email = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get()
                    : "";

            if (email.equals("anonymousUser"))
                throw new AnonymousUserException();

            User loginUser = this.handleGetUserByUsername(email);

            if (!loginUser.getRole().equals(RoleEnum.ROOT))
                throw new CustomException("You don't have permission");

        }

        this.deleteRelatedPartsOfUser(user);

        userRepository.delete(user);
    }

    @Transactional
    public void handleDeleteSeveralUsers(Long[] users) throws CustomException, AnonymousUserException {
        for (Long id : users) {
            if (this.userRepository.findById(id).isPresent()) {
                User user = this.userRepository.findById(id).get();
                if (!user.getRole().equals(RoleEnum.ROOT)) {
                    this.handleDeleteUser(id);
                }
            }
        }
    }

    @Transactional
    public User handleUpdateUser(User user) throws CustomException, AnonymousUserException {
        User userDB = this.handleFetchUser(user.getId());

        if (userDB.getRole().equals(RoleEnum.ROOT)) {

            String email = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get()
                    : "";

            if (email.equals("anonymousUser"))
                throw new AnonymousUserException();

            User loginUser = this.handleGetUserByUsername(email);

            if (!loginUser.getId().equals(userDB.getId())) {
                throw new CustomException("You don't have permission");
            }

        }

        if (userDB.getRole().equals(RoleEnum.ADMIN)) {

            String email = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get()
                    : "";

            if (email.equals("anonymousUser"))
                throw new AnonymousUserException();

            User loginUser = this.handleGetUserByUsername(email);

            if (!loginUser.getRole().equals(RoleEnum.ROOT) && !loginUser.getId().equals(userDB.getId())) {
                throw new CustomException("You don't have permission");
            }

        }

        // role
        if (!userDB.getRole().equals(RoleEnum.ROOT))
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

        BankLookupResponse checkRes = this.walletService.handleCheckBankAccount(req.getBankInformation());

        Wallet wallet = new Wallet();
        if (user.getWallet() == null) {
            wallet.setUser(user);
        } else {
            wallet = user.getWallet();
        }

        wallet.setBank(req.getBankInformation().getBank());
        wallet.setAccountNumber(req.getBankInformation().getAccount());
        wallet.setAccountName(checkRes.getData().getOwnerName());

        // this.walletRepository.save(wallet);
        user.setWallet(wallet);
        this.userRepository.save(user);

        InstructorRegisterRes res = InstructorRegisterRes.builder().user(user).wallet(wallet).build();

        return res;
    }

}
