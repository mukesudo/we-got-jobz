# Production Implementation & Deployment Guide

## Overview
This guide provides a comprehensive roadmap to complete all features and deploy the We Got Jobz marketplace to production using Vercel + Render architecture.

---

## Production Architecture

### Tech Stack
- **Frontend**: Vercel (Next.js 15)
- **Backend**: Render (NestJS)
- **Database**: Supabase (PostgreSQL)
- **Caching**: Upstash (Redis)
- **Message Queue**: RabbitMQ (Render)
- **Email**: Resend
- **Payments**: Stripe
- **Authentication**: JWT (custom implementation)
- **Observability**:
  - Grafana (metrics visualization)
  - Prometheus (metrics collection)
  - Loki (log aggregation)
  - Sentry (error tracking)
- **File Storage**: Cloudflare R2
- **Real-time**: Socket.io (WebSocket)

### Architecture Diagram
```
┌─────────────────────────────────────────────────────────┐
│                      Users                               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Vercel (Frontend)                           │
│  - Next.js 15 Application                                │
│  - Static Assets & Serverless Functions                 │
│  - CDN & Edge Caching                                   │
│  - Vercel Analytics                                     │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Render (Backend API)                         │
│  - NestJS Application                                    │
│  - WebSocket Server (Socket.io)                          │
│  - JWT Authentication                                   │
│  - Background Job Processor                             │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌───────────────┐         ┌──────────────┐
│  Supabase PG  │         │  Upstash     │
│  PostgreSQL   │         │    Redis     │
│  Database     │         │    Cache     │
└───────────────┘         └──────────────┘
        │                         │
        └────────────┬────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌───────────────┐         ┌──────────────┐
│  RabbitMQ     │         │   Resend     │
│  Message Queue│         │   Email      │
│  (Render)     │         │  Service     │
└───────────────┘         └──────────────┘
        │                         │
        └────────────┬────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌───────────────┐         ┌──────────────┐
│ Cloudflare R2 │         │   Stripe     │
│ File Storage  │         │  Payments    │
└───────────────┘         └──────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌───────────────┐         ┌──────────────┐
│  Prometheus   │         │   Sentry     │
│  Metrics      │         │  Error Track │
└───────────────┘         └──────────────┘
        │
        ▼
┌───────────────┐
│   Grafana     │
│  Visualization│
└───────────────┘
```

---

## Phase 1: Infrastructure Setup

### Step 1: Set Up Supabase (Database)

#### Create Supabase Project
```bash
# 1. Go to https://supabase.com
# 2. Click "New Project"
# 3. Fill in project details:
#    - Name: we-got-jobz
#    - Database Password: [generate strong password]
#    - Region: choose closest to your users
# 4. Click "Create new project"
```

