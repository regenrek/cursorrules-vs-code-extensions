import * as vscode from "vscode";
import { searchAndAddCursorRules } from "./commands/searchAndAdd";

export function activate(context: vscode.ExtensionContext): void {
  let disposable = vscode.commands.registerCommand(
    "cursor-rules.searchAndAdd",
    searchAndAddCursorRules
  );
  context.subscriptions.push(disposable);
}

export function deactivate(): void {}
