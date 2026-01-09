// E2E CJS mock for @thallesp/nestjs-better-auth
function AllowAnonymous() { return function () {}; }
function OptionalAuth() { return function () {}; }
function Session() { return function (_target, _propertyKey, _parameterIndex) {}; }

class AuthGuard {}

class AuthModule {
  static forRoot() {
    return { module: AuthModule, providers: [], exports: [] };
  }
}

const mock = { __esModule: true, AllowAnonymous, OptionalAuth, Session, AuthGuard, AuthModule };
module.exports = mock;
module.exports.default = mock;
