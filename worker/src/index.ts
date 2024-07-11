import { createClient } from "redis";

const client = createClient();

interface Submission {
  problemId: string;
  code: string;
  language: string;
}

async function processSubmission(submission: string) {
  const { problemId, code, language } = JSON.parse(submission);

  console.log(`processing submission for problemId: ${problemId}`);
  console.log(`Code: ${code}`);
  console.log(`Language: ${language}`);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log(`Fineshed processing submission for problemId: ${problemId}.`);
}

async function startWorker() {
  try {
    await client.connect();
    console.log("Worker connected to Redis");

    // main loop

    while (true) {
      try {
        const submission = await client.brPop("problem", 0);
        // @ts-ignore
        await processSubmission(submission.element);
      } catch (e) {
        console.error("Error processing submission:", e);
      }
    }
  } catch (error) {
    console.error("Redis connection error:", error);
  }
}

startWorker();
