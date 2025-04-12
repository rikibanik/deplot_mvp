const fs = require("fs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const path = require('path');
function generateAppJWT() {
  const appId = process.env.GITHUB_APP_ID;

const privateKey = fs.readFileSync(path.resolve(__dirname, '../deployt.2025-04-10.private-key.pem'));

  const payload = {
    iat: Math.floor(Date.now() / 1000) - 60,
    exp: Math.floor(Date.now() / 1000) + 600,
    iss: appId,
  };

  return jwt.sign(payload, privateKey, { algorithm: "RS256" });
}

async function getInstallationAccessToken(installationId) {
  
try {
    const jwtToken = generateAppJWT();
    const response = await axios.post(
        `https://api.github.com/app/installations/${installationId}/access_tokens`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            Accept: "application/vnd.github+json",
            
          },
        }
      );
      return response.data.token;
} catch (error) {
    console.error("Error generating JWT:", error);
    throw new Error("Failed to generate JWT");
  }
    
}





module.exports = { generateAppJWT, getInstallationAccessToken };
