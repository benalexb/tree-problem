import { useEffect, useState } from 'react';
import './App.css';
import Tree from 'react-d3-tree';
import axios from 'axios';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data: fetchedData } = await axios.get('http://localhost:5000/api/graph');
        setData(fetchedData);
      } catch (error) {
        console.error(error);
      }
    })()
  }, []);

  return (
    <div className="app">
      {!!data && (
        <div id="treeWrapper" className="treeWrapper">
          <Tree
            data={data}
            collapsible={false}
            pathFunc="step"
            translate={{ x: 500, y: 500 }}
            nodeSize={{ x: 300, y: 140 }}
            onNodeClick={(node) => {
              window.alert(node.data.description); // bbarreto_dev: tmp
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
