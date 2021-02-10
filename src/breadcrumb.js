import React, { useEffect, useState } from "react";
import { FaFile, FaFolder } from "react-icons/fa";

const Breadcrumb = () => {
  useEffect(() => {
    fetch("http://localhost:5000/path/root").then((res) =>
      res.json().then((result) => {
        setCurrItems(result);
      })
    );
  }, []);
  const [currItems, setCurrItems] = useState({});
  const [breadCrumbPath, setBreadCrumbPath] = useState(["root"]);
  const [showFileName, setShowFileName] = useState(false);
  const onBreadClick = (key) => {
    setShowFileName(false);
    let newArray = breadCrumbPath.slice(0, key + 1);
    setBreadCrumbPath(newArray);
    let path = newArray.join("/");
    fetch("http://localhost:5000/path/" + path).then((res) =>
      res.json().then((result) => {
        setCurrItems(result);
      })
    );
  };

  const onDirClick = (key) => {
    breadCrumbPath.push(key);
    let path = breadCrumbPath.join("/");
    fetch("http://localhost:5000/path/" + path).then((res) =>
      res.json().then((result) => {
        setCurrItems(result);
      })
    );
  };

  const onFileClick = (key) => {
    breadCrumbPath.push(key);
    setShowFileName(true);
  };
  return (
    <div>
      <div>
        {breadCrumbPath.map((path, key) =>
          key + 1 === breadCrumbPath.length ? (
            <span key={key}>{path}</span>
          ) : (
            <a
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => onBreadClick(key)}
              key={key}
              to={path}
            >
              {path} /
            </a>
          )
        )}
      </div>
      {!showFileName ? (
        <div>
          <h3>The items in this folder are</h3>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {Object.keys(currItems).map((a) => {
              if (currItems[a].type === "dir") {
                return (
                  <div>
                    <FaFolder />
                    <p
                      onClick={() => {
                        onDirClick(a);
                      }}
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        display: "inline",
                      }}
                    >
                      {a}
                    </p>
                  </div>
                );
              } else {
                return (
                  <div>
                    <FaFile />
                    <p
                      onClick={() => {
                        onFileClick(a);
                      }}
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        display: "inline",
                      }}
                    >
                      {a}
                    </p>
                  </div>
                );
              }
            })}
          </div>
        </div>
      ) : (
        <div>
          <p>This is {breadCrumbPath.slice(-1).pop()}</p>
        </div>
      )}
    </div>
  );
};

export default Breadcrumb;