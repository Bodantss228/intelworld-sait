module.exports = {
  apps: [{
    name: 'intelworld-site',
    script: './node_modules/.bin/next',
    args: 'start',
    cwd: '/var/www/intelworld',
    interpreter: '/root/.nvm/versions/node/v20.20.2/bin/node',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
