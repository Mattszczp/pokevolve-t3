import { createRouter } from "./context";
import { z } from "zod";
import { getPokemonEvolutionChain } from "@/utils/getPokemonEvolutionChain";

export const pokemonRouter = createRouter().query("evolutionChain", {
  input: z.string(),
  async resolve({ input }) {
    const chains = await getPokemonEvolutionChain(input.toLowerCase());
    return {
      evolution_chain: chains,
    };
  },
});
