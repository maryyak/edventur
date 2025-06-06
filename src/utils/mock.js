//для этого на страницах запросы пока не прописывай, потому что я потом вынесу в общий контекст, чтобы из одного места можно было тянуть
export const userInfo = [
    {
    id:1,
    fio: 'Иванов Иван Иванович',
    uni: 'Московский государственный университет',
    course: '3',
    direction: 'Программная инженерия',
    score: '4.5',
    role: 'student',
    assessments: [3] // тут многие ко многим с ассесментами, может быть пустое, храним здесь пройденные ассесменты
    },
    {
        id:2,
        fio: 'Петров Петр Петрович',
        uni: 'РТУ МИРЭА',
        email: 'petrov@mail.ru',
        role: 'agent'
    },
    {
        id:3,
        role: 'admin'
    }
];


//таблицу с уведомлениями пока не делай, не уверена, нужны ли они нам вообще
export const notifications = ['Уведомление 1', 'Уведомление 2', 'Уведомление 3', 'Уведомление 4', 'Уведомление 5'];

export const programs = [
    {
        id: 1,
        clicks:5,
        title: "Фуллстек разработка",
        description:
            "В рамках профиля ведётся подготовка специалистов, которые умеют производить разработку программного обеспечения с использованием различных языков программирования: С++, Python, Javascript, Go, C# и др., а также с применением разнообразных паттернов и фреймворков. Выпускники способны работать с ключевыми технологиями программной разработки, а потому они наиболее востребованы на IT-рынке.",
        university: "РТУ МИРЭА", // многие ко многим должна быть связка и название будет из таблицы самого вуза брать
        level: "Бакалавриат",
        form: "Очная",
        seats: 100,
        duration: "2 года",
        additionally: "2 диплома - НИУ ВШЭ и ВУЗа партнера",
        similarity: 0.8,
        min_similarity: 0.8,
        assessment: 1, // тут связь один ко многим с таблицей ассесментов, поле необязательное
        studyplan: {
            "program": "Программная инженерия",
            "degree": "Бакалавриат",
            "duration_years": 4,
            "semesters": [
                {
                    "semester": 1,
                    "courses": [
                        {
                            "name": "Математика",
                            "hours": 144,
                            "type": "Лекции + Практика",
                            "assessment": "Экзамен"
                        },
                        {
                            "name": "Информатика",
                            "hours": 108,
                            "type": "Лекции + Лабораторные",
                            "assessment": "Зачёт"
                        },
                        {
                            "name": "История",
                            "hours": 72,
                            "type": "Лекции",
                            "assessment": "Зачёт"
                        },
                        {
                            "name": "Иностранный язык",
                            "hours": 72,
                            "type": "Практика",
                            "assessment": "Зачёт"
                        }
                    ]
                },
                {
                    "semester": 2,
                    "courses": [
                        {
                            "name": "Математический анализ",
                            "hours": 144,
                            "type": "Лекции + Практика",
                            "assessment": "Экзамен"
                        },
                        {
                            "name": "Алгоритмы и структуры данных",
                            "hours": 108,
                            "type": "Лекции + Лабораторные",
                            "assessment": "Экзамен"
                        },
                        {
                            "name": "Физика",
                            "hours": 108,
                            "type": "Лекции + Лабораторные",
                            "assessment": "Зачёт"
                        },
                        {
                            "name": "Философия",
                            "hours": 72,
                            "type": "Лекции",
                            "assessment": "Зачёт"
                        }
                    ]
                },
                {
                    "semester": 3,
                    "courses": [
                        {
                            "name": "ООП и языки программирования",
                            "hours": 108,
                            "type": "Лекции + Лабораторные",
                            "assessment": "Экзамен"
                        },
                        {
                            "name": "Базы данных",
                            "hours": 108,
                            "type": "Лекции + Практика",
                            "assessment": "Экзамен"
                        },
                        {
                            "name": "Теория вероятностей и математическая статистика",
                            "hours": 72,
                            "type": "Лекции",
                            "assessment": "Зачёт"
                        },
                        {
                            "name": "Проектная деятельность",
                            "hours": 72,
                            "type": "Проект",
                            "assessment": "Зачёт"
                        }
                    ]
                }
            ]
        },
        reviews: [
            {
                id: 1,
                name: "Александр Смирнов",
                year: 3,
                rating: 5,
                comment:
                    "Программа супер! Отличные преподаватели и много практики. Особенно понравился курс по алгоритмам.",
                date: "2024-03-15"
            },
            {
                id: 2,
                name: "Екатерина Иванова",
                year: 2,
                rating: 4,
                comment:
                    "Курсы интересные, но хотелось бы больше живых проектов. В остальном всё отлично!",
                date: "2024-02-10"
            },
            {
                id: 3,
                name: "Максим Кузнецов",
                year: 4,
                rating: 5,
                comment:
                    "Очень доволен программой! Глубокая теоретическая база и современные технологии.",
                date: "2024-01-28"
            },
            {
                id: 4,
                name: "Анна Петрова",
                year: 1,
                rating: 3,
                comment:
                    "Не хватает практических занятий в начале обучения, но преподаватели стараются донести материал понятно.",
                date: "2024-04-02"
            }
        ],
        similarPrograms: [
            { id: 3, title: "Кибербезопасность" }, // многие ко многим должна быть связка, считается на бэке через ии также по учебным планам
            { id: 4, title: "Разработка мобильных приложений" },
            { id: 2, title: "Искусственный интеллект" }
        ]
    },
    {
        id: 2,
        title: "Искусственный интеллект",
        clicks:11,
        description:
            "Программа нацелена на подготовку специалистов в области машинного обучения, анализа данных и нейронных сетей. Выпускники могут работать в сферах автоматизации, предсказательной аналитики и AI-исследований.",
        university: "МГУ",
        level: "Магистратура",
        form: "Очная",
        seats: 20,
        duration: "4 месяца",
        similarity: 0.4,
        min_similarity: 0.8,
        additionally: "2 диплома - НИУ ВШЭ и ВУЗа партнера",
        assessment: 2,
        studyplan: {
            "program": "Программная инженерия",
            "degree": "Бакалавриат",
            "duration_years": 4,
            "semesters": [
                {
                    "semester": 2,
                    "courses": [
                        {
                            "name": "Математический анализ",
                            "hours": 144,
                            "type": "Лекции + Практика",
                            "assessment": "Экзамен"
                        },
                        {
                            "name": "Алгоритмы и структуры данных",
                            "hours": 108,
                            "type": "Лекции + Лабораторные",
                            "assessment": "Экзамен"
                        },
                        {
                            "name": "Физика",
                            "hours": 108,
                            "type": "Лекции + Лабораторные",
                            "assessment": "Зачёт"
                        },
                        {
                            "name": "Философия",
                            "hours": 72,
                            "type": "Лекции",
                            "assessment": "Зачёт"
                        }
                    ]
                },
                {
                    "semester": 3,
                    "courses": [
                        {
                            "name": "ООП и языки программирования",
                            "hours": 108,
                            "type": "Лекции + Лабораторные",
                            "assessment": "Экзамен"
                        },
                        {
                            "name": "Базы данных",
                            "hours": 108,
                            "type": "Лекции + Практика",
                            "assessment": "Экзамен"
                        },
                        {
                            "name": "Теория вероятностей и математическая статистика",
                            "hours": 72,
                            "type": "Лекции",
                            "assessment": "Зачёт"
                        },
                        {
                            "name": "Проектная деятельность",
                            "hours": 72,
                            "type": "Проект",
                            "assessment": "Зачёт"
                        }
                    ]
                }
            ]
        },
        reviews: [
            {
                id: 5,
                name: "Олег Петров",
                year: 4,
                rating: 5,
                comment: "Отличная программа!",
                date: "2024-02-01"
            },
            {
                id: 6,
                name: "Мария Смирнова",
                year: 3,
                rating: 4,
                comment: "Очень интересный курс.",
                date: "2024-03-05"
            }
        ],
        similarPrograms: [
            { id: 5, title: "Бизнес-информатика" },
            { id: 1, title: "Фуллстек разработка" },
            { id: 3, title: "Кибербезопасность" }
        ]
    },
    {
        id: 3,
        title: "Кибербезопасность",
        clicks:7,
        description:
            "Студенты изучают методы защиты информации, криптографию, анализ уязвимостей и методы предотвращения кибератак. Подготовка специалистов ведётся в тесном взаимодействии с ведущими IT-компаниями.",
        university: "РТУ МИРЭА",
        level: "Бакалавриат",
        form: "Очно-заочная",
        similarity: 0.9,
        min_similarity: 0.95,
        seats: 100,
        duration: "2 года",
        additionally: "2 диплома - НИУ ВШЭ и ВУЗа партнера",
        assessment: 2,
        studyplan: {
            "program": "Программная инженерия",
            "degree": "Бакалавриат",
            "duration_years": 4,
            "semesters": [
                {
                    "semester": 2,
                    "courses": [
                        {
                            "name": "Математический анализ",
                            "hours": 144,
                            "type": "Лекции + Практика",
                            "assessment": "Экзамен"
                        },
                        {
                            "name": "Алгоритмы и структуры данных",
                            "hours": 108,
                            "type": "Лекции + Лабораторные",
                            "assessment": "Экзамен"
                        },
                        {
                            "name": "Физика",
                            "hours": 108,
                            "type": "Лекции + Лабораторные",
                            "assessment": "Зачёт"
                        },
                        {
                            "name": "Философия",
                            "hours": 72,
                            "type": "Лекции",
                            "assessment": "Зачёт"
                        }
                    ]
                },
                {
                    "semester": 3,
                    "courses": [
                        {
                            "name": "ООП и языки программирования",
                            "hours": 108,
                            "type": "Лекции + Лабораторные",
                            "assessment": "Экзамен"
                        },
                        {
                            "name": "Базы данных",
                            "hours": 108,
                            "type": "Лекции + Практика",
                            "assessment": "Экзамен"
                        },
                        {
                            "name": "Теория вероятностей и математическая статистика",
                            "hours": 72,
                            "type": "Лекции",
                            "assessment": "Зачёт"
                        },
                        {
                            "name": "Проектная деятельность",
                            "hours": 72,
                            "type": "Проект",
                            "assessment": "Зачёт"
                        }
                    ]
                }
            ]
        },
        reviews: [
            {
                id: 7,
                name: "Елена Иванова",
                year: 2,
                rating: 3,
                comment: "Нужна доработка.",
                date: "2024-01-15"
            },
            {
                id: 8,
                name: "Дмитрий Козлов",
                year: 3,
                rating: 4,
                comment: "Хорошая программа, но хотелось бы больше практики.",
                date: "2024-02-20"
            }
        ],
        similarPrograms: [
            { id: 1, title: "Фуллстек разработка" },
            { id: 4, title: "Разработка мобильных приложений" },
            { id: 2, title: "Искусственный интеллект" }
        ]
    },
    {
        id: 4,
        title: "Разработка мобильных приложений",
        clicks: 2,
        description:
            "Обучение направлено на разработку мобильных приложений под iOS и Android с использованием современных технологий, таких как Swift, Kotlin и Flutter.",
        university: "СПбГУ",
        level: "Бакалавриат",
        form: "Очная",
        similarity: 0.95,
        min_similarity: 0.8,
        seats: 100,
        duration: "2 года",
        additionally: "2 диплома - НИУ ВШЭ и ВУЗа партнера",
        studyplan: {
            "program": "Программная инженерия",
            "degree": "Бакалавриат",
            "duration_years": 4,
            "semesters": [
                {
                    "semester": 2,
                    "courses": [
                        {
                            "name": "Математический анализ",
                            "hours": 144,
                            "type": "Лекции + Практика",
                            "assessment": "Экзамен"
                        },
                        {
                            "name": "Алгоритмы и структуры данных",
                            "hours": 108,
                            "type": "Лекции + Лабораторные",
                            "assessment": "Экзамен"
                        },
                        {
                            "name": "Физика",
                            "hours": 108,
                            "type": "Лекции + Лабораторные",
                            "assessment": "Зачёт"
                        },
                        {
                            "name": "Философия",
                            "hours": 72,
                            "type": "Лекции",
                            "assessment": "Зачёт"
                        }
                    ]
                },
                {
                    "semester": 3,
                    "courses": [
                        {
                            "name": "ООП и языки программирования",
                            "hours": 108,
                            "type": "Лекции + Лабораторные",
                            "assessment": "Экзамен"
                        },
                        {
                            "name": "Базы данных",
                            "hours": 108,
                            "type": "Лекции + Практика",
                            "assessment": "Экзамен"
                        },
                        {
                            "name": "Теория вероятностей и математическая статистика",
                            "hours": 72,
                            "type": "Лекции",
                            "assessment": "Зачёт"
                        },
                        {
                            "name": "Проектная деятельность",
                            "hours": 72,
                            "type": "Проект",
                            "assessment": "Зачёт"
                        }
                    ]
                }
            ]
        },
        reviews: [
            {
                id: 9,
                name: "Антон Сидоров",
                year: 4,
                rating: 5,
                comment: "Отличный курс!",
                date: "2024-03-10"
            }
        ],
        similarPrograms: [
            { id: 3, title: "Кибербезопасность" },
            { id: 1, title: "Фуллстек разработка" },
            { id: 5, title: "Бизнес-информатика" }
        ]
    },
    {
        id: 5,
        title: "Бизнес-информатика",
        clicks:5,
        description:
            "Программа сочетает IT и бизнес-аналитику, позволяя выпускникам заниматься разработкой и внедрением информационных систем в бизнес-процессы компаний.",
        university: "МГУ",
        level: "Магистратура",
        form: "Заочная",
        similarity: 0.47,
        min_similarity: 0.8,
        seats: 10,
        duration: "1 год",
        additionally: "2 диплома - НИУ ВШЭ и ВУЗа партнера",
        studyplan: {
            "program": "Программная инженерия",
            "degree": "Бакалавриат",
            "duration_years": 4,
            "semesters": [
                {
                    "semester": 2,
                    "courses": [
                        {
                            "name": "Математический анализ",
                            "hours": 144,
                            "type": "Лекции + Практика",
                            "assessment": "Экзамен"
                        },
                        {
                            "name": "Алгоритмы и структуры данных",
                            "hours": 108,
                            "type": "Лекции + Лабораторные",
                            "assessment": "Экзамен"
                        },
                        {
                            "name": "Физика",
                            "hours": 108,
                            "type": "Лекции + Лабораторные",
                            "assessment": "Зачёт"
                        },
                        {
                            "name": "Философия",
                            "hours": 72,
                            "type": "Лекции",
                            "assessment": "Зачёт"
                        }
                    ]
                },
                {
                    "semester": 3,
                    "courses": [
                        {
                            "name": "ООП и языки программирования",
                            "hours": 108,
                            "type": "Лекции + Лабораторные",
                            "assessment": "Экзамен"
                        },
                        {
                            "name": "Базы данных",
                            "hours": 108,
                            "type": "Лекции + Практика",
                            "assessment": "Экзамен"
                        },
                        {
                            "name": "Теория вероятностей и математическая статистика",
                            "hours": 72,
                            "type": "Лекции",
                            "assessment": "Зачёт"
                        },
                        {
                            "name": "Проектная деятельность",
                            "hours": 72,
                            "type": "Проект",
                            "assessment": "Зачёт"
                        }
                    ]
                }
            ]
        },
        reviews: [
            {
                id: 10,
                name: "Ольга Федорова",
                year: 2,
                rating: 4,
                comment: "Интересное сочетание дисциплин.",
                date: "2024-02-28"
            },
            {
                id: 11,
                name: "Сергей Иванов",
                year: 3,
                rating: 3,
                comment: "Можно лучше.",
                date: "2024-03-18"
            },
            {
                id: 12,
                name: "Наталья Петрова",
                year: 2,
                rating: 4,
                comment: "Хороший баланс теории и практики.",
                date: "2024-04-05"
            }
        ],
        similarPrograms: [
            { id: 2, title: "Искусственный интеллект" },
            { id: 4, title: "Разработка мобильных приложений" },
            { id: 3, title: "Кибербезопасность" }
        ]
    }
];


