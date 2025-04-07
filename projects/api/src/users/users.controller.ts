import { Controller, Inject, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { UserDto } from 'src/users/user.model';
import { UsersService } from 'src/users/users.service';

@Controller()
export class UsersController {
  private readonly _logger = new Logger(UsersController.name);

  constructor(@Inject() private readonly _usersService: UsersService) {}

  @EventPattern(process.env.KEVCHAT_IDP_USER_UPSERT_TOPIC_NAME)
  async handleUserUpsert(
    @Payload() data: UserDto,
    @Ctx() context: KafkaContext,
  ) {
    try {
      const { _id, ...newUser } = data;

      await this._usersService.create({
        ...newUser,
        externalId: _id,
      });
    } catch (error) {
      this._logger.error(
        `Failed to handle user upsert for user with extenalId: ${data._id}`,
        error,
      );
    }

    await this._commitMessageOffset(context);
  }

  private async _commitMessageOffset(context: KafkaContext) {
    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    const consumer = context.getConsumer();
    await consumer.commitOffsets([{ topic, partition, offset }]);
  }
}
