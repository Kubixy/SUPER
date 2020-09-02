import React, { useState, useEffect } from "react";
import { Button, Divider } from "semantic-ui-react";
import firebase from "../../utils/Firebase";
import { toast } from "react-toastify";
import "firebase/storage";
import { useUserTools } from "../../context/UserToolsProvider";

export default function FileUploader(props) {
  const {
    fileIndex,
    setFileIndex,
    title,
    fileArrayToDelete,
    index,
    setFileArrayToDelete,
  } = props;
  const {
    setNewData,
    managementON,
    setDeleteIndex,
    classFound,
    userId,
  } = useUserTools();

  useEffect(() => {
    firebase
      .storage()
      .ref()
      .child(`files/${classFound === null ? userId : classFound}/${fileIndex}`)
      .getDownloadURL()
      .then((response) => {
        setUrl(response);
      });

    setFileIndex(fileIndex + 1);
  });

  const [url, setUrl] = useState(null);

  const copyToClipboard = () => {
    let newElement = document.createElement("input");
    newElement.value = url;
    document.body.appendChild(newElement);
    newElement.select();
    document.execCommand("copy");
    document.body.removeChild(newElement);
    toast.success("The link has been copied");
  };

  return (
    <div className="file">
      {managementON && (
        <Button
          className="close-button"
          icon="close"
          onClick={() => {
            setDeleteIndex(index);
            setFileArrayToDelete([...fileArrayToDelete, index]);
            setNewData(false);
          }}
        />
      )}
      <Button href onClick={() => copyToClipboard()}>
        Click to copy the download link <Divider fitted={true} />
        {title !== null ? title : ""}
      </Button>
    </div>
  );
}