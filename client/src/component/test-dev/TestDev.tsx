import { useState } from "react";

export default function TestDev() {
  const [selectedImage, setSelectedImage] = useState<File | undefined>();

  return (
    <div>
      <h1>Upload and Display Image usign React Hook's</h1>

      <br />
      <input
        type="file"
        name="myImage"
        onChange={(event) => {
          console.log(event.target.files?.[0]);
          setSelectedImage(event.target.files?.[0]);
        }}
      />

      {selectedImage && (
        <div>
          <img
            alt="not fount"
            width={"250px"}
            src={URL.createObjectURL(selectedImage)}
          />
          <br />
          <button onClick={() => setSelectedImage(undefined)}>Remove</button>
        </div>
      )}
      <br />
    </div>
  );
}
