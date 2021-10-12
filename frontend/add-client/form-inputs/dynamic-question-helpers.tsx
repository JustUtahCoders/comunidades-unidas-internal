import React from "react";
import { IntakeQuestion } from "../../admin/intake/intake-setting.component";

export function renderDynamicallyOrderedQuestions(
  questions: IntakeQuestion[],
  questionRenderers: QuestionRendererMap,
  skippedQuestions: string[] = []
): React.ReactElement[] {
  return questions.map((question) => {
    if (question.disabled || skippedQuestions.includes(question.dataKey)) {
      return null;
    }

    const renderer = questionRenderers[question.dataKey];
    if (!renderer) {
      throw Error(
        `No renderer implemented for question with data key '${question.dataKey}'`
      );
    }

    const node = renderer({
      ...question,
      placeholder: question.placeholder || "",
    });

    return node ? React.cloneElement(node, { key: question.dataKey }) : node;
  });
}

export interface QuestionRendererMap {
  [dataKey: string]: (question: IntakeQuestion) => React.ReactElement;
}
