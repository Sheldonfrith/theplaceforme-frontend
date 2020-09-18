const GetAuthToken = (req, res, next) => {
    console.log('getting auth token');
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      req.authToken = req.headers.authorization.split(' ')[1];
    } else {
      req.authToken = null;
    }
    // console.log('got this auth token: '+req.authToken);
    next();
  };

module.exports = GetAuthToken;