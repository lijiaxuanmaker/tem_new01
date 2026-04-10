import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@/modules/auth/auth.module';
import { QuestionModule } from '@/modules/question/question.module';

@Module({
  imports: [AuthModule, QuestionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
