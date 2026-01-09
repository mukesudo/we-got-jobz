import * as ba from '@thallesp/nestjs-better-auth';

describe('debug better-auth imports (e2e)', () => {
  it('logs shape', () => {
    // eslint-disable-next-line no-console
    console.log('DEBUG-IMPORT', Object.keys(ba), 'Session type:', typeof (ba as any).Session, 'default?', (ba as any).default);
    expect(true).toBe(true);
  });
});
