import axios from "axios";

async function crawlRules(): Promise<void> {
  try {
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      throw new Error("GITHUB_TOKEN is not set in the environment variables.");
    }

    // Fetch the rules.db.json file from the specified repository
    const response = await axios.get(
      "https://api.github.com/repos/regenrek/cursor.directory/contents/data/rules.db.json",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`Failed to fetch rules: ${response.statusText}`);
    }

    // Get the raw content from the download_url
    const contentResponse = await axios.get(response.data.download_url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (contentResponse.status !== 200) {
      throw new Error(
        `Failed to fetch file content: ${contentResponse.statusText}`
      );
    }

    // Use Bun's built-in file writing
    await Bun.write(
      "data/rules.db.json",
      JSON.stringify(contentResponse.data, null, 2)
    );

    console.log("Rules have been successfully updated.");
  } catch (error) {
    console.error("Failed to crawl rules:", error);
    process.exit(1);
  }
}

crawlRules();
