<template>



    <div id="app">

        <div id="left">


            <div id="top">
                
                <!--Query Box--> 
                <div id="query">
                    <h1>Query</h1>
                    <textarea v-model="text"></textarea>
                    <div id="stats">
                        <span id="text">
                            Response: {{response}} 
                        </span>
                        <span class="button">
                            <button @click="runQuery(text)">Run Query</button>
                        </span>
                        
                        
                    </div>
                </div>
            </div>

            <div id="bottom">
                <!--History Box--> 
                <div id="history">
                    <h1>History</h1>
                    <div id="queryHistory">
                           <div class="li" v-for="query in queryHistory" :key="query.id">
                                <span class="query">{{query.display}}</span>
                                <span class="button">
                                    <button>Copy</button>
                                </span>
                                <span class="button">
                                    <button @click="runQuery(query.text)">Run</button>
                                </span>
                                <span class="button remove">
                                    <button @click="removeQuery(query.id)">X</button>
                                </span>
                                
                                
                            </div>
                    </div>
                </div>
            </div>
            

        </div>



        <div id="right">
            <!--Results Box-->
            <div id="results">
                <h1>Results</h1>

                <div id="table">
                    <table>
                        <thead>
                            <tr>
                                <th v-for="name in Object.keys(resultsTable[0])" :key="name">{{name}}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in resultsTable" :key="row">
                                <td v-for="data in row" :key="data">{{ data }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
        

    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'App',
    data: function () { 
        return { 
            text: '',
            response: '',
            resultsTable: [{}],
            stored: 0,
            queryHistory: [],

            requestStart: 0, 
            requestEnd: 0
        }
    },
    computed: { 
        timeEllapsed() { 
            return this.requestEnd - this.requestStart;
        }
    },
    methods: {
         
        savePositions() { 
            const target = document.getElementById('top');
            window.localStorage.setItem("height", target.style.height);
            window.localStorage.setItem("width", target.style.width);
        },
        loadPositions() { 
            const target = document.getElementById('top');   
            target.style.height = window.localStorage.getItem("height") || "50vh";
            target.style.width = window.localStorage.getItem("width") || "50vw";
        },

        saveQuery(query){ 
            console.log("Saving to: " + this.stored);
            this.queryHistory.push({text: query, display: query.substring(0, 50) + " ...", id: this.stored});
            this.stored = this.stored+1;
        },
        removeQuery(id){ 
            console.log("Deleting: " + id);
            this.queryHistory = this.queryHistory.filter( query => {
                return query.id !== id;
            })
            
        },
        runQuery(query){ 
            if (query==''){ 
                return this.response = "Please enter a query.";
            } 
            this.response = "Running..."
            this.requestStart = performance.now();
            this.response = this.sendQuery(query);
            this.saveQuery(query);
        },

        sendQuery(query) { 
            this.queryStartTime = performance.now();
            axios.post('http://localhost:3000/', {"query": query})
                .then( res =>{ 
                    this.requestEnd = performance.now();
                    // SELECTS will return 0-*
                    console.log(res);
                    if (Array.isArray(res.data)) { 
                        this.response = res.data.length + " Results returned in " + this.timeEllapsed + "ms";
                        if (res.data.length==0) { 
                            this.resultsTable = [{}]
                        } else { 
                            this.resultsTable = res.data
                        }
                        
                    }
                    // INSERTS/UPDATES/DELETES RETURN 0 
                })
                .catch( error => { 
                    this.response = error.response.data || error.response;
                })
        }
    },
    mounted(){ 
        
        //this.loadPositions();
        window.addEventListener('beforeunload', this.savePositions);

    }
}
</script>

<style>

    *{ 
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    #app { 

        display: flex;  
        
        height: 100vh;
        width: 100vw;

        max-height: 100vh;
        max-width: 100vw;

        font-family: "Poppins","Roboto","Noto",sans-serif;
    }

    #top { 

        border-bottom: 1px solid black;

        width: 50vw;
        height: 50vh;

        min-width: 25vw;
        max-width: 80vw;

        resize: both;
        overflow: auto;
    }

    #top, #bottom { 
          min-height: 20vh;
    }

    #left { 
        display: flex;
        flex-direction: column;
        border-right: 1px solid black;
    }

    #right { 
        flex: 1 1 auto;
    }

    #left > div {
        padding: 20px;
     }

    #bottom { 
        flex: 1 1 0;
        overflow: hidden;
    }
    
    #query { 
        
        height: 100%;   
        display: flex;
        flex-direction: column;
    }

    h1 { 
        margin: 20px 0;
        position: sticky;
    }
    

    #query textarea{ 
        display: block;
        height: 100%;
        padding: 5px;
        resize: none;

        border: 1px solid black;

        font-size: 16px;
    }

    #stats { 
        border: 1px solid black;
        display: flex;
    }


    #stats span, #queryHistory span { 
        display: inline-block;
        
    }

    #stats #text { 
        margin: 10px;
        width: 90%;
    }

    #stats .button { 
        min-width: 100px;
        width: 10%;
    }

    #history { 
        display: flex;
        flex-direction: column;

        height: 100%;
        
    }

    #queryHistory { 
        flex: 1 1 0;
        overflow-y: auto;
    }


    button { 
        
        width: 100%;
        height: 100%;

        border: 2px solid white;
        border-radius: 8px;
        background-color: #007bff;
        color: white;
        font-weight: 700;
        font-size: 15px;

    }

    button:hover { 
        background-color: #005aff;
    }

    div.li { 
        list-style-type: none;
        width: 100%;
        border: 1px solid black;
    }
    div.li .button { 
        height: 40px;
        width: 10%;
    }
    div.li .remove { 
        width: 5%;
        
    }
    .remove button { 
        background-color: rgb(240, 64, 44);
    }
    .remove button:hover { 
        background-color: red;
    }
    .query { 
        padding: 10px;
        width: 75%;
        max-height: 40px;
        word-wrap: break-word;
    }

    #results h1{ 
        text-align: center;
    }

    #table { 
        margin: auto;
        max-width: 80%;
        max-height: 90vh;
        overflow: auto;
    }

    table { 
        margin: auto;
        width: 100%;
    }

    table, th, td { 
        border: 1px solid black;
        border-collapse: collapse;
    }

    th, td { 
        padding: 10px;
    }

</style>
