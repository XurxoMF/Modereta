import { Events, GuildMember } from "discord.js";
import { MClient } from "../helpers/MClient";
import { toggle } from "../helpers/SofiSeriesUsuariosPing.helper";

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(mcli: MClient, member: GuildMember) {
        const id = member.id;

        await toggle(mcli, id, false);
    },
};
