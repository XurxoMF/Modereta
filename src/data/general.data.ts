/**
 * Cooldown por defecto para comandos sin cooldown propio establecido. En segundos.
 */
export const COOLDOWN_BASE: number = 3;

/**
 * Colores usados en Embeds y demás partes del bot. "#ffffff"
 */
export enum Colores {
    EMBED_BASE = "#ff00ff",
    ADVERTENCIAS = "#ffbb44",
    MUTEOS = "#ff0000",
    SANCION_ELIMINADA = "#00ff00",
}

/**
 * ID del rol de muteo.
 */
export const ROL_MUTEO: string = "1111054758350962758";

/**
 * IDs de los roles que puedes **gestionar usuarios**, esto permite **ver info de los usuarios**, **mutear usuarios** y **expulsar usuarios**!
 */
export const GestoresDeUsuarios: string[] = [
    "1108888410871050332",
    "726140295086866454",
    "778560855532765195",
];

/**
 * Roles de recompesnas por subir de nivel.
 *
 * Map<`nivel`, `["id1", "id2", ... , "idN"]`>
 */
export const RecompensasNivel = new Map<number, string[]>([
    [10, ["1118870108694122549"]],
    [25, ["745202999965515847"]],
    [50, ["745203063513677855"]],
    [75, ["830581376817954836"]],
    [100, ["830581589682815057"]],
]);
