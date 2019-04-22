UserModel = require('./models/user');
const models = require('./models/models');

var returnUser = function(userId, res) {
  // We need to fetch back the user or db side created fields are missing
  UserModel.findOne({id: userId}, function(err, user){
    if(err) {
      console.log(err);
      res.status(500).send(err);
      return;
    }
    if (user === undefined) {
      // We just created the user, it should be here
      res.status(404).send("Could not find created user");
      return;
    }
    res.send(user.toJSON());
    return;
  });
}

// Sets up the routes.
module.exports.setup = function(app) {
  /**
  * @swagger
  *
  * definitions:
  *   NewUser:
  *     type: object
  *     required:
  *       - name
  *     properties:
  *       name:
  *         type: string
  *       dob:
  *         type: string
  *         format: iso8601
  *         example: 2019-04-28T06:15:18+00:00
  *       address:
  *         type: string
  *       description:
  *         type: string
  *   User:
  *     allOf:
  *       - $ref: '#/definitions/NewUser'
  *     required:
  *       - id
  *     properties:
  *       id:
  *         type: string
  *         format: uuid(084d6681)
  *         example: d9a7cdcd-fb72-4145-882f-61666975199c
  *       createdAt:
  *         type: string
  *         format: data
  */


  /**
  * @swagger
  *
  * /:
  *   get:
  *     description: Check the API status
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: APi is up and running
  *       504:
  *         description: Gateway timeout
  */
  app.get('/', (req, res) => {
    res.send('Ok');
    return;
  });


  /**
  * @swagger
  *
  * /users:
  *   post:
  *     description: Update a user with the given data
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: user
  *         description: User object
  *         in:  body
  *         required: true
  *         type: string
  *         schema:
  *           $ref: '#/definitions/NewUser'
  *     responses:
  *       200:
  *         description: users
  *         schema:
  *           $ref: '#/definitions/User'
  *       400:
  *         description: Bad request, The payload (user parameters) is incorrect
  *       404:
  *         description: user not found
  */
  app.post('/users', (req, res) => {
    // Create a new user
    try {
      var user = new UserModel({
        id: models.uuid(), // Cannot be done on DB side, the save method does not return the full saved user so it cannot be found -_-
        name: req.body.name,
        dob: new Date(req.body.dob),
        address: req.body.address,
        description: req.body.description
      });
    }
    catch (err) {
      console.log(err);
      res.status(400).send(err);
      return
    }

    user.saveAsync()
      .then(function() {
        // We need to fetch back the user or db side created fields are missing
        returnUser(user.id, res);
      })
      .catch(function(err){
        if (err.name == "apollo.model.save.unsetrequired") {
          res.status(400).send("Required fields not provided.");
          return;
        }
        // Unexpected error
        console.log(err);
        res.status(500).send(err);
        return;
      });
  })

  /**
   * @swagger
   *
   * /users:
   *   get:
   *     description: Fetch a user
   *     produces:
   *       - application/json
   *     parameters:
   *       - id: userId
   *         description: UserId of the user to fetch.
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: user found
   *         schema:
   *           type: object
   *           $ref: '#/definitions/User'
   *       404:
   *          description: user not found
   */
  app.get('/users/:id', (req, res) => {
    var userId = req.params.id;
    res.send('Ok');
  })

  /**
   * @swagger
   *
   * /users:
   *   put:
   *     description: Update a user
   *     produces:
   *       - application/json
   *     parameters:
   *       - id: userId
   *         description: UserId of the user to update.
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: updated user
   *         schema:
   *           type: object
   *           $ref: '#/definitions/User'
   *       400:
   *         description: Bad request, The payload is incorrect
   *       404:
   *          description: user not found
   */
   app.put('/users/:id', (req, res) => {
     // Update a User
    res.send('Ok');
  });

  /**
   * @swagger
   *
   * /users:
   *   delete:
   *     description: Delete a user
   *     produces:
   *       - application/json
   *     parameters:
   *       - id: user to delete
   *         description: UserId of the user to delete.
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: user deleted
   *         schema:
   *           type: object
   *           $ref: '#/definitions/User'
   *       404:
   *          description: user not found
   */
   app.delete('/users/:id', (req, res) => {
     // Delete a User
    res.send('Ok');
  });

};