export const universities = [
    "РТУ МИРЭА", "МГУ", "СПбГУ" //тоже с бэка из таблицы уников
]

export const assessments = [
    {
        id: 1,
        title: "Тест по математике",
        description: "Онлайн тест для проверки знаний по математике.",
        questions: [
            {
                id: 1,
                text: "Сколько будет 2 + 2?",
                options: [
                    { id: "a", text: "3" },
                    { id: "b", text: "4" },
                    { id: "c", text: "5" },
                ],
                correctOptionId: "b",
            },
            {
                id: 2,
                text: "Чему равна производная от x²?",
                options: [
                    { id: "a", text: "x" },
                    { id: "b", text: "2x" },
                    { id: "c", text: "x²" },
                ],
                correctOptionId: "b",
            },
            {
                id: 3,
                text: "Как называется теорема Пифагора?",
                options: [
                    { id: "a", text: "Теорема о пропорциональности" },
                    { id: "b", text: "Теорема о прямоугольном треугольнике" },
                    { id: "c", text: "Теорема о гипотенузе" },
                ],
                correctOptionId: "b",
            },
        ],
    },
    {
        id: 2,
        title: "Тест по программированию",
        description: "Онлайн тест для проверки базовых знаний в программировании.",
        questions: [
            {
                id: 1,
                text: "Какой язык используется для разработки на React?",
                options: [
                    { id: "a", text: "Python" },
                    { id: "b", text: "JavaScript" },
                    { id: "c", text: "Java" },
                ],
                correctOptionId: "b",
            },
            {
                id: 2,
                text: "Что такое JSX?",
                options: [
                    { id: "a", text: "JavaScript XML" },
                    { id: "b", text: "JavaScript Syntax Extension" },
                    { id: "c", text: "JavaScript X" },
                ],
                correctOptionId: "a",
            },
            {
                id: 3,
                text: "Какой из следующих вариантов является компонентом React?",
                options: [
                    { id: "a", text: "<div>" },
                    { id: "b", text: "useState" },
                    { id: "c", text: "Component" },
                ],
                correctOptionId: "c",
            },
        ],
    },
    {
        id: 3,
        title: "Тест по программированию 2",
        description: "Онлайн тест для проверки базовых знаний в программировании.",
        questions: [
            {
                id: 1,
                text: "Какой язык используется для разработки на React?",
                options: [
                    { id: "a", text: "Python" },
                    { id: "b", text: "JavaScript" },
                    { id: "c", text: "Java" },
                ],
                correctOptionId: "b",
            }
        ],
    },
];

