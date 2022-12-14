import { trpc } from "@/utils/trpc";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const EvolutionChainListing: React.FC<{
  pokemonName: string;
  id: number;
  spriteUrl: string;
}> = ({ pokemonName, id, spriteUrl }) => {
  return (
    <>
      <div key={id} className="flex flex-col justify-between items-center mx-2">
        <Image src={spriteUrl} alt={pokemonName} width={64} height={64} />
        <span className="text-center capitalize">{pokemonName}</span>
      </div>
    </>
  );
};

const Evolution: NextPage = () => {
  const router = useRouter();
  const { name } = router.query;

  if (name === undefined) {
    throw new Error("Invalid Pokemon Name");
  }

  const { data } = trpc.useQuery(["pokemon.evolutionChain", name.toString()], {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <Head>
        <title>Pokevolve</title>
        <meta name="description" content="Generated by create-t3-app" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <div className="w-screen h-screen flex flex-col justify-between relative items-center text-xl text-center pb-2">
        <span className="text-2xl text-center pt-8">
          Evolution Chain for {name.toString()}
        </span>
        <div>
          <ul className="p-8 flex flex-col justify-between items-center">
            {data &&
              data.evolution_chain.map((chain, key) => {
                return (
                  <>
                    <li
                      className="flex flex-row justify-between items-center"
                      key={key}
                    >
                      {chain.pokemons.map((p, k) => {
                        return (
                          <>
                            <EvolutionChainListing
                              key={p.id}
                              pokemonName={p.name}
                              id={p.id}
                              spriteUrl={p.spriteUrl}
                            />
                            {k !== chain.pokemons.length - 1 && "->"}
                          </>
                        );
                      })}
                    </li>
                  </>
                );
              })}
            {!data && <span>Loading...</span>}
          </ul>
          <Link className="mt-4 text-sm" href="/">
            Go back
          </Link>
        </div>
        <div className="w-full text-xl text-center pb-2">
          <a href="https://twitter.com/ImKurtwood">Twitter</a>
          <span className="mx-2">-</span>
          <a href="https://github.com/Mattszczp/pokevolve-t3">Github</a>
        </div>
      </div>
    </>
  );
};

export default Evolution;
