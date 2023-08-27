import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from "@nestjs/common";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { UpdateSubscriptionDto } from "./dto/update-subscription.dto";
import { SubscriptionsService } from "./subscriptions.service";

@Controller("subscriptions")
export class SubscriptionsController {
    constructor(private readonly subscriptionsService: SubscriptionsService) {}

    @Post()
    async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
        return await this.subscriptionsService.create(createSubscriptionDto);
    }

    @Get()
    async findAll(
        @Query("limit") limit: number,
        @Query("offset") offset: number,
    ) {
        return await this.subscriptionsService.findAll(limit, offset);
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return await this.subscriptionsService.findOne(+id);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateSubscriptionDto: UpdateSubscriptionDto,
    ) {
        return await this.subscriptionsService.update(
            +id,
            updateSubscriptionDto,
        );
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.subscriptionsService.remove(+id);
    }
}
