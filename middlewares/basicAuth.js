const basicAuth = require('express-basic-auth');

exports.authMiddleware = basicAuth({
  users: { 'admin': 'supersecret' }, // Replace with secure credentials in a real app
  challenge: true,
  unauthorizedResponse: getUnauthorizedResponse,
});

function getUnauthorizedResponse(req) {
  return req.auth ?
    ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected') :
    'No credentials provided';
}