#### Configure Database
```bash
# Get connection details from Supabase dashboard:
# Project Settings → Database
# Connection string: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

#### Update Environment Variables
```bash
# Add to .env
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
```

#### Enable Row Level Security (Optional)
```sql
-- In Supabase SQL Editor:
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
```

---

### Step 2: Set Up Upstash (Redis)

#### Create Upstash Redis Database
```bash
# 1. Go to https://upstash.com
# 2. Click "Create Database"
# 3. Choose region
# 4. Click "Create"
# 5. Copy REST API URL and Token
```

#### Update Environment Variables
```bash
# Add to .env
UPSTASH_REDIS_REST_URL=https://[id].upstash.io
UPSTASH_REDIS_REST_TOKEN=[token]
# Or for direct connection:
REDIS_URL=redis://default:[password]@[host]:[port]
```

---

### Step 3: Set Up RabbitMQ (Render)

#### Create RabbitMQ Service on Render
```bash
# 1. Go to https://render.com
# 2. Click "New" → "Web Service"
# 3. Select "RabbitMQ" from marketplace
# 4. Configure:
#    - Name: we-got-jobz-rabbitmq
#    - Region: choose closest
# 5. Click "Create"
# 6. Copy connection URL
```

#### Update Environment Variables
```bash
# Add to .env
RABBITMQ_URL=amqp://[user]:[password]@[host]:5672
RABBITMQ_HOST=[host]
RABBITMQ_PORT=5672
RABBITMQ_USER=[user]
RABBITMQ_PASSWORD=[password]
```

---

### Step 4: Set Up Resend (Email)

#### Create Resend Account
```bash
# 1. Go to https://resend.com
# 2. Sign up and verify email
# 3. Go to API Keys → Create API Key
# 4. Copy API key
```

#### Verify Domain
```bash
# 1. Go to Domains → Add Domain
# 2. Add your domain (e.g., we-got-jobz.com)
# 3. Add DNS records (TXT, CNAME)
# 4. Wait for verification
```

#### Update Environment Variables
```bash
# Add to .env
RESEND_API_KEY=re_[api-key]
RESEND_FROM_EMAIL=noreply@wegotjobz.com
RESEND_FROM_NAME=We Got Jobz
```

---

### Step 5: Set Up Stripe (Payments)

#### Create Stripe Account
```bash
# 1. Go to https://stripe.com
# 2. Sign up and complete business verification
# 3. Go to Developers → API Keys
# 4. Copy Publishable and Secret keys
```

#### Configure Webhooks
```bash
# 1. Go to Developers → Webhooks
# 2. Add endpoint: https://[backend-url].onrender.com/webhooks/stripe
# 3. Select events:
#    - payment_intent.succeeded
#    - payment_intent.failed
#    - charge.refunded
#    - customer.subscription.created
#    - customer.subscription.updated
# 4. Copy webhook secret
```

#### Update Environment Variables
```bash
# Add to .env
STRIPE_SECRET_KEY=sk_live_[key]
STRIPE_PUBLISHABLE_KEY=pk_live_[key]
STRIPE_WEBHOOK_SECRET=whsec_[secret]
STRIPE_PLATFORM_FEE_PERCENTAGE=10
STRIPE_CURRENCY=usd
```

---

### Step 6: Set Up JWT Authentication

#### Install Dependencies
```bash
cd apps/backend
pnpm add @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
pnpm add -D @types/passport-jwt @types/bcrypt
```

#### Create JWT Strategy
```typescript
// apps/backend/src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
```

#### Update Environment Variables
```bash
# Add to .env
JWT_SECRET=[generate-strong-random-string]
JWT_EXPIRY=7d
```

---

### Step 7: Set Up Observability Stack

#### Install Sentry
```bash
cd apps/backend
pnpm add @sentry/node @sentry/tracing
```

#### Configure Sentry
```typescript
// apps/backend/src/main.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

#### Set Up Prometheus (Render)
```bash
# 1. Create Prometheus service on Render
# 2. Use Docker image: prom/prometheus
# 3. Mount config volume
# 4. Configure scrape targets
```

#### Set Up Grafana (Render)
```bash
# 1. Create Grafana service on Render
# 2. Use Docker image: grafana/grafana
# 3. Configure Prometheus data source
# 4. Create dashboards
```

#### Set Up Loki (Render)
```bash
# 1. Create Loki service on Render
# 2. Use Docker image: grafana/loki
# 3. Configure log ingestion
```

#### Update Environment Variables
```bash
# Add to .env
SENTRY_DSN=https://[key]@sentry.io/[project-id]
PROMETHEUS_ENABLED=true
PROMETHEUS_PORT=9090
GRAFANA_ENABLED=true
GRAFANA_PORT=3000
LOKI_ENABLED=true
LOKI_PORT=3100
```

---

### Step 8: Set Up Cloudflare R2 (File Storage)

#### Create R2 Bucket
```bash
# 1. Go to Cloudflare Dashboard → R2
# 2. Create bucket: we-got-jobz-uploads
# 3. Generate API token
# 4. Copy credentials
```

#### Update Environment Variables
```bash
# Add to .env
CLOUDFLARE_R2_ACCESS_KEY_ID=[access-key]
CLOUDFLARE_R2_SECRET_ACCESS_KEY=[secret-key]
CLOUDFLARE_R2_BUCKET_NAME=we-got-jobz-uploads
CLOUDFLARE_R2_ACCOUNT_ID=[account-id]
CLOUDFLARE_R2_PUBLIC_DOMAIN=pub-[id].r2.dev
```

---

## Phase 2: Feature Implementation

### Step 1: Email Service Integration

#### Install Dependencies
```bash
cd apps/backend
pnpm add @resend/node
```

