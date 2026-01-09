import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { PrismaModule } from './../src/prisma/prisma.module';
import { AuthModule } from './../src/auth/auth.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('module compile checks', () => {
  it('compiles PrismaModule with stubbed PrismaService', async () => {
    const prismaMock = { $connect: async () => {}, $disconnect: async () => {} } as any;
    const module = await Test.createTestingModule({ imports: [PrismaModule] })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    expect(module).toBeDefined();
  });

  it('compiles local AuthModule', async () => {
    const module = await Test.createTestingModule({ imports: [AuthModule] }).compile();
    expect(module).toBeDefined();
  });

  it('compiles AppModule with PrismaService stubbed', async () => {
    const prismaMock = { $connect: async () => {}, $disconnect: async () => {} } as any;
    try {
      const module = await Test.createTestingModule({ imports: [AppModule] })
        .overrideProvider(PrismaService)
        .useValue(prismaMock)
        .compile();
      expect(module).toBeDefined();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('AppModule compile error:', err && err.message ? err.message : err);
      throw err;
    }
  });
});
