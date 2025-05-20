const gitService = require('../services/gitServices');
const dockerService = require('../services/dockerService');
const { log } = require('../utils/logger');

exports.handleDeployment = async (req, res) => {
  const { repoUrl, repoName, port, subdomain, InstallationAccessToken } = req.body;

  if (!repoUrl || !repoName || !port || !subdomain) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    console.log('Received deployment request:', req.body);
    log(`Received deployment request for ${repoName} on port ${port} with subdomain ${subdomain}`);
    console.log(repoUrl);
    await gitService.cloneRepo(repoUrl, repoName);
    await dockerService.deployContainer(repoName, port, subdomain);
    log(`${repoName} deployed successfully`);
    res.json({ message: 'Deployed successfully' });
  } catch (error) {
    log(`Deployment failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
// const { repoUrl, repoName, port, subdomain, InstallationAccessToken } = req.body;

// console.log('Received deployment request:', req.body);
// if (!repoUrl || !repoName || !port || !subdomain) {
//   return res.status(400).json({ error: 'Missing required fields' });
// }
// log(`Received deployment request for ${repoName} on port ${port} with subdomain ${subdomain}`);
// try {
//  console.log('Cloning repository...');
//   res.json({ message: 'Deployed successfully' });
// } catch (error) {
//   log(`Deployment failed: ${error.message}`);
//   res.status(500).json({ error: error.message });
// }