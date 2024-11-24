import * as vscode from "vscode";
import { searchAndAddCursorRules } from "./commands/searchAndAdd";

export function activate(context: vscode.ExtensionContext): void {
  console.log("Cursor Rules extension is now active");

  // Register the main command
  const disposable = vscode.commands.registerCommand(
    "cursorrules.searchAndAddCursorRules",
    () => {
      console.log("Executing searchAndAddCursorRules command");
      searchAndAddCursorRules(context);
    }
  );

  // Register a test command
  const testCommand = vscode.commands.registerCommand(
    "cursorrules.testCommand",
    () => {
      console.log("Executing test command");
      vscode.window.showInformationMessage(
        "Test command executed successfully!"
      );
    }
  );

  context.subscriptions.push(disposable, testCommand);
  console.log("Cursor Rules commands registered successfully");
}

export function deactivate(): void {}
