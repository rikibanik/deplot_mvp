const { exec } = require('child_process');
const { repoBasePath } = require('../configs/constants');

exports.deployContainer = (repoName, port, subdomain) => {
  const folder = `${repoBasePath}/${repoName}`;
  const containerName = `app-${repoName}`;

  const cmd = `
    docker stop ${containerName} && docker rm ${containerName} || true &&
    docker build -t ${containerName} ${folder} &&
    docker run -d --name ${containerName}
      --label traefik.enable=true
      --label traefik.http.routers.${repoName}.rule=Host(\`${subdomain}.yourdomain.com\`)
      --label traefik.http.services.${repoName}.loadbalancer.server.port=${port}
      ${containerName}
  `;

  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) return reject(new Error(stderr));
      resolve(stdout);
    });
  });
};
