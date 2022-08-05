import { EvolutionClient, PokemonClient } from "pokenode-ts";

type PokemonEvolution = {
  id: number;
  name: string;
  spriteUrl: string;
};

type MyEvolutionChain = {
  pokemons: PokemonEvolution[];
};

export const getPokemonEvolutionChain = async (
  pokemon: string
): Promise<MyEvolutionChain[]> => {
  //Spawn PokemonClient and get the PokemonSpecies object from pokeApi
  const pokeApi = new PokemonClient();
  const pokemonSpecies = await pokeApi.getPokemonSpeciesByName(pokemon);

  //Get EvolutionChain id
  const chainIdAsString = pokemonSpecies.evolution_chain.url.split("/")[6];
  if (chainIdAsString == undefined) {
    throw new Error(`InvalidPokemonChain: ${chainIdAsString}`);
  }
  const chainId = parseInt(chainIdAsString, 10);

  //Spawn EvolutionClient and get the evolutionChain object from pokeApi
  const evoApi = new EvolutionClient();
  const results = await evoApi.getEvolutionChainById(chainId);

  const basePokemon = await pokeApi.getPokemonByName(
    results.chain.species.name
  );
  const chains: MyEvolutionChain[] = [];
  await Promise.all(
    results.chain.evolves_to.map(async (evolution) => {
      const evolutionPokemon = await pokeApi.getPokemonByName(
        evolution.species.name
      );
      //Push base Pokemon and it's evolution
      const chainLinks: PokemonEvolution[] = [
        {
          id: basePokemon.id,
          name: basePokemon.name,
          spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${basePokemon.id}.png`,
        },
        {
          id: evolutionPokemon.id,
          name: evolutionPokemon.name,
          spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolutionPokemon.id}.png`,
        },
      ];
      // If the third evolution exists push it to the Link
      if (evolution.evolves_to[0]?.species.name !== undefined) {
        const thirdEvolutionsPokemon = await pokeApi.getPokemonByName(
          evolution.evolves_to[0].species.name
        );
        chainLinks.push({
          id: thirdEvolutionsPokemon.id,
          name: thirdEvolutionsPokemon.name,
          spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${thirdEvolutionsPokemon.id}.png`,
        });
      }

      chains.push({ pokemons: chainLinks });
    })
  );

  return chains;
};
