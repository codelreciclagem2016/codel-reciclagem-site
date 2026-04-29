const { execSync } = require('child_process');
const https = require('https');

const GIT = 'C:\\Program Files\\Git\\cmd\\git.exe';
const DIR = 'C:\\Users\\Codel\\codel-reciclagem-site';
const REPO = 'codel-reciclagem-site';
const USER = 'codelreciclagem2016';

function run(cmd, opts = {}) {
  try {
    const out = execSync(cmd, { cwd: DIR, encoding: 'utf8', ...opts });
    return out.trim();
  } catch (e) {
    return e.message;
  }
}

// 1. Commit
console.log('=== COMMIT ===');
console.log(run(`"${GIT}" config user.email "contato@codelreciclagem.com.br"`));
console.log(run(`"${GIT}" config user.name "codelreciclagem2016"`));
console.log(run(`"${GIT}" add .`));
const commitOut = run(`"${GIT}" commit -m "feat: site inicial"`);
console.log('Commit:', commitOut);

// 2. Status
console.log('=== STATUS ===');
console.log(run(`"${GIT}" log --oneline`));

// 3. Obter novo token via credential helper
console.log('=== TOKEN ===');
const cred = run(`echo protocol=https\nhost=github.com\n | "${GIT}" credential fill`, { shell: 'cmd.exe' });
console.log('Credencial:', cred.replace(/password=.{10}.*/, 'password=***'));

// Extrair token
const match = cred.match(/password=(.+)/);
const TOKEN = match ? match[1].trim() : null;
console.log('Token obtido:', TOKEN ? 'SIM (' + TOKEN.substring(0,8) + '...)' : 'NAO');
