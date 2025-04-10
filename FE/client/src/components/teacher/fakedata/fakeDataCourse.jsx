// src/data/fakeCourses.js
const fakeDataCourse = [
  {
    id: 1,
    title: "React Basics",
    image: "https://placehold.co/100x100",
    students: 50,
    rating: 4.5,
    status: "Published",
    active: true,
    price: 200,
    descriptionout: "test",
    sections: [
      {
        title: "Introduction",
        lessons: [
          {
            title: "What is React?",
            description: "An overview of React.js library",
            price: 100,
          },
          {
            title: "Setup Environment",
            description: "Tools and setup needed for React development",
            price: 0,
          },
        ],
      },
      {
        title: "Core Concepts",
        lessons: [
          {
            title: "Components",
            description: "Understanding functional and class components",
            price: 10,
          },
          { title: "JSX", description: "JSX syntax and usage", price: 10 },
          {
            title: "Props and State",
            description: "Passing data and managing state",
            price: 15,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Advanced JavaScript",
    image: "https://placehold.co/100x100",
    students: 30,
    rating: 4.8,
    status: "Draft",
    active: false,
    price: 200,
    descriptionout: "test",
    sections: [
      {
        title: "Closures & Scope",
        lessons: [
          {
            title: "Closures",
            description: "Understanding JavaScript closures",
            price: 12,
          },
          {
            title: "Lexical Scope",
            description: "Scope chaining and how it works",
            price: 12,
          },
        ],
      },
      {
        title: "Async JS",
        lessons: [
          {
            title: "Promises",
            description: "Working with promises in JS",
            price: 15,
          },
          {
            title: "Async/Await",
            description: "Handling async code with async/await",
            price: 15,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Node.js Fundamentals",
    image: "https://placehold.co/100x100",
    students: 40,
    rating: 4.2,
    status: "Published",
    active: true,
    price: 200,
    descriptionout: "test",
    sections: [
      {
        title: "Intro to Node",
        lessons: [
          {
            title: "What is Node?",
            description: "A look into Node.js and its uses",
            price: 0,
          },
          {
            title: "Event Loop",
            description: "Understanding the event-driven architecture",
            price: 10,
          },
        ],
      },
      {
        title: "Modules",
        lessons: [
          {
            title: "CommonJS",
            description: "The module system used by Node.js",
            price: 8,
          },
          {
            title: "ES Modules",
            description: "Modern module syntax in JavaScript",
            price: 10,
          },
        ],
      },
    ],
  },
];

export default fakeDataCourse;