#### Create Email Service
```typescript
// apps/backend/src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { Resend } from '@resend/node';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendWelcomeEmail(email: string, name: string) {
    await this.resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      to: [email],
      subject: 'Welcome to We Got Jobz!',
      html: this.getWelcomeTemplate(name),
    });
  }

  async sendBidNotification(email: string, jobTitle: string) {
    await this.resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      to: [email],
      subject: `New bid received for "${jobTitle}"`,
      html: this.getBidNotificationTemplate(jobTitle),
    });
  }

  async sendContractAwarded(email: string, jobTitle: string) {
    await this.resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      to: [email],
      subject: `Congratulations! You've been awarded "${jobTitle}"`,
      html: this.getContractAwardedTemplate(jobTitle),
    });
  }

  async sendPaymentProcessed(email: string, amount: number) {
    await this.resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      to: [email],
      subject: `Payment of $${amount} processed`,
      html: this.getPaymentProcessedTemplate(amount),
    });
  }

  async sendPasswordReset(email: string, resetLink: string) {
    await this.resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      to: [email],
      subject: 'Reset your password',
      html: this.getPasswordResetTemplate(resetLink),
    });
  }

  private getWelcomeTemplate(name: string): string {
    return `
      <h1>Welcome to We Got Jobz, ${name}!</h1>
      <p>Thank you for joining our platform. We're excited to help you find the perfect opportunities.</p>
      <p>Get started by <a href="${process.env.NEXT_PUBLIC_APP_URL}/marketplace/jobs">browsing jobs</a> or <a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs/create">posting a project</a>.</p>
    `;
  }

  private getBidNotificationTemplate(jobTitle: string): string {
    return `
      <h1>New Bid Received</h1>
      <p>You have received a new bid for your project: "${jobTitle}"</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/marketplace/dashboard">View bids</a></p>
    `;
  }

  private getContractAwardedTemplate(jobTitle: string): string {
    return `
      <h1>Congratulations!</h1>
      <p>You have been awarded the project: "${jobTitle}"</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/marketplace/dashboard">View contract</a></p>
    `;
  }

  private getPaymentProcessedTemplate(amount: number): string {
    return `
      <h1>Payment Processed</h1>
      <p>A payment of $${amount} has been successfully processed.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/marketplace/dashboard">View transactions</a></p>
    `;
  }

  private getPasswordResetTemplate(resetLink: string): string {
    return `
      <h1>Reset Your Password</h1>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetLink}">Reset Password</a></p>
      <p>This link will expire in 1 hour.</p>
    `;
  }
}
```

---

### Step 2: Real-time Chat (WebSocket)

#### Install Dependencies
```bash
cd apps/backend
pnpm add @nestjs/websockets @nestjs/platform-socket.io socket.io

cd apps/frontend
pnpm add socket.io-client
```

#### Create Chat Gateway
```typescript
// apps/backend/src/chat/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from '../messages/messages.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>(); // socketId -> userId

  constructor(
    private jwtService: JwtService,
    private messagesService: MessagesService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const payload = this.jwtService.verify(token);
      this.connectedUsers.set(client.id, payload.sub);
      console.log(`Client connected: ${client.id} (User: ${payload.sub})`);
      
      // Join user's personal room for notifications
      client.join(`user:${payload.sub}`);
      
      // Emit online status
      this.server.emit('userOnline', { userId: payload.sub });
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    if (userId) {
      this.connectedUsers.delete(client.id);
      this.server.emit('userOffline', { userId });
      console.log(`Client disconnected: ${client.id} (User: ${userId})`);
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string }
  ) {
    const userId = this.connectedUsers.get(client.id);
    client.join(data.roomId);
    client.emit('joinedRoom', { roomId: data.roomId });
    
    // Notify others in room
    client.to(data.roomId).emit('userJoinedRoom', { userId, roomId: data.roomId });
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string }
  ) {
    const userId = this.connectedUsers.get(client.id);
    client.leave(data.roomId);
    client.emit('leftRoom', { roomId: data.roomId });
    
    // Notify others in room
    client.to(data.roomId).emit('userLeftRoom', { userId, roomId: data.roomId });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; content: string; contractId: string }
  ) {
    const userId = this.connectedUsers.get(client.id);
    
    // Save message to database
    const message = await this.messagesService.create({
      senderId: userId,
      contractId: data.contractId,
      content: data.content,
    });

    // Broadcast to room
    this.server.to(data.roomId).emit('newMessage', message);
    
    // Send notification to recipient
    const contract = await this.messagesService.getContract(data.contractId);
    const recipientId = contract.clientId === userId ? contract.freelancerId : contract.clientId;
    this.server.to(`user:${recipientId}`).emit('newMessageNotification', message);
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; isTyping: boolean }
  ) {
    const userId = this.connectedUsers.get(client.id);
    client.to(data.roomId).emit('userTyping', {
      userId,
      isTyping: data.isTyping,
    });
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string }
  ) {
    const userId = this.connectedUsers.get(client.id);
    await this.messagesService.markAsRead(data.messageId, userId);
  }
}
```

#### Create Frontend Socket Client
```typescript
// apps/frontend/src/lib/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = (token: string): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000', {
      auth: { token },
      transports: ['websocket'],
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): Socket | null => socket;
```

---

### Step 3: Video Interviews

#### Install Dependencies
```bash
cd apps/backend
pnpm add @nestjs/common @nestjs/config

