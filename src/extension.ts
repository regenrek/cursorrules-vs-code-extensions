import * as vscode from "vscode";
import { searchAndAddCursorRules } from "./commands/searchAndAdd";

export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand(
    "cursor-rules.searchAndAddCursorRules",
    () => searchAndAddCursorRules(context)
  );
  context.subscriptions.push(disposable);
}

export function deactivate(): void {}
