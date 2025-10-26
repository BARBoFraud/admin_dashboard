# Instalacion y configuracion inicial del dashboard de administrador ofraud

## Prerequisitos

- Nodejs >= 18.0.0 en tu servidor.

## Instalacion

1. Clona el repositorio

```bash
git clone https://github.com/BARBoFraud/admin_dashboard ./<tu-carpeta>
```

2. Entra a la carpeta

```bash
cd <tu-carpeta>
```

## Creacion del ambiente de ejecucion

Copia y configura el archivo `.env.example` usando los siguientes comandos.

```bash
cp .env.example .env
vi .env
```

Instala las dependencias del proyecto

```bash
# Instala las dependencias con tu gestor preferido
npm install
# o
yarn install
# o
pnpm install
# o
bun install
```

## Ejecucion del codigo

Ejecuta los siguientes comandos en tu terminal para iniciar la ejecucion del codigo.

```bash
# Usa tu gestor preferido
npm run build
# o
yarn run build
# o
pnpm run build
# o
bun run build
```

```bash
# Usa tu gestor preferido
npm run start -- -p <tu-puerto>
# o
yarn run start -- -p <tu-puerto>
# o
pnpm run start -- -p <tu-puerto>
# o
bun run start -- -p <tu-puerto>
```
