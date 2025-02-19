const si = require("systeminformation");

async function getMonitorInfo() {
  console.log("--------------------------------");
  try {
    const data = await si.graphics();
    const numMonitors = data.displays.length;
    console.log(`Number of monitors: ${numMonitors}`);
    if (numMonitors > 1) {
      console.log("⚠️  Multiple monitors detected");
    } else if (numMonitors === 1) {
      console.log("✅  Only one monitor detected");
    } else {
      console.log("😮  No monitor detected");
    }
  } catch (e) {
    console.error("Error getting monitor information:", e);
  }
  console.log("--------------------------------");

  // Wait for keystroke
  console.log("Press any key to exit...");
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on("data", () => {
    process.exit(0);
  });
}

getMonitorInfo();
