import React, { useState } from "react";
import { toast } from "react-toastify";
import { Input, Button, Icon, Popup } from "semantic-ui-react";
import { uploadFile } from "../../../utils/Api";
import { useUserTools } from "../../../context/UserToolsProvider";

export default function File(props) {
  const {
    setData,
    uid, //user.uid
    fileIndex,
    data,
    setFileIndex,
    userInput,
    setNewData,
  } = props;

  const { state, dispatch } = useUserTools();

  const [file, setFile] = useState(null);
  const [input, setInput] = useState(null);

  const onClickFile = () => {
    if (file) {
      if (state.files < 3) {
        if (file.length === 1 && file[0].type.includes("pdf")) {
          if (file[0].size / 1024 <= 5120) {
            if (input) {
              uploadFile(file[0], uid, fileIndex, "files");
              let newData = data;
              newData.push({
                type: userInput,
                title: input,
                index: fileIndex,
              });
              setData(newData);
              setFileIndex(fileIndex + 1);
              setNewData(false);
              document.getElementById("fileInput").value = "";
              dispatch({ type: "increFil" });
              toast.success("PDF added");
            } else {
              toast.warning("You must pick a name for your file");
            }
          } else {
            toast.warning("That file is too heavy (5MB limit)");
            document.getElementById("fileInput").value = "";
          }
        } else {
          toast.warning("That's not a PDF file");
        }
      } else {
        toast.warning("You've reached the limit of files allowed");
      }
    } else {
      toast.warning("No PDF selected");
    }
    document.getElementById("inputFileName").value = "";
  };

  return (
    <div className="options-file">
      <Input
        id="fileInput"
        type="file"
        onChange={(e) => setFile(e.target.files)}
        icon="pdf file outline"
      />{" "}
      <div className="options-file__count">
        <h3>{state.files}/3</h3>
        <Popup
          content="Limit of 3 files (5MB max each)"
          on="click"
          position="right center"
          pinned
          trigger={<Icon name="question circle" size="large" />}
        />
      </div>
      <Input
        id="inputFileName"
        placeholder="Pick a name for your file"
        maxLength="50"
        type="text"
        onChange={(e) => setInput(e.target.value)}
      ></Input>
      <Button onClick={onClickFile}>Add file</Button>
    </div>
  );
}
