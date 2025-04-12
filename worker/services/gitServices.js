const { exec } = require('child_process');
const { repoBasePath } = require('../configs/constants');

exports.cloneRepo = (repoUrl, repoName) => {
  const folder = `${repoBasePath}/${repoName}`;
  const cloneCmd = `rm -rf ${folder} && git clone ${repoUrl} ${folder}`;

  return new Promise((resolve, reject) => {
    exec(cloneCmd, (error, stdout, stderr) => {
      if (error) return reject(new Error(stderr));
      resolve(stdout);
    });
  });
};
