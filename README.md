<h3 align="center">
    <img alt="Logo" title="#logo" width="150px" src="mobile/src/assets/logo.png">
    <br>
</h3>

- [Summary](#Summary)
- [Technologies used](#tech-used)
- [How-to](#how-to)
- [Postman Doc](#postman)
<a id="summary"></a>

## :bookmark: Summary

For the sake of simplicity, this repository contains:
- Server (Built in node.js with MySQL and Knex.js to connect them)
- WEB (Built in React.js and pure HTML/CSS)
- Mobile (Built with React Native.)

Ecoleta is an application created with the purpose of registering (WEB), searching and locating (APP) 
recycling points.

Supermarkets, stores and volunteers may register their recycling points and its related information, such as: Location in the map and products that they are willing to receive for recycling. 

## Technologies used

<a id="tech-used"></a>

The project was developed with these technologies:

- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/en/)
- [ReactJS](https://reactjs.org/)
- [React Native](https://reactnative.dev/)
- [MySQL](https://www.mysql.com)
- [Knex](http://knexjs.org)

## :heavy_check_mark: Result:

- You can check the design layout at: **[Figma](https://www.figma.com/file/1SxgOMojOB2zYT0Mdk28lB/)**;

<img alt="Logo" title="#logo" width="150px" src="mobile/assets/Screen Shot 2020-06-07 at 19.10.14.png">

<img alt="Logo" title="#logo" width="150px" src="mobile/assets/Screen Shot 2020-06-07 at 19.11.45.png">

<img alt="Logo" title="#logo" width="150px" src="mobile/assets/Screen Shot 2020-06-07 at 19.12.16.png">

<a id="how-to"></a>

## How to run


  - Firstly, you have to install **[Node.js](https://nodejs.org/en/)**. Consider using [NVM](https://github.com/nvm-sh/nvm), for it makes version management easier.
  - A dependency manage is also required, here are the two best options: **[NPM](https://www.npmjs.com/)** **[Yarn](https://yarnpkg.com/)**.
  - I used **[Expo](https://expo.io/)** which was installed globally in my machine. Expo was used in the APP part.

1. Clone the repo
2. Execute the app

```sh
  Firstly install the dependencies
  $ npm install

  ## Knex creates the database for us. Seed file is meant to contain sample information.
  $ cd server
  $ npm run knex:migrate
  $ npm run knex:seed

  # Start server (For further information about scripts, please check package.json)
  $ npm run dev

  # Start web application
  $ cd web
  $ npm start

  # Start Mobile application
  $ cd mobile
  $ npm start
```
<a id="postman"></a>
## Postman Documentation

I have prepared a postman documentation, in which you will be able to check in details each endpoint and possible Requests and responses.

Please access it by link below:

```
https://documenter.getpostman.com/view/4694407/SztK35Rf?version=latest
```

### Contributors

- Murilo M. Santos <murilommms@gmail.com>

---


## Support

* If you have any query or doubt, please, feel free to contact me by e-mail.
