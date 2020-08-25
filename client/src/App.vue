<template>



    <div id="app">

        <div id="left">


            <div id="top">
                
                <!--Query Box--> 
                <div id="query">
                    <h1>Query</h1>
                    <textarea></textarea>
                    <div id="stats">
                        <span id="text">
                            Response: 
                        </span>
                        <span id="button">
                            <button>Run Query</button>
                        </span>
                        
                        
                    </div>
                </div>
            </div>

            <div id="bottom">
                <!--History Box--> 
                <div id="history">
                    <h1>History</h1>
                </div>
            </div>
            

        </div>



        <div id="right">
            <!--Results Box-->
        </div>
        

    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'App',
    data: function () { 
        return { 
          
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
        sendQuery() { 
            this.queryStartTime = performance.now();
            axios.post('http://localhost:3000/', {"query": this.query})
                .then( res =>{ 
                    this.res = res;
                    console.log(JSON.stringify(res));
                })
                .catch( error => { 
                    console.log(error)
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

        background-color: #202124;
        color: white;

        font-family: "Poppins","Roboto","Noto",sans-serif;
    }

    #top { 

        border-bottom: 1px solid black;

        width: 50vw;
        height: 50vh;


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

    #left > div {
        padding: 20px;
     }

    #bottom { 
        flex: 1 1 auto;
    }
    
    #query { 
        
        height: 100%;   
        display: flex;
        flex-direction: column;
    }

    h1 { 
        margin: 20px 0;
    }
    

    #query textarea{ 
        display: block;
        height: 100%;
        padding: 5px;
        resize: none;
        background-color: rgba(0,0,0,0.2);
        border: 1px solid black;
        color: white;
        font-size: 1vw;
    }

    #stats { 
        border: 1px solid black;
        display: flex;
    }


    #stats span { 
        display: inline-block;
        
    }

    #stats #text { 
        margin: 10px;
        width: 90%;
    }

    #stats #button { 
        min-width: 100px;
        width: 10%;
    }

    #stats button { 
        
        width: 100%;
        height: 100%;

        border: 2px solid white;
        border-radius: 4px;
        background-color: #50fa7b;
        color: black;
        font-weight: 700;
        font-size: 15px;

    }
</style>
