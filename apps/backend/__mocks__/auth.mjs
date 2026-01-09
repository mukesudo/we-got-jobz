export function AllowAnonymous() { return () => {}; }
export function OptionalAuth() { return () => {}; }
export function Session() { return () => (_target, _propertyKey, _parameterIndex) => {}; }