cd apps/frontend
pnpm add daily-react
```

#### Create Video Service
```typescript
// apps/backend/src/video/video.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VideoService {
  constructor(private configService: ConfigService) {}

  createRoom(contractId: string) {
    // Using Daily.co or similar service
    // Return room URL
    return {
      roomUrl: `https://we-got-jobz.daily.co/${contractId}`,
      token: this.generateToken(contractId),
    };
  }

  private generateToken(contractId: string): string {
    // Generate token for video room
    return 'room-token-' + contractId;
  }
}
```

---

### Step 4: Escrow Payments

#### Create Escrow Service
```typescript
// apps/backend/src/escrow/escrow.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class EscrowService {
  constructor(
    private prisma: PrismaService,
    private paymentService: PaymentsService,
  ) {}

  async holdFunds(contractId: string, amount: number) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
      include: { project: true },
    });

    if (!contract) {
      throw new BadRequestException('Contract not found');
    }

    // Create payment intent with Stripe
    const paymentIntent = await this.paymentService.createPaymentIntent({
      amount: amount * 100, // Convert to cents
      currency: process.env.STRIPE_CURRENCY || 'usd',
      metadata: {
        contractId,
        type: 'escrow',
      },
      capture_method: 'manual', // Don't capture immediately
    });

    // Create escrow record
    const escrow = await this.prisma.escrow.create({
      data: {
        contractId,
        amount,
        paymentIntentId: paymentIntent.id,
        status: 'HELD',
        platformFee: amount * (parseFloat(process.env.STRIPE_PLATFORM_FEE_PERCENTAGE) / 100),
      },
    });

    return { escrow, clientSecret: paymentIntent.client_secret };
  }

  async releaseFunds(escrowId: string) {
    const escrow = await this.prisma.escrow.findUnique({
      where: { id: escrowId },
      include: { contract: true },
    });

    if (!escrow) {
      throw new BadRequestException('Escrow not found');
    }

    if (escrow.status !== 'HELD') {
      throw new BadRequestException('Funds cannot be released');
    }

    // Capture payment intent
    const paymentIntent = await this.paymentService.capturePaymentIntent(escrow.paymentIntentId);

    // Transfer to freelancer's connected account
    const transfer = await this.paymentService.transferToConnectedAccount({
      amount: paymentIntent.amount - Math.round(escrow.platformFee * 100),
      currency: paymentIntent.currency,
      destination: escrow.contract.freelancerStripeAccountId,
      metadata: {
        escrowId,
        contractId: escrow.contractId,
      },
    });

    // Update escrow status
    await this.prisma.escrow.update({
      where: { id: escrowId },
      data: {
        status: 'RELEASED',
        releasedAt: new Date(),
        transferId: transfer.id,
      },
    });

    return transfer;
  }

  async refundFunds(escrowId: string) {
    const escrow = await this.prisma.escrow.findUnique({
      where: { id: escrowId },
    });

    if (!escrow) {
      throw new BadRequestException('Escrow not found');
    }

    if (escrow.status !== 'HELD') {
      throw new BadRequestException('Funds cannot be refunded');
    }

    // Refund payment intent
    const refund = await this.paymentService.refundPaymentIntent(escrow.paymentIntentId);

    // Update escrow status
    await this.prisma.escrow.update({
      where: { id: escrowId },
      data: {
        status: 'REFUNDED',
        refundedAt: new Date(),
        refundId: refund.id,
      },
    });

    return refund;
  }

  async partialRelease(escrowId: string, amount: number) {
    const escrow = await this.prisma.escrow.findUnique({
      where: { id: escrowId },
      include: { contract: true },
    });

    if (escrow.amount < amount) {
      throw new BadRequestException('Amount exceeds escrow balance');
    }

    // Partial capture and transfer
    const paymentIntent = await this.paymentService.partialCapturePaymentIntent(
      escrow.paymentIntentId,
      amount * 100,
    );

    const transfer = await this.paymentService.transferToConnectedAccount({
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      destination: escrow.contract.freelancerStripeAccountId,
    });

    await this.prisma.escrow.update({
      where: { id: escrowId },
      data: {
        amount: escrow.amount - amount,
        releasedAt: new Date(),
      },
    });

    return transfer;
  }
}
```

---

### Step 5: Dispute Resolution

#### Create Dispute Service
```typescript
// apps/backend/src/disputes/disputes.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class DisputesService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async createDispute(contractId: string, reason: string, description: string, userId: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      throw new BadRequestException('Contract not found');
    }

    if (contract.clientId !== userId && contract.freelancerId !== userId) {
      throw new BadRequestException('Not authorized to dispute this contract');
    }

    const dispute = await this.prisma.dispute.create({
      data: {
        contractId,
        raisedBy: userId,
        reason,
        description,
        status: 'PENDING',
      },
    });

    // Notify admin
    await this.emailService.sendDisputeNotification(
      'admin@wegotjobz.com',
      contractId,
      reason,
    );

    return dispute;
  }

  async addEvidence(disputeId: string, fileUrl: string, description: string, userId: string) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
      include: { contract: true },
    });

    if (dispute.contract.clientId !== userId && dispute.contract.freelancerId !== userId) {
      throw new BadRequestException('Not authorized');
    }

    return this.prisma.disputeEvidence.create({
      data: {
        disputeId,
        fileUrl,
        description,
        submittedBy: userId,
      },
    });
  }

  async resolveDispute(disputeId: string, resolution: string, refundAmount: number, adminId: string) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
      include: { contract: true },
    });

    if (dispute.status !== 'PENDING') {
      throw new BadRequestException('Dispute already resolved');
    }

    const resolvedDispute = await this.prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status: 'RESOLVED',
        resolution,
        resolvedBy: adminId,
        resolvedAt: new Date(),
        refundAmount,
      },
    });

    // Notify parties
    await this.emailService.sendDisputeResolution(
      dispute.contract.clientId,
      disputeId,
      resolution,
    );
    await this.emailService.sendDisputeResolution(
      dispute.contract.freelancerId,
      disputeId,
      resolution,
    );

    return resolvedDispute;
  }
}
```

---

### Step 6: Premium Subscriptions

#### Create Subscription Service
```typescript
// apps/backend/src/subscriptions/subscriptions.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    private prisma: PrismaService,
    private paymentService: PaymentsService,
  ) {}

  async createSubscription(userId: string, planId: string) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new BadRequestException('Plan not found');
    }

    // Create Stripe subscription
    const subscription = await this.paymentService.createSubscription({
      customerId: await this.getOrCreateStripeCustomer(userId),
      priceId: plan.stripePriceId,
    });

    return this.prisma.subscription.create({
      data: {
        userId,
        planId,
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });
  }

  async cancelSubscription(subscriptionId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    await this.paymentService.cancelSubscription(subscription.stripeSubscriptionId);

    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'CANCELED',
        cancelAtPeriodEnd: true,
      },
    });
  }

  async hasPremiumAccess(userId: string): Promise<boolean> {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        currentPeriodEnd: {
          gte: new Date(),
        },
      },
    });

    return !!subscription;
  }
}
```

---

### Step 7: Rate Limiting with Upstash

#### Install Dependencies
```bash
cd apps/backend
pnpm add @nestjs/throttler @upstash/redis
```

#### Configure Rate Limiting
```typescript
// apps/backend/src/app.module.ts
import { ThrottlerModule } from '@nestjs/throttler';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 100, // 100 requests per minute
      storage: new ThrottlerStorageRedisService(redis),
    }]),
    // ... other imports
  ],
  // ...
})
export class AppModule {}
```

---

### Step 8: Caching with Upstash

#### Install Dependencies
```bash
cd apps/backend
pnpm add @upstash/redis
```

#### Configure Cache Service
```typescript
// apps/backend/src/cache/cache.service.ts
import { Injectable } from '@nestjs/common';
import { Redis } from '@upstash/redis';

