process.env.NODE_ENV = 'test';
const LOCAL_URL = 'http://localhost:3000';
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should;
const {expect} = chai;

chai.use(chaiHttp);

let token = "";


describe('login', () => {
    beforeEach(done => {
        done();
    });

    it('should return 200', done => {
        chai.request(LOCAL_URL)
            .post('/login')
            .send({
                "email": 'ersomeshvyas@hotmail.com',
                "password": ""
            })
            .end((err, res) => {                
                if(err) {
                    return done(err);
                }

                expect(res.statusCode).to.equal(200);
                token = res.body.data.token;
                done();
            });
    });
});

describe('dashboard', () => {
    beforeEach(done => {
        done();
    });

    it('should return 200', done => {
        chai.request(LOCAL_URL)
            .post('/dashboard')
            .send({
                "username": 'bravesomesh',
                "limit": 10,
                "offset": 0,
                "token": token
            })
            .end((err, res) => {                
                if(err) {
                    return done(err);
                }

                expect(res.statusCode).to.equal(200);
                
                done();
            });
    });
});