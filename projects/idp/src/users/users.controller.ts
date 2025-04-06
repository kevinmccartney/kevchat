import {
  Controller,
  Inject,
  Logger,
  Post,
  Response,
  Request,
  Get,
  Param,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';
import { UsersService } from './users.service';
import { UserDto } from 'src/users/user.model';

@Controller('/users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(@Inject() private readonly _usersService: UsersService) {}

  @Post('')
  async createUser(
    @Request() req: ExpressRequest,
    @Response() res: ExpressResponse,
  ) {
    try {
      const userExists = await this._usersService.findByUsername(
        req.body.username,
      );
      if (userExists) {
        this.logger.warn(
          `Username "${req.body.username}" already exists. Cannot create user.`,
        );
        return res.status(400).json({
          error: 'Username already exists',
        });
      }
    } catch (err) {
      this.logger.error(
        `Unexpected error while checking for existing username`,
        err,
      );
      return res.status(500).json({
        error: 'Internal server error',
      });
    }

    try {
      const user = await this._usersService.create(req.body);

      return res.status(201).json(user);
    } catch (err) {
      console.error('Error creating user', err);

      return res.status(500).render('error', {
        errorMessage: err.error_description,
      });
    }
  }

  @Get()
  async findAll() {
    return await this._usersService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserDto> {
    let response: Nullable<UserDto>;

    if (id.length !== 24) {
      throw new HttpException('Invalid ID format', 400);
    }

    try {
      response = await this._usersService.findOne(id);
    } catch (error) {
      console.error(error);

      throw new HttpException('Internal server error', 500);
    }

    if (!response) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return response;
  }
}
