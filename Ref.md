import React, { useState, useEffect, useRef } from "react";

function App() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const divRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (divRef.current) {
        setDimensions({
          width: divRef.current.offsetWidth,
          height: divRef.current.offsetHeight,
        });
      }
    };

    // Set initial dimensions
    handleResize();

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <div ref={divRef} style={{ width: "50%", height: "200px", background: "lightblue" }}>
        Resize the window to see changes in dimensions.
      </div>
      <p>Width: {dimensions.width}px</p>
      <p>Height: {dimensions.height}px</p>
    </div>
  );
}

export default App;
