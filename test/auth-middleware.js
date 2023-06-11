const expect = require("chai").expect;
const authMiddleware = require("../middleware/is-auth");
const jwt = require('jsonwebtoken');
const sinon = require("sinon");

describe('Auth middleware', () => {

    it("should throw an error if no authorization header is present", function () {
        const req = {
            get: function () {
                return null;
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw('Not authenticated.');
        //expect(authMiddleware.bind(this, req, {}, () => { }).throw('Not authenticated.'));
    });

    it('should throw an error if the unathorization header is only one string', function () {
        const req = {
            get: function (headerName) {
                return "xyz";
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw();
    });

    it('should throw an error if the token cannot be verified', function () {
        const req = {
            get: function (headerName) {
                return 'Bearer XYZ';
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw();
    });

    it('should get a userId after decoding a token'), function () {
        const req = {
            get: function (headerName) {
                return "Bearer TOKENADSKSJALSJD";
            }
        };

        sinon.stub(jwt, 'verify');
        jwt.verify.returns({ userid: 'abc' });
        authMiddleware(req, {}, () => { });
        expect(req).to.have.property("userId");
        expect(req).to.have.property("userId", "abc");
        jwt.verify.restore();
    }

});


