import React from "react";
import ItemImg from "./ItemImg";

function ListImg({ images }) {
  const renderImages = images.map((image) => {
    return <ItemImg key={image.id} image={image} />;
  });

  return <ul>{renderImages}</ul>;
}

export default ListImg;
