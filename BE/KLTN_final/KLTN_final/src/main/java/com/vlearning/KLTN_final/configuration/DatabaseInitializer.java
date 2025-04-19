package com.vlearning.KLTN_final.configuration;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.vlearning.KLTN_final.domain.Coupon;
import com.vlearning.KLTN_final.domain.Field;
import com.vlearning.KLTN_final.domain.Skill;
import com.vlearning.KLTN_final.domain.User;
import com.vlearning.KLTN_final.repository.CouponRepository;
import com.vlearning.KLTN_final.repository.FieldRepository;
import com.vlearning.KLTN_final.repository.SkillRepository;
import com.vlearning.KLTN_final.repository.UserRepository;
import com.vlearning.KLTN_final.util.constant.DiscountType;
import com.vlearning.KLTN_final.util.constant.RoleEnum;

@Service
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private FieldRepository fieldRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println(">>> START INIT DATABASE");

        List<User> rootUsers = this.userRepository.findAllByRole(RoleEnum.ROOT);
        if (rootUsers == null || rootUsers.size() == 0) {
            User root = User.builder()
                    .email("huuthangfw@gmail.com")
                    .password(passwordEncoder.encode("123456789"))
                    .fullName("IAMROOT")
                    .role(RoleEnum.ROOT)
                    .protect(true)
                    .build();

            this.userRepository.save(root);
        }

        List<User> adminUsers = this.userRepository.findAllByRole(RoleEnum.ADMIN);
        if (adminUsers == null || adminUsers.size() == 0) {
            User admin = User.builder()
                    .email("odinkun20303@gmail.com")
                    .password(passwordEncoder.encode("123456789"))
                    .fullName("ADMIN")
                    .role(RoleEnum.ADMIN)
                    .protect(true)
                    .build();

            this.userRepository.save(admin);
        }

        // create coupon
        List<Coupon> coupons = new ArrayList<>();

        if (this.couponRepository.findByHeadCode("FREE") == null) {
            Coupon coupon = new Coupon();

            coupon.setHeadCode("FREE");
            coupon.setDescription("Free discount");
            coupon.setDiscountType(DiscountType.PERCENT);
            coupon.setValue(100);
            coupon.setDayDuration(30L);

            coupons.add(coupon);
        }

        if (this.couponRepository.findByHeadCode("5PERCENTMONTHLY") == null) {
            Coupon coupon = new Coupon();

            coupon.setHeadCode("5PERCENTMONTHLY");
            coupon.setDescription("5% discount for you every month");
            coupon.setDiscountType(DiscountType.PERCENT);
            coupon.setValue(5);
            coupon.setDayDuration(10L);

            coupons.add(coupon);
        }

        if (this.couponRepository.findByHeadCode("60CASHNEWUSER") == null) {
            Coupon coupon = new Coupon();

            coupon.setHeadCode("60CASHNEWUSER");
            coupon.setDescription("60000 VND discount for your first stand");
            coupon.setDiscountType(DiscountType.FIXED);
            coupon.setValue(60000);
            coupon.setDayDuration(10L);

            coupons.add(coupon);
        }

        this.couponRepository.saveAll(coupons);

        // create field & skill

        if (this.fieldRepository.findAll().size() == 0) {
            if (this.fieldRepository.findByName("Web Development") == null) {
                Field field = Field.builder().name("Web Development").build();
                this.fieldRepository.save(field);

                List<Skill> skills = new ArrayList<>();
                if (this.skillRepository.findByName("HTML, CSS, JavaScript") == null) {
                    Skill skill = Skill.builder().name("HTML, CSS, JavaScript").field(field).build();
                    skills.add(skill);
                }

                if (this.skillRepository.findByName("React, Vue.js, Angular") == null) {
                    Skill skill = Skill.builder().name("React, Vue.js, Angular").field(field).build();
                    skills.add(skill);
                }

                if (this.skillRepository.findByName("Node.js, Express.js") == null) {
                    Skill skill = Skill.builder().name("Node.js, Express.js").field(field).build();
                    skills.add(skill);
                }

                if (this.skillRepository.findByName("REST API, GraphQL") == null) {
                    Skill skill = Skill.builder().name("REST API, GraphQL").field(field).build();
                    skills.add(skill);
                }

                if (this.skillRepository.findByName("Responsive Design") == null) {
                    Skill skill = Skill.builder().name("Responsive Design").field(field).build();
                    skills.add(skill);
                }

                if (this.skillRepository.findByName("Bootstrap, Tailwind CSS") == null) {
                    Skill skill = Skill.builder().name("Bootstrap, Tailwind CSS").field(field).build();
                    skills.add(skill);
                }

                if (this.skillRepository.findByName("Webpack, Vite") == null) {
                    Skill skill = Skill.builder().name("Webpack, Vite").field(field).build();
                    skills.add(skill);
                }

                this.skillRepository.saveAll(skills);

            }

            // --- Mobile Development ---
            if (this.fieldRepository.findByName("Mobile Development") == null) {
                Field field = Field.builder().name("Mobile Development").build();
                this.fieldRepository.save(field);

                List<Skill> skills = new ArrayList<>();
                if (this.skillRepository.findByName("Java, Kotlin (Android)") == null) {
                    Skill skill = Skill.builder().name("Java, Kotlin (Android)").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Swift (iOS)") == null) {
                    Skill skill = Skill.builder().name("Swift (iOS)").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Flutter, React Native") == null) {
                    Skill skill = Skill.builder().name("Flutter, React Native").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Firebase") == null) {
                    Skill skill = Skill.builder().name("Firebase").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Mobile UI/UX") == null) {
                    Skill skill = Skill.builder().name("Mobile UI/UX").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Push Notification") == null) {
                    Skill skill = Skill.builder().name("Push Notification").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("App Store / Play Store Deployment") == null) {
                    Skill skill = Skill.builder().name("App Store / Play Store Deployment").field(field).build();
                    skills.add(skill);
                }
                this.skillRepository.saveAll(skills);
            }

            // --- Backend Development ---
            if (this.fieldRepository.findByName("Backend Development") == null) {
                Field field = Field.builder().name("Backend Development").build();
                this.fieldRepository.save(field);

                List<Skill> skills = new ArrayList<>();
                if (this.skillRepository.findByName("Node.js, Django, Flask, Spring Boot") == null) {
                    Skill skill = Skill.builder().name("Node.js, Django, Flask, Spring Boot").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("RESTful API") == null) {
                    Skill skill = Skill.builder().name("RESTful API").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("JWT, OAuth2") == null) {
                    Skill skill = Skill.builder().name("JWT, OAuth2").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Authentication & Authorization") == null) {
                    Skill skill = Skill.builder().name("Authentication & Authorization").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("File upload, Email service") == null) {
                    Skill skill = Skill.builder().name("File upload, Email service").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Error Handling, Middleware") == null) {
                    Skill skill = Skill.builder().name("Error Handling, Middleware").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Rate limiting, CORS, CSRF") == null) {
                    Skill skill = Skill.builder().name("Rate limiting, CORS, CSRF").field(field).build();
                    skills.add(skill);
                }
                this.skillRepository.saveAll(skills);
            }

            // --- Database ---
            if (this.fieldRepository.findByName("Database") == null) {
                Field field = Field.builder().name("Database").build();
                this.fieldRepository.save(field);

                List<Skill> skills = new ArrayList<>();
                if (this.skillRepository.findByName("SQL: MySQL, PostgreSQL") == null) {
                    Skill skill = Skill.builder().name("SQL: MySQL, PostgreSQL").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("NoSQL: MongoDB, Redis") == null) {
                    Skill skill = Skill.builder().name("NoSQL: MongoDB, Redis").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Database Design (ERD)") == null) {
                    Skill skill = Skill.builder().name("Database Design (ERD)").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Query Optimization") == null) {
                    Skill skill = Skill.builder().name("Query Optimization").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Backup & Restore") == null) {
                    Skill skill = Skill.builder().name("Backup & Restore").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("ORM: Sequelize, Hibernate") == null) {
                    Skill skill = Skill.builder().name("ORM: Sequelize, Hibernate").field(field).build();
                    skills.add(skill);
                }
                this.skillRepository.saveAll(skills);
            }

            // --- DevOps / Deployment ---
            if (this.fieldRepository.findByName("DevOps / Deployment") == null) {
                Field field = Field.builder().name("DevOps / Deployment").build();
                this.fieldRepository.save(field);

                List<Skill> skills = new ArrayList<>();
                if (this.skillRepository.findByName("Git, GitHub, GitLab") == null) {
                    Skill skill = Skill.builder().name("Git, GitHub, GitLab").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Docker, Docker Compose") == null) {
                    Skill skill = Skill.builder().name("Docker, Docker Compose").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("CI/CD: GitHub Actions, GitLab CI") == null) {
                    Skill skill = Skill.builder().name("CI/CD: GitHub Actions, GitLab CI").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Linux, Nginx") == null) {
                    Skill skill = Skill.builder().name("Linux, Nginx").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Cloud Hosting: AWS, Heroku, Vercel") == null) {
                    Skill skill = Skill.builder().name("Cloud Hosting: AWS, Heroku, Vercel").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("PM2, Load balancing") == null) {
                    Skill skill = Skill.builder().name("PM2, Load balancing").field(field).build();
                    skills.add(skill);
                }
                this.skillRepository.saveAll(skills);
            }

            // --- UI/UX Design ---
            if (this.fieldRepository.findByName("UI/UX Design") == null) {
                Field field = Field.builder().name("UI/UX Design").build();
                this.fieldRepository.save(field);

                List<Skill> skills = new ArrayList<>();
                if (this.skillRepository.findByName("Wireframing, Prototyping") == null) {
                    Skill skill = Skill.builder().name("Wireframing, Prototyping").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Figma, Adobe XD") == null) {
                    Skill skill = Skill.builder().name("Figma, Adobe XD").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Responsive Design") == null) {
                    Skill skill = Skill.builder().name("Responsive Design").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Accessibility") == null) {
                    Skill skill = Skill.builder().name("Accessibility").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Design Systems") == null) {
                    Skill skill = Skill.builder().name("Design Systems").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Usability Testing") == null) {
                    Skill skill = Skill.builder().name("Usability Testing").field(field).build();
                    skills.add(skill);
                }
                this.skillRepository.saveAll(skills);
            }

            // --- Cybersecurity ---
            if (this.fieldRepository.findByName("Cybersecurity") == null) {
                Field field = Field.builder().name("Cybersecurity").build();
                this.fieldRepository.save(field);

                List<Skill> skills = new ArrayList<>();
                if (this.skillRepository.findByName("Hashing: bcrypt, SHA256") == null) {
                    Skill skill = Skill.builder().name("Hashing: bcrypt, SHA256").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("HTTPS, SSL") == null) {
                    Skill skill = Skill.builder().name("HTTPS, SSL").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("SQL Injection, XSS, CSRF") == null) {
                    Skill skill = Skill.builder().name("SQL Injection, XSS, CSRF").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Firewall, Network Security") == null) {
                    Skill skill = Skill.builder().name("Firewall, Network Security").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Penetration Testing") == null) {
                    Skill skill = Skill.builder().name("Penetration Testing").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("OWASP Top 10") == null) {
                    Skill skill = Skill.builder().name("OWASP Top 10").field(field).build();
                    skills.add(skill);
                }
                this.skillRepository.saveAll(skills);
            }

            // --- Machine Learning / AI ---
            if (this.fieldRepository.findByName("Machine Learning / AI") == null) {
                Field field = Field.builder().name("Machine Learning / AI").build();
                this.fieldRepository.save(field);

                List<Skill> skills = new ArrayList<>();
                if (this.skillRepository.findByName("Python") == null) {
                    Skill skill = Skill.builder().name("Python").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Scikit-learn, TensorFlow, PyTorch") == null) {
                    Skill skill = Skill.builder().name("Scikit-learn, TensorFlow, PyTorch").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Supervised & Unsupervised Learning") == null) {
                    Skill skill = Skill.builder().name("Supervised & Unsupervised Learning").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Regression, Classification, Clustering") == null) {
                    Skill skill = Skill.builder().name("Regression, Classification, Clustering").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Model Evaluation") == null) {
                    Skill skill = Skill.builder().name("Model Evaluation").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Jupyter Notebook") == null) {
                    Skill skill = Skill.builder().name("Jupyter Notebook").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Data Preprocessing") == null) {
                    Skill skill = Skill.builder().name("Data Preprocessing").field(field).build();
                    skills.add(skill);
                }
                this.skillRepository.saveAll(skills);
            }

            // --- Data Science ---
            if (this.fieldRepository.findByName("Data Science") == null) {
                Field field = Field.builder().name("Data Science").build();
                this.fieldRepository.save(field);

                List<Skill> skills = new ArrayList<>();
                if (this.skillRepository.findByName("Python, R") == null) {
                    Skill skill = Skill.builder().name("Python, R").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Pandas, NumPy") == null) {
                    Skill skill = Skill.builder().name("Pandas, NumPy").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Matplotlib, Seaborn") == null) {
                    Skill skill = Skill.builder().name("Matplotlib, Seaborn").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Data Cleaning") == null) {
                    Skill skill = Skill.builder().name("Data Cleaning").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Exploratory Data Analysis (EDA)") == null) {
                    Skill skill = Skill.builder().name("Exploratory Data Analysis (EDA)").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("SQL for Data") == null) {
                    Skill skill = Skill.builder().name("SQL for Data").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Power BI, Tableau") == null) {
                    Skill skill = Skill.builder().name("Power BI, Tableau").field(field).build();
                    skills.add(skill);
                }
                this.skillRepository.saveAll(skills);
            }

            // --- Cloud Computing ---
            if (this.fieldRepository.findByName("Cloud Computing") == null) {
                Field field = Field.builder().name("Cloud Computing").build();
                this.fieldRepository.save(field);

                List<Skill> skills = new ArrayList<>();
                if (this.skillRepository.findByName("AWS, Google Cloud, Azure") == null) {
                    Skill skill = Skill.builder().name("AWS, Google Cloud, Azure").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("EC2, S3, Lambda") == null) {
                    Skill skill = Skill.builder().name("EC2, S3, Lambda").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Cloud Functions") == null) {
                    Skill skill = Skill.builder().name("Cloud Functions").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Firebase Hosting") == null) {
                    Skill skill = Skill.builder().name("Firebase Hosting").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Serverless Architecture") == null) {
                    Skill skill = Skill.builder().name("Serverless Architecture").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("CI/CD Integration") == null) {
                    Skill skill = Skill.builder().name("CI/CD Integration").field(field).build();
                    skills.add(skill);
                }
                this.skillRepository.saveAll(skills);
            }

            // --- Game Development ---
            if (this.fieldRepository.findByName("Game Development") == null) {
                Field field = Field.builder().name("Game Development").build();
                this.fieldRepository.save(field);

                List<Skill> skills = new ArrayList<>();
                if (this.skillRepository.findByName("Unity (C#)") == null) {
                    Skill skill = Skill.builder().name("Unity (C#)").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Unreal Engine (C++)") == null) {
                    Skill skill = Skill.builder().name("Unreal Engine (C++)").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("2D/3D Graphics") == null) {
                    Skill skill = Skill.builder().name("2D/3D Graphics").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Game Physics, Animation") == null) {
                    Skill skill = Skill.builder().name("Game Physics, Animation").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Game Loop, Input Handling") == null) {
                    Skill skill = Skill.builder().name("Game Loop, Input Handling").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Asset Management") == null) {
                    Skill skill = Skill.builder().name("Asset Management").field(field).build();
                    skills.add(skill);
                }
                this.skillRepository.saveAll(skills);
            }

            // --- Internet of Things (IoT) ---
            if (this.fieldRepository.findByName("Internet of Things (IoT)") == null) {
                Field field = Field.builder().name("Internet of Things (IoT)").build();
                this.fieldRepository.save(field);

                List<Skill> skills = new ArrayList<>();
                if (this.skillRepository.findByName("Arduino, ESP32") == null) {
                    Skill skill = Skill.builder().name("Arduino, ESP32").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("C/C++, MicroPython") == null) {
                    Skill skill = Skill.builder().name("C/C++, MicroPython").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("MQTT, HTTP Protocols") == null) {
                    Skill skill = Skill.builder().name("MQTT, HTTP Protocols").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Sensor Programming") == null) {
                    Skill skill = Skill.builder().name("Sensor Programming").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Real-time Data Logging") == null) {
                    Skill skill = Skill.builder().name("Real-time Data Logging").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Cloud Integration") == null) {
                    Skill skill = Skill.builder().name("Cloud Integration").field(field).build();
                    skills.add(skill);
                }
                this.skillRepository.saveAll(skills);
            }

            // --- Programming Languages ---
            if (this.fieldRepository.findByName("Programming Languages") == null) {
                Field field = Field.builder().name("Programming Languages").build();
                this.fieldRepository.save(field);

                List<Skill> skills = new ArrayList<>();
                if (this.skillRepository.findByName("Python, Java, C, C++, C#") == null) {
                    Skill skill = Skill.builder().name("Python, Java, C, C++, C#").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("JavaScript, TypeScript") == null) {
                    Skill skill = Skill.builder().name("JavaScript, TypeScript").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Go, Rust, Ruby, PHP") == null) {
                    Skill skill = Skill.builder().name("Go, Rust, Ruby, PHP").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Shell Scripting") == null) {
                    Skill skill = Skill.builder().name("Shell Scripting").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Functional & Object-Oriented Programming") == null) {
                    Skill skill = Skill.builder().name("Functional & Object-Oriented Programming").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Language-specific Tools & IDEs") == null) {
                    Skill skill = Skill.builder().name("Language-specific Tools & IDEs").field(field).build();
                    skills.add(skill);
                }
                this.skillRepository.saveAll(skills);
            }

            // --- Software Testing ---
            if (this.fieldRepository.findByName("Software Testing") == null) {
                Field field = Field.builder().name("Software Testing").build();
                this.fieldRepository.save(field);

                List<Skill> skills = new ArrayList<>();
                if (this.skillRepository.findByName("Unit Testing, Integration Testing") == null) {
                    Skill skill = Skill.builder().name("Unit Testing, Integration Testing").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Selenium, JUnit, TestNG") == null) {
                    Skill skill = Skill.builder().name("Selenium, JUnit, TestNG").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Mocha, Chai, Jest") == null) {
                    Skill skill = Skill.builder().name("Mocha, Chai, Jest").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Test Automation") == null) {
                    Skill skill = Skill.builder().name("Test Automation").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Manual Testing") == null) {
                    Skill skill = Skill.builder().name("Manual Testing").field(field).build();
                    skills.add(skill);
                }
                if (this.skillRepository.findByName("Test Coverage & Reporting") == null) {
                    Skill skill = Skill.builder().name("Test Coverage & Reporting").field(field).build();
                    skills.add(skill);
                }
                this.skillRepository.saveAll(skills);
            }
        }
    }

}
