import * as vscode from "vscode";
import MiniSearch from "minisearch";
import * as path from "path";
import * as fs from "fs";

interface Rule {
  title: string;
  tags: string[];
  libs: string[];
  slug: string;
  content: string;
  author: {
    name: string;
    url: string;
    avatar: string;
  };
}

export async function searchAndAddCursorRules(
  context: vscode.ExtensionContext
) {
  try {
    // Read rules from the bundled JSON file
    const rulesPath = path.join(__dirname, "..", "rules.db.json");
    const rulesContent = fs.readFileSync(rulesPath, "utf8");
    const rules: Rule[] = JSON.parse(rulesContent);

    // Configure MiniSearch
    const miniSearch = new MiniSearch({
      fields: ["title", "tags", "libs", "author.name"],
      storeFields: ["title", "content", "author", "slug"],
      searchOptions: {
        boost: {
          title: 2,
          tags: 1.5,
          "author.name": 1,
        },
        fuzzy: 0.2,
        prefix: true,
      },
    });

    // Add rules to search index
    miniSearch.addAll(
      rules.map((rule, id) => ({
        id,
        ...rule,
        // Safely handle potentially undefined arrays
        tags: Array.isArray(rule.tags) ? rule.tags.join(" ") : "",
        libs: Array.isArray(rule.libs) ? rule.libs.join(" ") : "",
      }))
    );

    // Show quick pick with search
    const selected = await vscode.window.showQuickPick(
      rules.map((rule) => ({
        label: rule.title,
        description: `by ${rule.author?.name || "Unknown Author"}`,
        detail: `Tags: ${
          Array.isArray(rule.tags) ? rule.tags.join(", ") : "None"
        } | Libraries: ${
          Array.isArray(rule.libs) ? rule.libs.join(", ") : "None"
        }`,
        rule: rule,
      })),
      {
        placeHolder: "Search for a cursor rule...",
        matchOnDescription: true,
        matchOnDetail: true,
      }
    );

    if (selected) {
      await saveRuleToWorkspace(selected.rule);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    vscode.window.showErrorMessage(`Error: ${errorMessage}`);
  }
}

async function saveRuleToWorkspace(rule: Rule) {
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Saving rule - ${rule.title}`,
      cancellable: false,
    },
    async (progress) => {
      try {
        // Get workspace folder
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
          throw new Error("No workspace folder open");
        }

        // Path to .cursorrules file
        const cursorRulesPath = path.join(
          workspaceFolder.uri.fsPath,
          ".cursorrules"
        );

        // Read existing rules if file exists
        let existingContent = "";
        if (fs.existsSync(cursorRulesPath)) {
          existingContent = fs.readFileSync(cursorRulesPath, "utf8");
          // Add a newline if the file isn't empty and doesn't end with one
          if (existingContent && !existingContent.endsWith("\n")) {
            existingContent += "\n";
          }
        }

        // Append new rule content
        fs.writeFileSync(
          cursorRulesPath,
          existingContent + rule.content + "\n",
          { flag: "w" }
        );

        vscode.window.showInformationMessage(
          `Successfully added rule: ${rule.title}`
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        vscode.window.showErrorMessage(`Failed to save rule: ${errorMessage}`);
      }
    }
  );
}
