const mongoose = require("mongoose");

process.env.NODE_ENV    = "test";
process.env.JWT_SECRET  = "test-secret";
process.env.JWT_EXPIRES_IN = "1h";

const TEST_DB = "mongodb://localhost:27017/quizgame-test";

beforeAll(async () => {
  await mongoose.connect(TEST_DB);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

// wipe all collections between tests so nothing bleeds across
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
