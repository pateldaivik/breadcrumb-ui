import React, { useEffect, useState } from "react";
import { FaFile, FaFolder } from "react-icons/fa";
import Loader from "react-loader";

const Breadcrumb = () => {
  useEffect(() => {
    fetch("http://localhost:5000/path/root").then((res) => {
      if (res.status === 200) {
        setLoaded(true);
        res.json().then((result) => {
          setCurrItems(result);
        });
      }
    });
  }, []);
  const [currItems, setCurrItems] = useState({});
  const [breadCrumbPath, setBreadCrumbPath] = useState(["root"]);
  const [showFileName, setShowFileName] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const onBreadClick = (key) => {
    setLoaded(false);
    setShowFileName(false);
    let newArray = breadCrumbPath.slice(0, key + 1);
    let path = newArray.join("/");
    fetch("http://localhost:5000/path/" + path)
      .then((res) => {
        if (res.status === 200) {
          setLoaded(true);
          res.json().then((result) => {
            setCurrItems(result);
            setBreadCrumbPath(newArray);
          });
        } else if (res.status === 500) {
          setLoaded(true);
          alert("Something wrong with the path, Try again");
        }
      })
      .catch((error) => {
        setLoaded(true);
        alert("Network error try again");
      });
  };

  const onDirClick = (key) => {
    setLoaded(false);
    breadCrumbPath.push(key);
    let path = breadCrumbPath.join("/");
    fetch("http://localhost:5000/path/" + path)
      .then((res) => {
        if (res.status === 200) {
          setLoaded(true);
          res.json().then((result) => {
            setCurrItems(result);
          });
        } else if (res.status === 500) {
          breadCrumbPath.pop();
          setLoaded(true);
          alert("Something wrong with the path, Try again");
        }
      })
      .catch((error) => {
        setLoaded(true);
        breadCrumbPath.pop();
        alert("Network error try again");
      });
  };

  const onFileClick = (key) => {
    breadCrumbPath.push(key);
    setShowFileName(true);
  };
  return (
    <div>
      <Loader loaded={loaded}>
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
      </Loader>
    </div>
  );
};

export default Breadcrumb;
