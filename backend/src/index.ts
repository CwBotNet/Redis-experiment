import exporess from "express";
import { createClient } from "redis";

const app = exporess();
const clinet = createClient();

app.use(exporess.json());

app.post("/problem", async (req, res) => {
  const { code, language, problemId } = req.body;

  try {
    //   store in db
    const result = await clinet.lPush(
      "problem",
      JSON.stringify({ code, language, problemId })
    );

    if (!result) return "somthing went worng";

    res.status(200).send("submission recived and stored");
  } catch (error) {
    console.error("redis error: ", error);
    res.status(500).send("failed to store submission");
  }
});

async function startServer() {
  try {
    await clinet.connect();
    console.log("connected to redis");

    app.listen(3000, () => {
      console.log("server is running on port 3000");
    });
  } catch (error) {
    console.error("redis connenction error: ", error);
  }
}

startServer();
