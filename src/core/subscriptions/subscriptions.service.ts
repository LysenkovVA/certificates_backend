import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IncludeOptions, Transaction } from "sequelize";
import { subscriptionTableAttributes } from "../../infrastructure/const/tableAttributes";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { UpdateSubscriptionDto } from "./dto/update-subscription.dto";
import { Subscription } from "./entities/subscription.entity";

@Injectable()
export class SubscriptionsService {
    attributes: Array<string>;
    include: Array<IncludeOptions>;

    constructor(
        @InjectModel(Subscription)
        private subscriptionRepository: typeof Subscription,
    ) {
        this.attributes = subscriptionTableAttributes;
    }

    async create(
        createSubscriptionDto: CreateSubscriptionDto,
        transaction?: Transaction,
    ) {
        if (!createSubscriptionDto.value) {
            throw new HttpException(
                "Название подписки не задано!",
                HttpStatus.BAD_REQUEST,
            );
        }

        if (!createSubscriptionDto.description) {
            throw new HttpException(
                "Описание подписки не задано!",
                HttpStatus.BAD_REQUEST,
            );
        }

        if (!createSubscriptionDto.pricePerMonth) {
            throw new HttpException(
                "Стоимость подписки не задана!",
                HttpStatus.BAD_REQUEST,
            );
        }

        if (!createSubscriptionDto.teamMembersCount) {
            throw new HttpException(
                "Количество членов команды в подписке не задано!",
                HttpStatus.BAD_REQUEST,
            );
        }

        if (!createSubscriptionDto.organizationsCount) {
            throw new HttpException(
                "Количество организаций в подписке не задано!",
                HttpStatus.BAD_REQUEST,
            );
        }

        return this.subscriptionRepository.create(createSubscriptionDto, {
            transaction,
        });
    }

    async findAll(limit: number, offset: number, transaction?: Transaction) {
        return this.subscriptionRepository.findAll({
            limit,
            offset,
            transaction,
        });
    }

    async findOne(id: number, transaction?: Transaction) {
        return this.subscriptionRepository.findOne({
            where: { id },
            transaction,
        });
    }

    async findSubscriptionByValue(value: string, transaction?: Transaction) {
        return this.subscriptionRepository.findOne({
            where: { value },
            transaction,
        });
    }

    async update(
        id: number,
        updateSubscriptionDto: UpdateSubscriptionDto,
        transaction?: Transaction,
    ) {
        return this.subscriptionRepository.update(updateSubscriptionDto, {
            where: { id },
            transaction,
        });
    }

    async remove(id: number, transaction?: Transaction) {
        return this.subscriptionRepository.destroy({
            where: { id },
            transaction,
        });
    }
}
