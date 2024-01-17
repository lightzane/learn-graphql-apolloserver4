# 01 Initiate Project

Learning GraphQL using Apollo Server 4 built from scratch or blank project.

> Note: This project was created using **node v18** with **npm v9**

## Content

1. [Initialize Node Project](#initialize-node-project)
2. [Create initial file](#create-initial-file)
3. [Install initial dev dependencies](#install-initial-dev-dependencies)
4. [Generate tsconfig.json](#generate-tsconfigjson)
5. [Update package.json](#update-packagejson)
6. [Test the project](#test-the-project)

## Initialize Node Project

```bash
npm init -y
```

## Create initial file

Create `src/index.ts`.

## Install initial dev dependencies

```bash
npm install -D typescript nodemon ts-node
```

|              |                                                                          |
| ------------ | ------------------------------------------------------------------------ |
| `typescript` | Javascript with syntax for types                                         |
| `nodemon`    | For development purpose to reload the server automatically every changes |
| `ts-node`    | Required by `nodemon` to run `typescript`                                |

## Generate tsconfig.json

```bash
npx tsc --init
```

## Update package.json

```diff
{
  "scripts": {
+   "dev": "nodemon ./src/index.ts --watch src",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

## Test the project

### Add temporary code to test

`src/index.ts`

```ts
console.log('Hello World');
```

### Run

```bash
npm run dev
```

Output:

```bash
[nodemon] 3.0.3
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src/**/*
[nodemon] watching extensions: ts,json
[nodemon] starting `ts-node ./src/index.ts`
Hello World
[nodemon] clean exit - waiting for changes before restart
```
