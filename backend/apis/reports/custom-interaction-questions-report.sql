SELECT services.serviceName, customServiceQuestions.label, customServiceQuestions.type, services.id, customServiceQuestions.type
FROM customServiceQuestions JOIN services ON customServiceQuestions.serviceId = services.id
WHERE customServiceQuestions.id = ? AND customServiceQuestions.isDeleted = false
;

SELECT name, value
FROM customServiceQuestionOptions
WHERE questionId = ?
;

SELECT answer, clientId
FROM
  clientInteractionCustomAnswers
  JOIN clientInteractions ON clientInteractions.id = clientInteractionCustomAnswers.interactionId
WHERE
  questionId = ?
  AND clientInteractions.dateOfInteraction BETWEEN ? AND ?
;