import React from "react";

const Setting = () => {

    const UserProfilePage = () => {
        const userData = {
            name: "Sarah Anderson",
            role: "Full Stack Developer",
            bio: "Passionate about web development and continuous learning",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
            stats: {
                coursesEnrolled: 12,
                coursesCompleted: 8,
                learningHours: 156,
                skillBadges: 15,
            },
            courses: [
                {
                    id: 1,
                    title: "Advanced React Patterns",
                    progress: 75,
                    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
                },
                {
                    id: 2,
                    title: "Node.js Masterclass",
                    progress: 45,
                    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9",
                },
                {
                    id: 3,
                    title: "Python Data Science",
                    progress: 90,
                    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935",
                },
            ],
            recommendations: [
                {
                    id: 1,
                    title: "GraphQL Advanced Concepts",
                    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea",
                },
                {
                    id: 2,
                    title: "AWS Cloud Architecture",
                    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
                },
            ],
        };

        const chartData = {
            labels: ["Completed", "In Progress"],
            datasets: [
                {
                    data: [
                        userData.stats.coursesCompleted,
                        userData.stats.coursesEnrolled - userData.stats.coursesCompleted,
                    ],
                    backgroundColor: ["#4CAF50", "#FF6F61"],
                    borderWidth: 0,
                },
            ],
        };

        return (
            <div className="min-h-screen bg-background my-16">
                <div className="container mx-auto px-4 py-8">
                    {/* Profile Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-lg shadow-sm p-6 mb-8"
                    >
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <motion.img
                                whileHover={{ scale: 1.05 }}
                                src={userData.avatar}
                                alt="Profile"
                                className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                            />
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-heading font-heading text-foreground">
                                    {userData.name}
                                </h1>
                                <p className="text-accent mt-2">{userData.role}</p>
                                <p className="text-muted-foreground mt-2">{userData.bio}</p>
                                <div className="flex gap-4 mt-4 justify-center md:justify-start">
                                    <motion.button whileHover={{ scale: 1.1 }}>
                                        <FaLinkedin className="text-2xl text-accent hover:text-primary" />
                                    </motion.button>
                                    <motion.button whileHover={{ scale: 1.1 }}>
                                        <FaTwitter className="text-2xl text-accent hover:text-primary" />
                                    </motion.button>
                                    <motion.button whileHover={{ scale: 1.1 }}>
                                        <FaGithub className="text-2xl text-accent hover:text-primary" />
                                    </motion.button>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
                                >
                                    Edit Profile
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Statistics Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                    >
                        <div className="bg-card p-6 rounded-lg shadow-sm">
                            <h3 className="text-accent mb-2">Courses Enrolled</h3>
                            <p className="text-3xl font-bold text-foreground">
                                {userData.stats.coursesEnrolled}
                            </p>
                        </div>
                        <div className="bg-card p-6 rounded-lg shadow-sm">
                            <h3 className="text-accent mb-2">Courses Completed</h3>
                            <p className="text-3xl font-bold text-foreground">
                                {userData.stats.coursesCompleted}
                            </p>
                        </div>
                        <div className="bg-card p-6 rounded-lg shadow-sm">
                            <h3 className="text-accent mb-2">Learning Hours</h3>
                            <p className="text-3xl font-bold text-foreground">
                                {userData.stats.learningHours}
                            </p>
                        </div>
                        <div className="bg-card p-6 rounded-lg shadow-sm">
                            <h3 className="text-accent mb-2">Skill Badges</h3>
                            <p className="text-3xl font-bold text-foreground">
                                {userData.stats.skillBadges}
                            </p>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Course Progress */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-2"
                        >
                            <h2 className="text-heading font-heading mb-6">Current Courses</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {userData.courses.map((course) => (
                                    <motion.div
                                        key={course.id}
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-card rounded-lg overflow-hidden shadow-sm cursor-pointer"
                                    >
                                        <img
                                            src={course.image}
                                            alt={course.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4">
                                            <h3 className="text-foreground font-semibold mb-2">
                                                {course.title}
                                            </h3>
                                            <div className="w-full bg-secondary rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full"
                                                    style={{ width: `${course.progress}%` }}
                                                />
                                            </div>
                                            <p className="text-accent mt-2">
                                                {course.progress}% Complete
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Progress Chart */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-card p-6 rounded-lg shadow-sm"
                        >
                            <h2 className="text-heading font-heading mb-6">
                                Learning Progress
                            </h2>
                            <div className="w-full max-w-xs mx-auto">
                                <Doughnut data={chartData} options={{ responsive: true }} />
                            </div>
                        </motion.div>
                    </div>

                    {/* Recommended Courses */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8"
                    >
                        <h2 className="text-heading font-heading mb-6">
                            Recommended for You
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {userData.recommendations.map((course) => (
                                <motion.div
                                    key={course.id}
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-card rounded-lg overflow-hidden shadow-sm cursor-pointer"
                                >
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-foreground font-semibold">
                                            {course.title}
                                        </h3>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    };
}
export default Setting;
