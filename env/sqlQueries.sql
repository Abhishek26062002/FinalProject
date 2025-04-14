-- Create student table
CREATE TABLE student (
    Name VARCHAR NOT NULL,
    student_id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    Type VARCHAR
);

CREATE INDEX ix_student_email ON student (email);

-- Create mcq_results table
CREATE TABLE mcq_results (
    id SERIAL PRIMARY KEY,
    student_id INTEGER,
    test_id INTEGER,
    Q_id INTEGER[],
    Student_answer VARCHAR[],
    correct_answer VARCHAR[],
    score INTEGER,
    correct_count INTEGER NOT NULL,
    incorrect_count INTEGER NOT NULL,
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES student (student_id)
);

CREATE INDEX ix_mcq_results_student_id ON mcq_results (student_id);

-- Create descriptive_results table
CREATE TABLE descriptive_results (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL,
    student_answer TEXT NOT NULL,
    marks INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES student (student_id)
);

CREATE INDEX ix_descriptive_results_student_id ON descriptive_results (student_id);
CREATE INDEX ix_descriptive_results_question_id ON descriptive_results (question_id);



CREATE TABLE TESTS (
    test_id SERIAL PRIMARY KEY,
    test_name VARCHAR NOT NULL,
    content TEXT NOT NULL
);