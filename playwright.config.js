module.exports = {
  testDir: "./tests",
  timeout: 120000,
  use: { baseURL: "http://127.0.0.1:4173", headless: true },
  workers: 2,
  reporter: "list",
  webServer: {
    command: "python3 -m http.server 4173 --bind 127.0.0.1",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
  },
};
