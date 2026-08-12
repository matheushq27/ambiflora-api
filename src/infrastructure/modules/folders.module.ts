import { Module } from '@nestjs/common';
import { FoldersService } from '../../application/use-cases/folders.service';
import { FoldersController } from '../http/controllers/folders.controller';


@Module({
  imports: [],
  controllers: [FoldersController],
  providers: [FoldersService],
})
export class FoldersModule { }