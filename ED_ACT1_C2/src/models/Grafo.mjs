import List from './List.mjs';

export default class Grafo {
    #matrizAdy = [];
    #mapPoint = new Map();

    constructor() {}

    addVert(...vertices) {
        for (let value of vertices) {
            this.#matrizAdy.push(new List());
            this.#mapPoint.set(value, this.#matrizAdy.length - 1);
        }
    }

    addOneVert(value) {
        this.#matrizAdy.push(new List());
        this.#mapPoint.set(value, this.#matrizAdy.length - 1);
    }

    addWeigth(startVert, endVert, weight = 1) {
        if (this.#mapPoint.has(startVert) && this.#mapPoint.has(endVert)) {
            this.#matrizAdy[this.#mapPoint.get(startVert)].addNode(endVert, weight);
            return true;
        }
        return false;
    }

    searchDeep() {
        return new Promise((resolve) => {
            let visited = [];
            const entries = [...structuredClone(this.#mapPoint)];
            for (let i = 0; i < this.#matrizAdy.length; i++)
                visited[i] = false;
    
            const dfs = (vertex) => {
                visited[this.#mapPoint.get(vertex)] = true;
                result += ` ${vertex}\n`;
                let neighbors = [...this.#matrizAdy[this.#mapPoint.get(vertex)].returnList()];
                for (let neighbor of neighbors) {
                    if (!visited[this.#mapPoint.get(neighbor.homeName)]) {
                        dfs(neighbor.homeName);
                    }
                }
            };
    
            let result = '';
            let [key] = entries[0];
            dfs(key);
            resolve(result.trim());
        });
    }


    rutaCorta(start) {
        const distances = {};
        const previous = {};  
        const unvisited = new Set(this.#mapPoint.keys()); 

        
        for (let vertex of this.#mapPoint.keys()) {
            distances[vertex] = Infinity;
            previous[vertex] = null;
        }
        distances[start] = 0;

        while (unvisited.size > 0) {
            let minNode = null;
            for (let vertex of unvisited) {
                if (minNode === null || distances[vertex] < distances[minNode]) {
                    minNode = vertex;
                }
            }

            unvisited.delete(minNode);

            
            const neighbors = this.#matrizAdy[this.#mapPoint.get(minNode)].returnList();

            
            for (let neighbor of neighbors) {
                const alt = distances[minNode] + neighbor.distance;
                if (alt < distances[neighbor.homeName]) {
                    distances[neighbor.homeName] = alt;
                    previous[neighbor.homeName] = minNode;
                }
            }
        }

        const paths = {};
        for (let end of Object.keys(distances)) {
            const path = []
            let current = end;
            while (current !== null) {
                path.unshift(current);
                current = previous[current];
            }
            paths[end] = path[0] === start ? path : []
        }

        return { distances, paths };
    }

}



