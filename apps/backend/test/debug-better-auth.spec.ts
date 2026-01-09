import * as ba from '@thallesp/nestjs-better-auth';

describe('debug better-auth imports', () => {
  it('logs shape', () => {
    // eslint-disable-next-line no-console
    console.log('DEBUG-IMPORT', Object.keys(ba), 'Session type:', typeof (ba as any).Session);
    expect(true).toBe(true);
  });
});
