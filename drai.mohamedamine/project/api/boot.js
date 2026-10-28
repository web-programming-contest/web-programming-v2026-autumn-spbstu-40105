import { spawn, spawnSync } from 'node:child_process'

const django = (args, options = {}) => spawn('python3', args, {
  cwd: process.cwd(),
  env: { ...process.env, PYTHONUNBUFFERED: '1' },
  stdio: 'inherit',
  ...options,
})

for (const args of [
  ['backend/manage.py', 'migrate', '--noinput'],
  ['backend/manage.py', 'seed_demo'],
]) {
  const result = spawnSync('python3', args, {
    cwd: process.cwd(),
    env: { ...process.env, PYTHONUNBUFFERED: '1' },
    stdio: 'inherit',
  })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

const server = django([
  '-m', 'gunicorn', 'config.wsgi:application',
  '--chdir', 'backend',
  '--bind', '0.0.0.0:3000',
  '--workers', '2',
  '--timeout', '60',
])

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.kill(signal))
}
server.on('exit', (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0)
})
