import * as vscode from "vscode";
import { searchAndAddCursorRules } from "./commands/searchAndAdd";

export const activate = (context: vscode.ExtensionContext) => {
  const disposable = vscode.commands.registerCommand(
    "cursorrules-search.searchAndAddCursorRules",
    () => searchAndAddCursorRules(context)
  );

  context.subscriptions.push(disposable);
};

export const deactivate = () => {};
