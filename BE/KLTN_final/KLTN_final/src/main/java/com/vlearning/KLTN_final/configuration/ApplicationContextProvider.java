package com.vlearning.KLTN_final.configuration;

import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/*
ApplicationContext là container trung tâm trong Spring Framework, chịu trách nhiệm:

Quản lý Bean: Tạo, khởi tạo, quản lý vòng đời các Bean.

Dependency Injection (DI): Inject các Bean vào nơi cần dùng.

Event Propagation: Phát tán các sự kiện trong ứng dụng.

Resource Loading: Truy xuất các tài nguyên (resources).


Khi bạn gọi new FileService(), bạn tạo thủ công nên Spring không quản lý đối tượng này.

Vì vậy, @Value("${storage-default-path}") không được inject → defaultPath = null.

Khi gọi createFolder(), gặp NullPointerException.


 */

@Component
public class ApplicationContextProvider implements ApplicationContextAware {
    private static ApplicationContext context;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) {
        context = applicationContext;
    }

    public static ApplicationContext getApplicationContext() {
        return context;
    }
}
