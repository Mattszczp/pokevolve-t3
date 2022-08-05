import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  pokemon_name: string;
};

const Home: NextPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const router = useRouter();
  const onSubmit: SubmitHandler<Inputs> = (data) =>
    router.push(`/evolution/${data.pokemon_name}`);
  return (
    <>
      <Head>
        <title>Pokevolve</title>
        <meta name="description" content="Generated by create-t3-app" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <div className="w-screen h-screen flex flex-col justify-between relative items-center text-xl text-center pb-2">
        <span className="text-center pt-8 text-2xl">
          Pokémon evolution chains
        </span>
        <div>
          <form
            className="p-8 flex flex-row justify-between items-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              className="mx-2 shadow appearance-none border rounded-full w-72 py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
              {...register("pokemon_name", { required: true })}
              placeholder="Pokemon name or Pokedex ID"
            />
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Find
            </button>
          </form>
          {errors.pokemon_name && (
            <span className="text-red-700">This field is required</span>
          )}
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

export default Home;
