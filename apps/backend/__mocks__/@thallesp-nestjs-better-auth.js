// E2E mock for @thallesp/nestjs-better-auth
function AllowAnonymous() {
  return function () {
    // no-op decorator
  };
}

function OptionalAuth() {
  return function () {
    // no-op decorator
  };
}

function Session() {
  // parameter decorator
  return function (_target, _propertyKey, _parameterIndex) {
    // no-op
  };
}

const mock = { __esModule: true, AllowAnonymous, OptionalAuth, Session };
module.exports = mock;
module.exports.default = mock;
