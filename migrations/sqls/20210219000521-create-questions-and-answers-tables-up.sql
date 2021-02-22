CREATE TABLE customServiceQuestions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  serviceId INT NOT NULL,
  label VARCHAR(256),
  type ENUM (
    'text',
    'number',
    'select',
    'boolean',
    'date'
  ) NOT NULL,
  CONSTRAINT fk_question_serviceId FOREIGN KEY (serviceId) REFERENCES services(id)
);

CREATE TABLE customServiceQuestionOptions(
  id INT AUTO_INCREMENT PRIMARY KEY,
  questionId INT NOT NULL,
  name VARCHAR(256),
  value VARCHAR(256),
  CONSTRAINT fk_option_question FOREIGN KEY (questionId) REFERENCES customServiceQuestions(id)
);

CREATE TABLE clientInteractionCustomAnswers(
  id INT AUTO_INCREMENT PRIMARY KEY,
  questionId INT NOT NULL,
  answer VARCHAR(256),
  CONSTRAINT fk_custom_answer_question FOREIGN KEY (questionId) REFERENCES customServiceQuestions(id)
);