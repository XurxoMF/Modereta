import { Events, Collection, CommandInteraction } from "discord.js";
import { MClient } from "../helpers/MClient";

module.exports = {
    name: Events.InteractionCreate,
    async execute(mcli: MClient, interaction: CommandInteraction) {
        const cooldowns = mcli.cooldowns;

        if (interaction.isChatInputCommand()) {
            const comandoChatImput = mcli.comandosChatImput.get(interaction.commandName);

            if (!comandoChatImput) {
                interaction.reply({
                    content: `El comando ${interaction.commandName} no existe! Contacta con el equipo de soporte para que puedan solucionarlo!`,
                    ephemeral: true,
                });
                return;
            }

            // COOLDOWNS
            if (!cooldowns.has(comandoChatImput.data.name)) {
                cooldowns.set(comandoChatImput.data.name, new Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(comandoChatImput.data.name);
            const defaultCooldownDuration = 3;
            const cooldownAmount = (comandoChatImput.cooldown || defaultCooldownDuration) * 1000;

            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount || 0;

                if (now < expirationTime) {
                    const expiredTimestamp = Math.round(expirationTime / 1000);
                    return interaction.reply({
                        content: `Comando \`${comandoChatImput.data.name}\` en enfriamiento!. Puedes usarlo de nuevo <t:${expiredTimestamp}:R>.`,
                        ephemeral: true,
                    });
                }
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
            // END COOLDOWNS

            // EXECUCIÓN
            try {
                comandoChatImput.execute(mcli, interaction);
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
        } else if (interaction.isMessageContextMenuCommand()) {
            const comandoMessageContextMenu = mcli.comandosMessageContextMenu.get(
                interaction.commandName
            );

            if (!comandoMessageContextMenu) {
                interaction.reply({
                    content: `El comando ${interaction.commandName} no existe! Contacta con el equipo de soporte para que puedan solucionarlo!`,
                    ephemeral: true,
                });
                return;
            }

            // EXECUCIÓN
            try {
                comandoMessageContextMenu.execute(mcli, interaction);
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
        } else {
            return;
        }
    },
};
