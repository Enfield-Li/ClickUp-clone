import { useRef, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import AvatarEditor from "react-avatar-editor";

const fileTypes = ["JPEG", "PNG", "GIF"];
export default function AvatarEdit() {
  const editor = useRef<AvatarEditor>(null);
  const [file, setFile] = useState<File | undefined>();
  const [updatedImg, setUpdatedImg] = useState("");

  const handleChange = (file: File) => {
    setFile(file);
  };

  return (
    <div>
      <h1>Upload and Display Image usign React Hook's</h1>

      <br />
      <FileUploader
        name="file"
        multiple={false}
        types={fileTypes}
        handleChange={handleChange}
      >
        abc
      </FileUploader>
      {/* <input
        type="file"
        name="myImage"
        onChange={(event) => {
          console.log(event.target.files?.[0]);
          setFile(event.target.files?.[0]);
        }}
      /> */}

      {file && (
        <>
          {/* <div>
            <img
              alt="not fount"
              width={"250px"}
              src={URL.createObjectURL(file)}
            />
            <br />
          </div> */}
          <br />
          <AvatarEditor
            ref={editor}
            rotate={0}
            scale={1.5}
            border={50}
            image={file}
            width={250}
            height={250}
            borderRadius={200}
            color={[0, 0, 0, 0.6]}
            backgroundColor="black"
            onMouseUp={() => console.log("onMouseUp")}
            onMouseMove={() => {
              if (editor.current) {
                // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
                // drawn on another canvas, or added to the DOM.
                const canvas = editor.current.getImage();
                // console.log(canvas);

                // If you want the image resized to the canvas size (also a HTMLCanvasElement)
                const canvasScaled = editor.current.getImageScaledToCanvas();
                setUpdatedImg(canvasScaled.toDataURL("image/png"));
              }
            }}
          />

          <img alt="not fount" width={"250px"} src={updatedImg} />

          <button
            onClick={() => {
              if (editor.current) {
                // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
                // drawn on another canvas, or added to the DOM.
                const canvas = editor.current.getImage();
                // console.log(canvas);

                // If you want the image resized to the canvas size (also a HTMLCanvasElement)
                const canvasScaled = editor.current.getImageScaledToCanvas();
                console.log(
                  canvasScaled.toDataURL("image/png")
                  //   .replace("image/png", "image/octet-stream")
                );
              }
            }}
          >
            Save
          </button>
          <button onClick={() => setFile(undefined)}>Remove</button>
        </>
      )}
    </div>
  );
}
