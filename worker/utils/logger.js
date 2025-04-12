exports.log = (msg) => {
    const time = new Date().toISOString();
    console.log(`[${time}] ${msg}`);
  };
  