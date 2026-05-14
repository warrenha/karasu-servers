```
pnpm install
pnpm run dev
```

```
open http://localhost:3000
```

## Production Server
```
cd sysinfo-api
pnpm run build
ls -l dist

./uploadDist.sh

ssh warren@ontan.local

cd /opt/karasu/karasu-servers/sysinfo-api
git pull

./installServer.sh

./runServer.sh

Check if an already running node server, causing an error:
$ ps aux | grep node
warren    590345  node dist/server.mjs

$ kill 590345
```
