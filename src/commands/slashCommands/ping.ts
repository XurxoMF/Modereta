import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { MClient } from "../../helpers/MClient";

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder().setName("ping").setDescription("Responde con pong!"),
    async execute(mcli: MClient, interaction: ChatInputCommandInteraction) {
        const [count, creado] = await mcli.db.PingCount.findOrCreate({
            where: { userId: interaction.user.id },
            defaults: { userId: interaction.user.id, usos: 1 },
        });

        let usos = count.getDataValue("usos");

        if (!creado) {
            count.increment("usos");
            usos++;
        }

        await interaction.deferReply();

        const reply = await interaction.fetchReply();

        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        interaction.editReply(
            `Pong! Client ${ping}ms | Websocket: ${mcli.ws.ping}ms | Usos: ${usos}`
        );
    },
};
