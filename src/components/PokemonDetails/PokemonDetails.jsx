import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import PokemonList from './PokemonList';

function PokemonDetails() {
  const [pokemonNumber, setPokemonNumber] = useState('');
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonType, setPokemonType] = useState([]);
  const [pokemonSprite, setPokemonSprite] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const getPokemonDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`);
        const name = response.data.name;
        const type = response.data.types;
        const sprite = response.data.sprites.front_default;
        setPokemonName(name);
        setPokemonType(type);
        setPokemonSprite(sprite);
        setError('');
      } catch (error) {
        console.error('Erro ao encontrar Pokemon', error);
        setPokemonName('');
        setPokemonType([]);
        setPokemonSprite('');
        setError('Pokemon não encontrado');
      } finally {
        setLoading(false);
        setRefresh(false);
      }
    };

    if (refresh && pokemonNumber) {
      getPokemonDetails();
    }
  }, [refresh, pokemonNumber]);

  const handleInputChange = (event) => {
    setPokemonNumber(event.target.value);
  };

  const handleRefreshClick = () => {
    setRefresh(true);
  };

  return (
    <div className='pokemonDetails'>
      <div className='text'>
        <h2>Pesquise um Pokemon</h2>
        <input type="number" value={pokemonNumber} onChange={handleInputChange} />
        <div className="pokemonInfo">
          {loading && <p className="loading">Carregando...</p>}
          {error && <p className="error">{error}</p>}
          {pokemonName && <p>Nome: {pokemonName}</p>}
          {pokemonType && (
            <p>
              Tipo: {pokemonType.length > 0 ? pokemonType.map((type, i) => {
                return <span key={i}>{type.type.name}</span>;
              }).reduce((prev, curr) => [prev, ' ', curr]) : ''}
            </p>
          )}
          {pokemonSprite && <img src={pokemonSprite} alt={pokemonName} />}
        </div>
        <button className='Button' onClick={handleRefreshClick}>Buscar</button>
      </div>
      <div className='pokemonListContainer'>
        <PokemonList />
      </div>
    </div>
    );
}

export default PokemonDetails;