@Injectable()
export class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  async get(key: string): Promise<any> {
    return await this.redis.get(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.setex(key, ttl, value);
    } else {
      await this.redis.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
```

#### Use Caching in Services
```typescript
// apps/backend/src/jobs/jobs.service.ts
@Injectable()
export class JobsService {
  constructor(
    private cacheService: CacheService,
    private prisma: PrismaService,
  ) {}

  async findAll(): Promise<Job[]> {
    const cacheKey = 'jobs:all';
    let jobs = await this.cacheService.get(cacheKey);

    if (!jobs) {
      jobs = await this.prisma.job.findMany();
      await this.cacheService.set(cacheKey, jobs, 300); // 5 minutes
    }

    return jobs;
  }

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const job = await this.prisma.job.create({ data: createJobDto });
    await this.cacheService.invalidatePattern('jobs:*');
    return job;
  }
}
```

---

### Step 9: Background Jobs with RabbitMQ

#### Install Dependencies
```bash
cd apps/backend
pnpm add @nestjs/microservices amqplib amqp-connection-manager
pnpm add -D @types/amqplib
```

#### Configure RabbitMQ Module
```typescript
// apps/backend/src/rabbitmq/rabbitmq.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: 'we_got_jobz_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitMQModule {}
```

#### Create Queue Processor
```typescript
// apps/backend/src/queues/email.processor.ts
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailService } from '../email/email.service';

