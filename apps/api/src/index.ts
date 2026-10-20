import fs from "node:fs";
import { createApp } from "./app.js";
import { seedSampleCatalogue } from "./catalogue.js";
import { knowledgeBaseDir, loadEnvFiles, readConfig, sampleCataloguePath } from "./config.js";
import { openDatabase } from "./db.js";
import { KnowledgeIndex, loadKnowledgeBase } from "./kb.js";
import { createProvider } from "./llm.js";

loadEnvFiles();
const config = readConfig();
fs.mkdirSync(config.dataDir, { recursive: true });
const db = openDatabase(config.dbPath);
seedSampleCatalogue(db, sampleCataloguePath);
const index = new KnowledgeIndex(loadKnowledgeBase(knowledgeBaseDir));
const provider = createProvider(config);
const app = createApp({ db, config, index, provider });

app.listen(config.port, () => {
  console.log(
    `Wickford API on ${config.publicBaseUrl} (assistant ${provider.id}, payments ${
      config.stripeSecretKey ? "stripe-test" : "simulated-test"
    }, supplier ${config.supplierAdapter})`,
  );
});
