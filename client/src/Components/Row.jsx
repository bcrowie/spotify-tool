import React from "react";
import "../App.css";

const Row = (props) => {
  return (
    <tr>
      <td>
        {(
          <a href={`https://open.spotify.com/playlist/${props.data.id}`}>
            {props.data.id}
          </a>
        ) || "null"}
      </td>
      <td>{props.data.name || "null"}</td>
      <td>{props.data.description || "null"}</td>
      <td>{props.data.owner.email || "null"}</td>
      <td>{props.data.followers.total || "null"}</td>
      <td>{props.data.tracks.items.length || "null"}</td>
      <td>
        {(
          <a href={`https://open.spotify.com/user/${props.data.owner.id}`}>
            {props.data.owner.display_name}
          </a>
        ) || "null"}
      </td>
      <td>{props.data.public ? "true" : "false"}</td>
    </tr>
  );
};

export default Row;