@Processor('email')
export class EmailProcessor {
  constructor(private emailService: EmailService) {}

  @Process('sendWelcome')
  async handleSendWelcome(job: Job<{ email: string; name: string }>) {
    await this.emailService.sendWelcomeEmail(job.data.email, job.data.name);
  }

  @Process('sendBidNotification')
  async handleBidNotification(job: Job<{ email: string; jobTitle: string }>) {
    await this.emailService.sendBidNotification(job.data.email, job.data.jobTitle);
  }
}
```

---

### Step 10: File Upload with Cloudflare R2

#### Install Dependencies
```bash
cd apps/backend
pnpm add @aws-sdk/client-s3 multer
pnpm add -D @types/multer @types/aws-sdk
```

#### Create Storage Service
```typescript
// apps/backend/src/storage/storage.service.ts
import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, key: string) {
    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3.send(command);

    return `https://${process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN}/${key}`;
  }

  async getSignedUrl(key: string, expiresIn: number = 3600) {
    const command = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(this.s3, command, { expiresIn });
  }
}
```

#### Create Upload Controller
```typescript
// apps/backend/src/storage/storage.controller.ts
import { Controller, Post, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('key') key: string) {
    const url = await this.storageService.uploadFile(file, key);
    return { url };
  }
}
```

---

### Step 11: Security Hardening

#### Install Dependencies
```bash
cd apps/backend
pnpm add helmet
pnpm add -D @types/helmet
```

#### Configure Security Headers
```typescript
// apps/backend/src/main.ts
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }));

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  await app.listen(3000);
}
```

---

## Phase 3: Deployment to Production

### Step 1: Deploy Backend to Render

#### Create Render Account
```bash
# 1. Go to https://render.com
# 2. Sign up and connect GitHub
```

#### Deploy Backend Service
```bash
# In Render dashboard:
# 1. Click "New" → "Web Service"
# 2. Connect GitHub repository
# 3. Configure:
#    - Name: we-got-jobz-backend
#    - Root Directory: apps/backend
#    - Build Command: pnpm install && pnpm run build
#    - Start Command: pnpm run start:prod
#    - Environment Variables: Add all from .env
# 4. Click "Create Web Service"
```

#### Configure Environment Variables on Render
```bash
# Add these to Render environment variables:
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
RABBITMQ_URL=amqp://...
RABBITMQ_HOST=...
RABBITMQ_PORT=5672
RABBITMQ_USER=...
RABBITMQ_PASSWORD=...
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@wegotjobz.com
RESEND_FROM_NAME=We Got Jobz
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PLATFORM_FEE_PERCENTAGE=10
STRIPE_CURRENCY=usd
JWT_SECRET=[strong-secret]
JWT_EXPIRY=7d
SENTRY_DSN=https://...
CLOUDFLARE_R2_ACCESS_KEY_ID=...
CLOUDFLARE_R2_SECRET_ACCESS_KEY=...
CLOUDFLARE_R2_BUCKET_NAME=we-got-jobz-uploads
CLOUDFLARE_R2_ACCOUNT_ID=...
CLOUDFLARE_R2_PUBLIC_DOMAIN=...
FRONTEND_URL=https://your-domain.vercel.app
NODE_ENV=production
```

#### Update Backend for Render
```typescript
// apps/backend/src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for Render
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  });

  // Set port
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
```

---

### Step 2: Deploy Frontend to Vercel

#### Create Vercel Account
```bash
# 1. Go to https://vercel.com
# 2. Sign up and connect GitHub
```

#### Deploy Frontend Project
```bash
# In Vercel dashboard:
# 1. Click "Add New Project"
# 2. Select we-got-jobz repository
# 3. Configure:
#    - Root Directory: apps/frontend
#    - Framework Preset: Next.js
#    - Build Command: pnpm build
#    - Output Directory: .next
# 4. Add environment variables
# 5. Click "Deploy"
```

#### Configure Environment Variables on Vercel
```bash
# Add these to Vercel environment variables:
NEXT_PUBLIC_API_URL=https://we-got-jobz-backend.onrender.com
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_WS_URL=wss://we-got-jobz-backend.onrender.com
```

#### Configure Domain
```bash
# In Vercel project settings:
# 1. Go to Settings → Domains
# 2. Add custom domain (e.g., we-got-jobz.com)
# 3. Configure DNS records
# 4. Enable automatic HTTPS
```

---

### Step 3: Deploy Observability Stack to Render

#### Deploy Prometheus
```bash
# Create new Web Service on Render
# Use Docker image: prom/prometheus
# Mount prometheus.yml config
# Configure scrape targets
```

#### Deploy Grafana
```bash
# Create new Web Service on Render
# Use Docker image: grafana/grafana
# Configure Prometheus data source
# Create dashboards
```

#### Deploy Loki
```bash
# Create new Web Service on Render
# Use Docker image: grafana/loki
# Configure log ingestion
```

---

## Phase 4: Production Checklist

### Pre-Launch Checklist
- [ ] Supabase database configured
- [ ] Upstash Redis configured
- [ ] RabbitMQ configured on Render
- [ ] Resend email service configured
- [ ] Stripe configured in live mode
- [ ] JWT authentication implemented
- [ ] Sentry error tracking configured
- [ ] Prometheus metrics configured
- [ ] Grafana dashboards created
- [ ] Loki log aggregation configured
- [ ] Cloudflare R2 storage configured
- [ ] Real-time chat (WebSocket) implemented
- [ ] Video interviews implemented
- [ ] Escrow payments implemented
- [ ] Dispute resolution implemented
- [ ] Premium subscriptions implemented
- [ ] Rate limiting configured
- [ ] Caching strategy implemented
- [ ] Background jobs processing
- [ ] File upload working
- [ ] Security headers configured
- [ ] All tests passing (>80% coverage)
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Domain configured
- [ ] SSL certificates valid
- [ ] DNS propagated
- [ ] Monitoring configured
- [ ] Error tracking working
- [ ] Logging configured
- [ ] Webhook endpoints verified
- [ ] Email templates tested
- [ ] Performance testing completed
- [ ] Security audit completed
- [ ] Documentation updated

### Launch Day Checklist
- [ ] Verify all services running
- [ ] Test authentication flow
- [ ] Test job posting
- [ ] Test bidding system
- [ ] Test payment flow (small amount)
- [ ] Test escrow release
- [ ] Test refund flow
- [ ] Test email notifications
- [ ] Test real-time messaging
- [ ] Test video interviews
- [ ] Test dispute creation
- [ ] Test subscription signup
- [ ] Verify monitoring working
- [ ] Check error logs
- [ ] Monitor performance metrics
- [ ] Test backup restore
- [ ] Enable marketing
- [ ] Announce launch

### Post-Launch Checklist
- [ ] Monitor performance 24/7 for first week
- [ ] Review error logs daily
- [ ] Check user feedback
- [ ] Optimize slow queries
- [ ] Fix any bugs found
- [ ] Scale infrastructure if needed
- [ ] Review costs
- [ ] Update documentation
- [ ] Plan next features

---

## Phase 5: Cost Management

### Monthly Costs (Free Tier)
- **Vercel**: $0 (Free tier)
  - 100GB bandwidth
  - Unlimited deployments
  
- **Render Backend**: $7-25/month
  - Free tier: $0 (512MB RAM, sleeps after inactivity)
  - Starter: $7/month (512MB RAM, always on)
  - Standard: $25/month (1GB RAM)
  
- **Supabase**: $0 (Free tier)
  - 500MB database
  - 1GB storage
  
- **Upstash**: $0 (Free tier)
  - 10,000 commands/day
  - 256MB storage
  
- **RabbitMQ on Render**: $7-25/month
  - Same pricing as backend
  
- **Resend**: $0 (Free tier)
  - 3,000 emails/month
  
- **Cloudflare R2**: $0 (Free tier)
  - 10GB storage
  - 1M Class A operations/month
  
- **Sentry**: $0 (Free tier)
  - 5,000 errors/month
  
- **Prometheus/Grafana/Loki**: $0 (on Render free tier)
  - If using Render free tier

- **Stripe**: Transaction fees only
  - 2.9% + 30¢ per transaction

### Total Estimated Cost
- **Free Tier**: ~$0-7/month (if using Render free tier)
- **Starter**: ~$14-32/month (Render Starter for backend + RabbitMQ)
- **Standard**: ~$32-50/month (Render Standard for backend + RabbitMQ)

### Scaling Costs
- **Render Pro**: $50-200/month (more RAM/CPU)
- **Supabase Pro**: $25-500/month (larger database)
- **Upstash Pro**: $5-50/month (more commands)
- **Vercel Pro**: $20/month (if needed)

**Estimated at scale**: $100-500/month

---

## Phase 6: Timeline

### Week 1: Infrastructure Setup
- Set up Supabase database
- Configure Upstash Redis
- Set up RabbitMQ on Render
- Configure Resend email
- Set up Stripe
- Implement JWT authentication
- Set up observability stack
- Configure Cloudflare R2

### Week 2: Core Features
- Implement email service integration
- Set up rate limiting
- Implement caching strategy
- Set up background jobs
- Implement file upload
- Security hardening
- Logging configuration

### Week 3: Advanced Features
- Implement real-time chat (WebSocket)
- Implement video interviews
- Implement escrow payments
- Implement dispute resolution

### Week 4: Final Features & Deployment
- Implement premium subscriptions
- Comprehensive testing
- Deploy backend to Render
- Deploy frontend to Vercel
- Configure monitoring
- Performance testing
- Launch

### Post-Launch
- Monitor and fix issues
- Optimize performance
- Implement secondary features

---

## Phase 7: Environment Variables Reference

### Backend Environment Variables (.env)
```bash
# Database
DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
SUPABASE_URL=https://[ref].supabase.co
SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]

