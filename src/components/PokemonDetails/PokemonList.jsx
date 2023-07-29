import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function PokemonList() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const pokemonListRef = useRef(null);

  useEffect(() => {
    const fetchPokemonList = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${(page - 1) * 20}`);
        const newPokemonNames = response.data.results.map((pokemon) => pokemon.name);
        setPokemonList((prevPokemonList) => [...prevPokemonList, ...newPokemonNames]);
      } catch (error) {
        console.error('Erro ao buscar a lista de Pokémon', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonList();
  }, [page]);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = pokemonListRef.current;

    if (scrollTop + clientHeight >= scrollHeight) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    pokemonListRef.current.addEventListener('scroll', handleScroll);

    return () => {
      pokemonListRef.current.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <h2>Lista de Pokémon</h2>
      <div ref={pokemonListRef} style={{ maxHeight: '400px', overflowY: 'auto'}}>
        <ul>
          {pokemonList.map((pokemonName, index) => (
            <li key={index}>{pokemonName}</li>
          ))}
        </ul>
      </div>
      {loading && <p>Carregando mais Pokémon...</p>}
    </div>
  );
}

export default PokemonList;
