import {
    Events,
    Collection,
    BaseInteraction,
    AutocompleteInteraction,
    CacheType,
} from "discord.js";
import { MClient } from "../helpers/MClient";
import { COOLDOWN_BASE } from "../data/general.data";
import { DEV, DEV_ID } from "../config.json";

module.exports = {
    name: Events.InteractionCreate,
    async execute(mcli: MClient, interaction: BaseInteraction) {
        const cooldowns = mcli.cooldowns;

        if (interaction.isChatInputCommand()) {
            if (DEV && interaction.user.id !== DEV_ID) {
                return interaction.reply({
                    content: `> <@${interaction.user.id}> El bot está en **mantenimiento**, inténtalo de nuevo dentro de un rato! <a:av_besitos:1114871486419832852>`,
                    ephemeral: true,
                });
            }

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
            const defaultCooldownDuration = COOLDOWN_BASE;
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
            if (DEV && interaction.user.id !== DEV_ID) {
                return interaction.reply({
                    content: `> <@${interaction.user.id}> El bot está en **mantenimiento**, inténtalo de nuevo dentro de un rato! <a:av_besitos:1114871486419832852>`,
                    ephemeral: true,
                });
            }

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
        } else if (interaction.isUserContextMenuCommand()) {
            if (DEV && interaction.user.id !== DEV_ID) {
                return interaction.reply({
                    content: `> <@${interaction.user.id}> El bot está en **mantenimiento**, inténtalo de nuevo dentro de un rato! <a:av_besitos:1114871486419832852>`,
                    ephemeral: true,
                });
            }

            const comandoUserContextMenu = mcli.comandosUserContextMenu.get(
                interaction.commandName
            );

            if (!comandoUserContextMenu) {
                interaction.reply({
                    content: `El comando ${interaction.commandName} no existe! Contacta con el equipo de soporte para que puedan solucionarlo!`,
                    ephemeral: true,
                });
                return;
            }

            // EXECUCIÓN
            try {
                comandoUserContextMenu.execute(mcli, interaction);
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
        } else if (interaction.isAutocomplete()) {
            const comando = mcli.comandosChatImput.get(interaction.commandName);

            if (!comando) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            if (comando.autocompletado) {
                try {
                    comando.autocompletado(mcli, interaction);
                } catch (error) {
                    console.error(error);
                }
            } else {
                return;
            }
        } else {
            return;
        }
    },
};
