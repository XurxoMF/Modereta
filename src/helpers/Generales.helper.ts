/**
 * Para la ejecución del código durante el tiempo indicado.
 *
 * @param time Tiempo de espera
 */
export const wait = (time: number) => {
    return new Promise((resolve) => setTimeout(resolve, time));
};
