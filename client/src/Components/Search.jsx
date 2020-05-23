import React, { useState } from "react";
import Spotify from "spotify-web-api-node";
import TableToExcel from "@linways/table-to-excel";
import Row from "./Row";
import { useEffect } from "react";

const spotifyApi = new Spotify();

const Search = ({ auth }) => {
  const [input, setInput] = useState();
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState();

  if (auth.access_token) {
    spotifyApi.setAccessToken(auth.access_token);
  }

  useEffect(() => {
    if (input) {
      setSearching(true);
      const search = async (term) => {
        let searchResults = [];
        await spotifyApi.searchPlaylists(term, { limit: 50 }).then((data) => {
          data.body.playlists.items.forEach(async (item) => {
            const res = await spotifyApi.getPlaylist(item.id);
            searchResults.push(res.body);
          });
        });
        setTimeout(() => {
          setResults((results) => searchResults);
          setSearching(false);
        }, 3000);
      };
      search(input);
    }
  }, [input, setResults]);

  const headings = [
    "id",
    "Name",
    "Description",
    "Email",
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
            onClick={() => {
              if (results.length > 0) {
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
      {searching && <p>Searching...</p>}
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
            results.map((data) => {
              return <Row data={data} />;
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
export default Search;
