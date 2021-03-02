
SELECT * FROM customServiceQuestions
WHERE id = ? AND isDeleted = ?;

select name, value from customServiceQuestionOptions where questionId = ?;