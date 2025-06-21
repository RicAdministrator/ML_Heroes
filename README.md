# ML_HEROES

ML_HEROES is a small project that uses VUE, RESTFUL API and MySQL.\
It performs CRUD operations.

## Installation

The following should be installed:
1. express - restful api framework
2. nodemon - allows automatic update of the service removing the need to restart the service when there are updates. This will be installed globally
3. joi - used to validate req.body during insert/post and update/put

Open new terminal, make sure you are in root dir.\
Install dependencies using command below

```console
npm i express
npm i -g nodemon
npm i joi
```

## Run in terminal to set the port. To Do: Not yet working

Windows

```console
set PORT=5000
```

Mac

```console
export PORT=5000
```

## To test the service, you can use one of the following commands

Open new terminal, make sure you are in ml_heroes\API dir.

Recommended: If code is updated, no need to re-run the command

```console
nodemon index
```

or

```console
nodemon index.js
```

If code is updated, you need to close the service and re-run the command.

```console
node index.js
```

## Note
Sometimes I get the error below while running npm run dev, I just disable my antivirus until restart. My antivirus is smadav
Error:   Failed to scan for dependencies from entries:
  E:/Git/ML_Heroes/Front_End/index.html

```console
npm run dev
```  