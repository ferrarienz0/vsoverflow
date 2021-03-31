import * as vscode from "vscode";
import { unescape } from "html-escaper";

import {
  getQuestionPageHTML,
  getRelevantQuestions,
} from "../api/stackExchange";

import ICommand from "./ts/ICommand";

type Language = "en" | "pt" | "es" | "ru";

const prefix = "vsoverflow";

const stackOverflowWebsites = {
  pt: "pt.stackoverflow",
  en: "stackoverflow",
  es: "es.stackoverflow",
  ru: "ru.stackoverflow",
};

async function baseSearchCommand(language: Language = "en") {
  const questionOrBug = await vscode.window.showInputBox({
    placeHolder: "Type your question/bug",
  });

  if (!questionOrBug) {
    return;
  }

  const questions = await getRelevantQuestions(
    questionOrBug,
    stackOverflowWebsites[language]
  );

  if (!questions || questions.length === 0) {
    vscode.window.showWarningMessage("No question found with this search =(");

    return;
  }

  const questionHeaders = questions.map((question) => {
    return unescape(`Votes [${question.score}]: ${question.title}`);
  });

  const quickPick = await vscode.window.showQuickPick(questionHeaders);

  if (!quickPick || !questionHeaders.includes(quickPick)) {
    return;
  }

  const index = questionHeaders.indexOf(quickPick);

  const panel = vscode.window.createWebviewPanel(
    "vsoverflow",
    "VSOverflow",
    vscode.ViewColumn.Two,
    {
      enableScripts: true,
    }
  );

  const pageHTML = await getQuestionPageHTML(questions[index].link);

  panel.webview.html = pageHTML;
}

export const searchQuestion: ICommand<void> = {
  command: `${prefix}.searchQuestion`,
  callback: baseSearchCommand,
};

export const searchQuestionPT: ICommand<void> = {
  command: `${prefix}.searchQuestionPT`,
  callback: () => baseSearchCommand("pt"),
};

export const searchQuestionRU: ICommand<void> = {
  command: `${prefix}.searchQuestionRU`,
  callback: () => baseSearchCommand("ru"),
};

export const searchQuestionES: ICommand<void> = {
  command: `${prefix}.searchQuestionES`,
  callback: () => baseSearchCommand("es"),
};
