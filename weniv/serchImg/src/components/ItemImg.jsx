import React from "react";

function ItemImg({ image }) {
  return (
    <li>
      <img src={image.urls.small} alt={image.alt_description} />
    </li>
  );
}

export default ItemImg;
