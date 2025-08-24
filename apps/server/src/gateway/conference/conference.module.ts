import { Module } from "@nestjs/common";
import { ConferenceGateway } from "./conference.gateway";

@Module({
    providers: [ConferenceGateway],
})
export class ConferenceModule {}
