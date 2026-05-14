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
```
