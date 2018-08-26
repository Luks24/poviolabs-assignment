const expect = require('expect');
const request = require('supertest');



const {app} = require('./../index');
const {User} = require('./../models/user');
const {users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);

describe('GET /me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.username).toBe(users[0].username);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /signup', () => {
  it('should create a user', (done) => {
    var username = 'example@example.com';
    var password = '123mnb!';

    request(app)
      .post('/signup')
      .send({username, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.username).toBe(username);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({username}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/signup')
      .send({
        username: 'and',
        password: '123'
      })
      .expect(400)
      .end(done);
  });

  it('should not create user if user in use', (done) => {
    request(app)
      .post('/signup')
      .send({
        username: users[0].username,
        password: 'Password123!'
      })
      .expect(400)
      .end(done);
  });
});


describe('POST /login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/login')
      .send({
        username: users[1].username,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.toObject().tokens[0]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/login')
      .send({
        username: users[1].username,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});