# Cache
UPSTASH_REDIS_REST_URL=https://[id].upstash.io
UPSTASH_REDIS_REST_TOKEN=[token]

# Message Queue
RABBITMQ_URL=amqp://[user]:[password]@[host]:5672
RABBITMQ_HOST=[host]
RABBITMQ_PORT=5672
RABBITMQ_USER=[user]
RABBITMQ_PASSWORD=[password]

# Email
RESEND_API_KEY=re_[api-key]
RESEND_FROM_EMAIL=noreply@wegotjobz.com
RESEND_FROM_NAME=We Got Jobz

# Payments
STRIPE_SECRET_KEY=sk_live_[key]
STRIPE_PUBLISHABLE_KEY=pk_live_[key]
STRIPE_WEBHOOK_SECRET=whsec_[secret]
STRIPE_PLATFORM_FEE_PERCENTAGE=10
STRIPE_CURRENCY=usd

# Authentication
JWT_SECRET=[strong-secret]
JWT_EXPIRY=7d

# Observability
SENTRY_DSN=https://[key]@sentry.io/[project-id]
PROMETHEUS_ENABLED=true
PROMETHEUS_PORT=9090
GRAFANA_ENABLED=true
GRAFANA_PORT=3000
LOKI_ENABLED=true
LOKI_PORT=3100

