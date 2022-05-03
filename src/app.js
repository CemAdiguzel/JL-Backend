import argon2 from 'argon2';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import passport from 'passport';
import process from 'process';
import { createConnection } from 'typeorm';
import { User } from './entities/User';
import { apolloServer } from './graphql';
import jwtStrategy from './middleware/auth';
dotenv.config();

createConnection()
  .then(async (connection) => {
    await connection.runMigrations();
    await connection.synchronize();
    const PORT = process.env.SERVER_PORT || 3001;
    const app = express();

    // Serving static files; defining the path
    app.use(express.static(__dirname + '/public'));
    app.use(bodyParser.json({ limit: '50mb' }), cors());
    passport.use('jwt', jwtStrategy);

    app.use('/graphql', (req, res, next) => {
      passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (user) {
          req.user = user;
        }

        next();
      })(req, res, next);
    });

    // db connection injection
    app.use('/graphql', (req, res, next) => {
      req.dbConnection = connection;
      next();
    });

    const path = '/graphql';
    apolloServer.applyMiddleware({ app, path });

    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${path}`);
    });
  })
  .catch((error) => console.log(error));
