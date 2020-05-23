import React, { useState } from "react";
import Spotify from "spotify-web-api-node";
import TableToExcel from "@linways/table-to-excel";
import Row from "./Row";
import { useEffect } from "react";

const spotifyApi = new Spotify();

const Search = ({ auth }) => {
  let [amount, setAmount] = useState(0);
  const [input, setInput] = useState();
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState();
  const [finished, setFinished] = useState(true);

  if (auth.access_token) {
    spotifyApi.setAccessToken(auth.access_token);
  }

  useEffect(() => {
    if (input) {
      setAmount(0);
      setFinished(false);
      setSearching(true);
      const search = async (term) => {
        let noMatch = 0;
        let timeout = 200;
        let searchResults = [];

        for (let i = 0; i < 4 || noMatch > 10; i++) {
          await spotifyApi.searchPlaylists(term, { limit: 50 }).then((data) => {
            data.body.playlists.items.forEach(async (item) => {
              setTimeout(async () => {
                const res = await spotifyApi.getPlaylist(item.id);
                if (searchResults[res.body]) {
                  return;
                } else {
                  searchResults.push(res.body);
                  setAmount(amount++);
                }

                if (amount > 90) timeout = 1000;
                if (amount > 100) timeout = 2000;
              }, timeout);
            });
          });
        }

        setTimeout(() => {
          setResults((results) => searchResults);
          setSearching(false);
          setFinished(true);
        }, 3000);
      };
      search(input);
    }
  }, [input, setResults]);

  const headings = [
    "id",
    "Name",
    "Description",
    "Followers",
    "Tracks",
    "Owner Name",
    "Public",
  ];

  return (
    <div>
      <form>
        <label htmlFor="input">
          <input id="input" type="text" />
        </label>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              const field = document.getElementById("input");
              if (field.value) {
                setInput(field.value);
              } else {
                field.setAttribute("placeholder", "Please enter a search term");
              }
            }}
          >
            Search
          </button>
          <button
            onClick={(e) => {
              if (results.length > 0) {
                e.preventDefault();
                TableToExcel.convert(document.getElementById("table"), {
                  name: `query-${input}-${Date.now()}.xlsx`,
                });
              } else {
                alert("No results to export");
              }
            }}
          >
            Export to excel
          </button>
        </div>
      </form>
      {searching && <p>Searching... Found {amount} results.</p>}
      {finished && <p>Found {amount} results.</p>}
      <table id="table">
        <thead>
          {headings.map((head) => (
            <th>{head}</th>
          ))}
        </thead>
        <tbody>
          {results.length === 0 ? (
            <tr></tr>
          ) : (
            results.map((data, index) => {
              return <Row data={data} idx={index} />;
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
export default Search;
