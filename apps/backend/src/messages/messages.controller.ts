import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async list(
    @Session() session: UserSession,
    @Query('projectId') projectId?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    if (!session) throw new UnauthorizedException();

    const parsedSkip = Number(skip) || 0;
    const parsedTake = Number(take) || 50;

    if (projectId) {
      return this.messagesService.findByProject(projectId, parsedSkip, parsedTake);
    }

    return this.messagesService.findByUser(session.user.id, parsedSkip, parsedTake);
  }

  @Get('unread')
  async unread(@Session() session: UserSession) {
    if (!session) throw new UnauthorizedException();
    return this.messagesService.findUnread(session.user.id);
  }

  @Post()
  async create(
    @Session() session: UserSession,
    @Body() payload: CreateMessageDto,
  ) {
    if (!session) throw new UnauthorizedException();
    return this.messagesService.create(
      session.user.id,
      payload.receiverId,
      payload.content,
      payload.projectId,
    );
  }

  @Patch(':id/read')
  async markAsRead(@Session() session: UserSession, @Param('id') id: string) {
    if (!session) throw new UnauthorizedException();
    return this.messagesService.markAsRead(id, session.user.id);
  }
}
