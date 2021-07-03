import _ from 'lodash';
import React from 'react';
import axios from 'axios';
import {
  POKEAPI_MOVE_URL,
  POKEAPI_POKEMON_URL,
  POKEAPI_TYPE_TO_COLOR,
} from '../global/constants';

class CardDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      pokemonName: '',
      pokemonSpriteUrl: '',
      pokemonTypes: [],
      pokemonMoves: [],
    };
  }

  loadRandomCardDetails = async () => {
    this.setState({
      isLoading: true,
    });

    const randomPokemonId = Math.floor(Math.random() * 151) + 1;
    const pokemon = (await axios.get(`${POKEAPI_POKEMON_URL}/${randomPokemonId}`)).data;
    const fourRandomPokemonMoves = [];
    const allPokemonMoves = pokemon.moves;
    while (fourRandomPokemonMoves.length < 4) {
      const randomMove = allPokemonMoves[Math.floor(Math.random() * allPokemonMoves.length)]
      if (!_.includes(fourRandomPokemonMoves, randomMove)) {
        fourRandomPokemonMoves.push(randomMove);
      }
    }

    const pokemonMoves = [];
    await Promise.all(_.map(fourRandomPokemonMoves, async randomPokemonMove => {
      const move = (await axios.get(`${POKEAPI_MOVE_URL}/${randomPokemonMove.move.name}`)).data;
      pokemonMoves.push({
        name: move.name,
        power: move.power,
        type: move.type.name,
      });
    }));

    this.setState({
      isLoading: false,
      pokemonName: pokemon.name,
      pokemonSpriteUrl: pokemon.sprites.front_default,
      pokemonTypes: pokemon.types.map(type => type.type.name),
      pokemonMoves: pokemonMoves,
    });
  }

  async componentDidMount() {
    await this.loadRandomCardDetails();
  }

  render() {
    return (
      <>
        {
          this.state.isLoading ? (
            <div className="text-6xl font-bold p-1">
              Getting new Pokemon....
            </div>
          ) : (
            <>
              {/* Randomize Button */}
              <button type="button" onClick={this.loadRandomCardDetails} className="bg-skyblue-500 hover:bg-skyblue-700 text-white p-2 border-black border-4  m-2">
                Click Here To Get New Pokemon
              </button>

              {/* Pokemon Card */}
              <div className="w-80 p-4 text-black border-black border-4  bg-gray-200">

                {/* Pokemon Name */}
                <div className="text-6xl font-italic p-1">
                  {this.state.pokemonName}
                </div>

                {/* Pokemon Image */}
                <div className={"border-black border-2 m-1  bg-gradient-to-r from-" + POKEAPI_TYPE_TO_COLOR[this.state.pokemonTypes[0]] + " to-white"}>
                  <img src={this.state.pokemonSpriteUrl} className="mx-auto" alt=""/>
                </div>

                {/* Pokemon Typing */}
                {
                  <div className="flex flex-row justify-center">
                    {
                      this.state.pokemonTypes.map((type, index) => {
                        return (
                          <div key={index} className={"border-black border-2 m-1 p-1  bg-" + POKEAPI_TYPE_TO_COLOR[type]}>
                            {type}
                          </div>
                        );
                      })
                    }
                  </div>
                }

                {/* Pokemon Moves */}
                {
                  this.state.pokemonMoves.map((move, index) => {
                    return (
                      <div key={index} className={"border-black border-2 m-1 p-1  flex flex-row justify-between px-1 bg-gradient-to-r from-" + POKEAPI_TYPE_TO_COLOR[move.type] + " to-white"}>
                        <div>
                          {move.name}
                        </div>
                        <div>
                          {
                            move.power ?
                            move.power
                            : '--'
                          }
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            </>
          )
        }
      </>
    );
  }
}

export { CardDetails };