# Storage
CLOUDFLARE_R2_ACCESS_KEY_ID=[access-key]
CLOUDFLARE_R2_SECRET_ACCESS_KEY=[secret-key]
CLOUDFLARE_R2_BUCKET_NAME=we-got-jobz-uploads
CLOUDFLARE_R2_ACCOUNT_ID=[account-id]
CLOUDFLARE_R2_PUBLIC_DOMAIN=pub-[id].r2.dev

# Application
FRONTEND_URL=https://your-domain.vercel.app
BACKEND_URL=https://we-got-jobz-backend.onrender.com
NODE_ENV=production
PORT=3000
```

### Frontend Environment Variables (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://we-got-jobz-backend.onrender.com
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_WS_URL=wss://we-got-jobz-backend.onrender.com
```

---

## Next Steps

1. **Create Accounts**: Sign up for all required services (Supabase, Upstash, Render, Resend, Stripe, Cloudflare, Sentry)
2. **Set Up Infrastructure**: Follow Phase 1 to configure all services
3. **Implement Features**: Follow Phase 2 to implement all features
4. **Deploy**: Follow Phase 3 to deploy to production
5. **Test**: Use checklists to verify everything works
6. **Monitor**: Set up alerts and monitor closely
7. **Iterate**: Fix issues and improve based on feedback

---

**Last Updated**: April 25, 2026
**Status**: Ready for Implementation
**Estimated Timeline**: 4 weeks to production launch
**Architecture**: Vercel + Render + Supabase + Upstash + RabbitMQ
