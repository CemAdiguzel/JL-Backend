import argon2 from "argon2";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import process from "process";
import { createConnection } from "typeorm";
import { User } from "./entities/User";
import { apolloServer } from "./graphql";
import jwtStrategy from "./middleware/auth";
dotenv.config();

createConnection()
  .then(async (connection) => {
    await connection.runMigrations();
    await connection.synchronize();
    //const cors = require("cors");
    const Axios = require("axios");
    const PORT = process.env.SERVER_PORT || 3001;
    const app = express();

    // Serving static files; defining the path
    app.use(express.static(__dirname + "/public"));
    app.use(bodyParser.json({ limit: "50mb" }), cors());
    passport.use("jwt", jwtStrategy);

    app.use("/graphql", (req, res, next) => {
      passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (user) {
          req.user = user;
        }

        next();
      })(req, res, next);
    });

    // db connection injection
    app.use("/graphql", (req, res, next) => {
      req.dbConnection = connection;
      next();
    });
    app.post("/compile", (req, res) => {
      //getting the required data from the request
      let code = req.body.code;
      let language = req.body.language;
      let input = req.body.input;

      if (language === "python") {
        language = "py";
      }

      let data = {
        code: code,
        language: language,
        input: input,
      };
      let config = {
        method: "post",
        url: "https://codexweb.netlify.app/.netlify/functions/enforceCode",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      //calling the code compilation API
      Axios(config)
        .then((response) => {
          res.send(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    });
    // app.post("/compile", (req, res) => {
    //   //getting the required data from the request
    //   let code = req.body.code;
    //   let language = req.body.language;
    //   let input = req.body.input;
    //   fs.writeFileSync("./c.c", req.body.code);
    //   shell.exec("gcc c.c -o c", function (code, stdout, stderr) {
    //     const result = {
    //       stdout: stdout,
    //       stderr: stderr,
    //       code: code,
    //     };
    //     console.log(JSON.stringify(result));
    //     res.send(JSON.stringify(result));
    //   });

    //   // if (language === "python") {
    //   //   language = 71;
    //   // }
    //   // if (language === "c") {
    //   //   language = 50;
    //   // }
    //   // if (language === "cpp") {
    //   //   language = 54;
    //   // }
    //   // if (language === "java") {
    //   //   language = 62;
    //   // }
    //   // let data = {
    //   //   source_code: code,
    //   //   language_id: language,
    //   //   stdin: input,
    //   // };
    //   // let config = {
    //   //   method: "GET",
    //   //   url: "https://judge0-ce.p.rapidapi.com/about",
    //   //   headers: {
    //   //     "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    //   //     "X-RapidAPI-Key":
    //   //       "1ecd14bd7cmsh05480726ae36840p175154jsnaa27c03f157b",
    //   //   },
    //   //   data: data,
    //   // };
    //   //calling the code compilation API
    //   // Axios(config)
    //   //   .then((response) => {
    //   //     res.send(response.data);
    //   //     console.log("response", response.data);
    //   //   })
    //   //   .catch((error) => {
    //   //     console.log("error", error);
    //   //   });
    // });

    const path = "/graphql";
    apolloServer.applyMiddleware({ app, path });

    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${path}`);
    });
  })
  .catch((error) => console.log(error));
