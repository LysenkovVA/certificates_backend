import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../auth/auth.guard";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { UpdateSubscriptionDto } from "./dto/update-subscription.dto";
import { SubscriptionsService } from "./subscriptions.service";

@ApiTags("Подписки")
@Controller("subscriptions")
// ⛔️ТОЛЬКО АВТОРИЗОВАННЫЕ ПОЛЬЗОВАТЕЛИ
@UseGuards(AuthGuard)
export class SubscriptionsController {
    constructor(private readonly subscriptionsService: SubscriptionsService) {}

    @Post()
    async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
        return await this.subscriptionsService.create(createSubscriptionDto);
    }

    @Get()
    async findAll(
        @Query("limit", ParseIntPipe) limit: number,
        @Query("offset", ParseIntPipe) offset: number,
    ) {
        return await this.subscriptionsService.findAll(limit, offset);
    }

    @Get(":id")
    async findOne(@Param("id", ParseIntPipe) id: number) {
        return await this.subscriptionsService.findOne(id);
    }

    @Patch(":id")
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateSubscriptionDto: UpdateSubscriptionDto,
    ) {
        return await this.subscriptionsService.update(
            id,
            updateSubscriptionDto,
        );
    }

    @Delete(":id")
    async remove(@Param("id", ParseIntPipe) id: number) {
        return await this.subscriptionsService.remove(+id);
    }
}
