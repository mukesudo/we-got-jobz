import { Injectable } from '@nestjs/common';

@Injectable()
export class TalentService {
  private readonly talent = [
    {
      id: 'talent_1',
      name: 'Abebe K.',
      title: 'Full-stack engineer',
      location: 'Addis Ababa, Ethiopia',
      hourlyRate: 35,
      currency: 'USD',
      skills: ['Next.js', 'NestJS', 'Prisma', 'PostgreSQL'],
      bio: 'Full-stack engineer focused on TypeScript and modern web stacks.',
    },
    {
      id: 'talent_2',
      name: 'Sara M.',
      title: 'Product designer',
      location: 'Remote',
      hourlyRate: 40,
      currency: 'USD',
      skills: ['Figma', 'Design systems', 'UX research'],
      bio: 'Product designer helping SaaS teams ship clear, usable interfaces.',
    },
  ];

  findAll() {
    return this.talent;
  }

  findOne(id: string) {
    return this.talent.find((t) => t.id === id) ?? null;
  }
}
