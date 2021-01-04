// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import axios from "axios";

import IStackResponse from "./ts/IStackResponse";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log("Extension Loaded");

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "code-overflow.searchStack",
    async () => {
      // The code you place here will be executed every time your command is executed

      const questionOrBug = await vscode.window.showInputBox({
        placeHolder: "Type your question/bug",
      });

      if (!questionOrBug) {
        return;
      }

      const options = await getOptions(questionOrBug);

      const optionsItems = options.items.filter((item) => item.is_answered);

      if (!optionsItems || optionsItems.length === 0) {
        vscode.window.showWarningMessage(
          "No question found with this search =("
        );

        return;
      }

      const optionsHeaders = optionsItems.map((option) => {
        return `Votes [${option.score}]: ${option.title} `;
      });

      const quickPick = await vscode.window.showQuickPick(optionsHeaders);

      if (!quickPick) {
        return;
      }

      const index = optionsHeaders.indexOf(quickPick);

      const panel = vscode.window.createWebviewPanel(
        "code-overflow",
        "Code Overflow",
        vscode.ViewColumn.Two
      );

      const pageHTML = await getPageHTML(optionsItems[index].link);

      panel.webview.html = pageHTML;
    }
  );

  context.subscriptions.push(disposable);
}

async function getOptions(
  questionOrBug: string,
  page: number = 1
): Promise<IStackResponse> {
  const optionsURL = "https://api.stackexchange.com/2.2/search/advanced";

  const { data } = await axios.get(optionsURL, {
    params: {
      order: "desc",
      sort: "relevance",
      site: "stackoverflow",
      q: questionOrBug,
    },
  });

  return data;
}

async function getPageHTML(href: string): Promise<string> {
  const { data: htmlContent } = await axios.get(href);

  return htmlContent;
}

// this method is called when your extension is deactivated
export function deactivate() {}
