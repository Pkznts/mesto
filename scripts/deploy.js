import ghPages from "gh-pages";
import { loadEnv } from "vite";

const gitConfigCount = Number(process.env.GIT_CONFIG_COUNT || 0);
process.env[`GIT_CONFIG_KEY_${gitConfigCount}`] = "core.longpaths";
process.env[`GIT_CONFIG_VALUE_${gitConfigCount}`] = "true";
process.env.GIT_CONFIG_COUNT = String(gitConfigCount + 1);

const settings = loadEnv("production", process.cwd(), "");
const repository = settings.PUBLIC_PAGES_REPO;

if (!repository || !/^[\w.-]+\/[\w.-]+$/.test(repository)) {
  console.error("Укажите PUBLIC_PAGES_REPO в формате владелец/репозиторий в .env.local.");
  process.exitCode = 1;
} else {
  ghPages.publish(
    "dist",
    {
      repo: `https://github.com/${repository}.git`,
      branch: settings.PUBLIC_PAGES_BRANCH || "main",
      dotfiles: true,
      message: "deploy: update build",
    },
    (error) => {
      if (error) {
        console.error(`Не удалось опубликовать проект: ${error.message}`);
        process.exitCode = 1;
        return;
      }
      console.log(`Сборка опубликована: https://${repository.split("/")[0]}.github.io/${repository.split("/")[1]}/`);
    }
  );
}
