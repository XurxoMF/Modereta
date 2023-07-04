import { Events, Collection, CommandInteraction } from "discord.js";
import { MClient } from "../helpers/MClient";

module.exports = {
    name: Events.InteractionCreate,
    async execute(mcli: MClient, interaction: CommandInteraction) {
        const cooldowns = mcli.cooldowns;

        if (!interaction.isCommand()) return;

        const comando = mcli.comandos.get(interaction.commandName);

        if (!comando) {
            interaction.reply({
                content: `No existe ningún comando con el nombre ${interaction.commandName}!`,
                ephemeral: true,
            });
            return;
        }

        if (!cooldowns.has(comando.data.name)) {
            cooldowns.set(comando.data.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(comando.data.name);
        const defaultCooldownDuration = 3;
        const cooldownAmount = (comando.cooldown || defaultCooldownDuration) * 1000;

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount || 0;

            if (now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1000);
                return interaction.reply({
                    content: `Comando \`${comando.data.name}\` en enfriamiento!. Puedes usarlo de nuevo <t:${expiredTimestamp}:R>.`,
                    ephemeral: true,
                });
            }
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

        // EXECUCIÓN
        try {
            await comando.execute(mcli, interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: "Ups! Ha ocurrido un error al ejecutar el comando!",
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: "Ups! Ha ocurrido un error al ejecutar el comando!",
                    ephemeral: true,
                });
            }
        }
    },
};
