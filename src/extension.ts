import * as vscode from "vscode";

import {
  searchQuestion,
  searchQuestionES,
  searchQuestionPT,
  searchQuestionRU,
} from "./commands/searchQuestion";

export function activate(context: vscode.ExtensionContext) {
  const disposables: vscode.Disposable[] = [];

  disposables.concat([
    vscode.commands.registerCommand(
      searchQuestion.command,
      searchQuestion.callback
    ),
    vscode.commands.registerCommand(
      searchQuestionES.command,
      searchQuestionES.callback
    ),
    vscode.commands.registerCommand(
      searchQuestionPT.command,
      searchQuestionPT.callback
    ),
    vscode.commands.registerCommand(
      searchQuestionRU.command,
      searchQuestionRU.callback
    ),
  ]);

  context.subscriptions.push(...disposables);
}
