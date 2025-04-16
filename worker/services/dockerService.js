const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { repoBasePath } = require('../configs/constants');

function detectTechStack(folder) {
  if (fs.existsSync(path.join(folder, 'package.json'))) {
    return 'node';
  }
  if (fs.existsSync(path.join(folder, 'app.py'))) {
    return 'flask';
  }
  // Add more detection rules if needed
  return null;
}

// wokrdir should not have / at the beginning
// and should not have / at the end
// e.g. 'app' is correct, '/app' is not correct

function generateDockerfile(folder, tech, port, workdir) {
  let content = '';

  if (tech === 'node') {
    content = `
      FROM node:18
      WORKDIR /${workdir}   
      COPY . .
      RUN npm install
      EXPOSE ${port}
      CMD ["npm", "start"]
    `;
  } else if (tech === 'flask') {
    content = `
      FROM python:3.10
      WORKDIR  /${workdir}  
      COPY . .
      RUN pip install -r requirements.txt
      EXPOSE ${port}
      CMD ["python", "app.py"]
    `;
  } else {
    throw new Error('Unsupported tech stack or no recognizable entry point.');
  }

  fs.writeFileSync(path.join(folder, 'Dockerfile'), content.trim());
}

exports.deployContainer = (repoName, port, subdomain) => {
  const folder = `${repoBasePath}/${repoName}`;
  const containerName = `app-${repoName}`;
  const dockerfilePath = path.join(folder, 'Dockerfile');

  // Step 1: Check for Dockerfile or generate one
  if (!fs.existsSync(dockerfilePath)) {
    const tech = detectTechStack(folder);
    if (!tech) {
      return Promise.reject(new Error('Cannot detect project type (Node/Flask/etc). Please add a Dockerfile manually.'));
    }
    generateDockerfile(folder, tech, port);
  }

  // Step 2: Build and run container
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