export const applications = [
    {
        id: 1,
        program: programs[1],
        date: "2025-02-10 12:55:37.406+03",
        status: "На рассмотрении"
    },
    {
        id: 2,
        program: programs[2],
        date: "2025-01-10 12:55:37.406+03",
        status: "Отказано",
        comment: "Недостаточно свободных мест"
    },
    {
        id: 3,
        program: programs[0],
        date: "2025-03-01 09:20:15.123+03",
        status: "Одобрено",
        comment: "Вы успешно прошли отбор"
    }
]

export const universityApplications = [
    {
        id: 1,
        user: { fio: "Имя Фамилия" },
        program: programs[0],
        date: "2025-03-01 09:20:15.123+03",
        status: "На рассмотрении",
        file: "...",
        assesment: 5,
        comment: ""
    },
    {
        id: 2,
        user: { fio: "Имя Фамилия" },
        program: programs[0],
        date: "2025-03-01 09:20:15.123+03",
        status: "На рассмотрении",
        file: "...",
        assesment: 4.6,
        comment: ""
    },
    {
        id: 3,
        user: { fio: "Имя Фамилия" },
        program: programs[2],
        date: "2025-03-01 09:20:15.123+03",
        status: "На рассмотрении",
        file: "...",
        comment: ""
    },


]