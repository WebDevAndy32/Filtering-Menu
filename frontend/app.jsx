class App extends React.Component{
  constructor(props){
    super(props);


    
    this.state = {
      database: ["blank"],
      selections: {name: ['blank'],
                    brand: ['blank'], 
                    color: ['blank'], 
                    caffeine: ['High', 'Medium', 'Low', 'None'], 
                    type: ['Black', 'Green', 'White', 'Herbal'], 
                    tastes: ['Sweet', 'Citrusy', 'Smokey', 'Bitter', 'Aromatic', 'Funky', 'Spicy', 'Floral', 'Smooth', 'Fruity', 'Neutral'], 
                    ingredients: ['blank']
                  },
      activeSelections: [],
      optionInject: ''
    }
    this.selectionMenu = this.selectionMenu.bind(this);
    this.filteredMatches = this.filteredMatches.bind(this);
    this.getDatabase = this.getDatabase.bind(this);
    this.formatIngredients = this.formatIngredients.bind(this);
    this.buildSelections = this.buildSelections.bind(this);
    this.selectionsClick = this.selectionsClick.bind(this);
    this.optionsClick = this.optionsClick.bind(this);
    this.buildDataList = this.buildDataList.bind(this);
    this.valInject = this.valInject.bind(this);
    this.formClick = this.formClick.bind(this);
    this.updateActiveSelections = this.updateActiveSelections.bind(this);
    this.clearSelections = this.clearSelections.bind(this);
  }
  
  selectionMenu = () => {
    return this.buildSelections();
  }

  filteredMatches = (svgCup) => {
    //selected buttons define search criteria <== done in optionsClick
    if(this.state.database[0] == "blank"){
      return(
        <div>LOADING...</div>
      );
    }else{
      
    let returnedMatches = () => {
      let filterMatchBank = [];
      //look at each tea(item), see if it matches any of activeSelections, push to filterMatchBank if true
      this.state.database.forEach((item, index) => {
        //console.dir('item: ',item);
        let shouldPush = false;
        for(var x = 0; x < this.state.activeSelections.length; x++){
          const keyVal = Object.keys(this.state.activeSelections[x]);
          
          if(item[keyVal] == undefined){
            //catch missing values and logs them to console instead of letting them break everything :|
            console.log(`${item['tea-name']} is missing a value for ${keyVal}`);
          }else if(typeof item[keyVal] === 'string'){
            //console.log('string item keyval: ', item[keyVal], typeof item[keyVal]);
            //console.log('above compared to this from activeselections: ', this.state.activeSelections[x][keyVal]);
            if(this.state.activeSelections[x][keyVal] == item[keyVal]){
                shouldPush = true;
              }            
          }else{
            //this cond. handles array values like in tastesLike, then tests activeselection vs. all array items
            //console.log('item key value: ', item[keyVal], item[keyVal]);
            for(var y = 0; y < item[keyVal].length; y++){
              //console.log('cond. compare @57', this.state.activeSelections[x][keyVal], item[keyVal][y]);
              if(this.state.activeSelections[x][keyVal] == item[keyVal][y]){
                shouldPush = true;
              }            
            }
          }
        }
        if(shouldPush == true){
          filterMatchBank.push(item);
        }
      });
      return filterMatchBank;
    }
    //use search criteria to match tea objects
    let results;
    if(this.state.activeSelections.length > 0){
      results = returnedMatches();
    }else{
    //initial or nothing selected should show all available teas 
      results = this.state.database;
    }
    console.log('@84 active selections from state: ', this.state.activeSelections);
    //display matching teas on screen
    
    console.dir('@87 results: ', results);


      let filteredMatches = [];  
      
      results.forEach(elem => {
        console.dir('@88 elem: ', elem);
        console.log('@ 89 its undefined?!: ', elem['tastes']);
        let formattedTastes = elem['tastes'].map(thing => {
                     return (<li>{thing}</li>);
                   });
        console.log('@103 formatted tastes: ', formattedTastes);
        let elemToRender = (
            <div id={elem['tea-name']} key={elem['tea-name']} className='filtered-item'>
              <div className='word-space'>
                <h3 className='filter-item-name' id={elem['tea-name'] + '-h3'} key={elem['tea-name'] + '-h3'}>
                  {elem['tea-name']}
                </h3>
                <h4 className='filter-item-brand' id={elem['tea-brand'] + '-h4'} key={elem['tea-brand'] + '-h4'}>
                  By: {elem['tea-brand']}
               </h4>
               <h5 className='filter-item-tastes' id={elem['tea-name'] + '-tastes-h5'} key={elem['tea-name'] + '-tastes-h5'}>
                Tastes: 
                 <ul>{formattedTastes}</ul>
               </h5>  
              </div>
              <div className='svg-test'>
                {svgCup(elem['tea-color'])}
              </div>  
            </div>
        );
        filteredMatches.push(elemToRender);
      });
    
    return filteredMatches;

  }      
      
      
      
      
    }
    

  formatIngredients = (dBase) => {
    let tempDatabase = dBase;
    tempDatabase.forEach(tea => {
      let newArray = tea.ingredients.split(', ');
      tea.ingredients = newArray;
      //single taste entries come through as a string and break the li mapping function aboe, this makes them an array
      if(typeof tea.tastes == 'string'){
        let newTasteArray = [];
        newTasteArray.push(tea.tastes);
        tea.tastes = newTasteArray;
      }
    });
    console.log('@119 tempDatabase (activeselections): ', tempDatabase);
    this.setState({
      database: tempDatabase
    });

  }

  getDatabase = () => {
    fetch("https://raw.githubusercontent.com/WebDevAndy32/Filtering-Menu/main/backend/database.json")
    .then(result => {
          return result.json();
          })
    .then(jString => {
      this.formatIngredients(jString.teas);
      return;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  buildDataList = (list) => {
    
    //pull values from database 
    let listValues = [];
    let formattedListName = list == 'name' ? 'tea-name' : 
                              list == 'brand' ? 'tea-brand' : 
                                list == 'color' ? 'tea-color' : list;
    //console.log('formattedListName: ', formattedListName);

    this.state.database.forEach(targetKey => {
      //console.log('target key: ', targetKey);
      listValues.push(targetKey[formattedListName]);
    });
    //console.dir('listValues', listValues);

    //populate state.selections with values
    //WARNING THIS SETSTATE CAUSES INFINITE LOOP FOR SOME REASON
    //IF NEED, PULL SET STATE OUT AND HAVE IT RUN ONCE IN A FUNC CHAINED TO GETDATABASE

    /*this.setState(prevState => ({
      selections: {
        ...prevState.selections,
        [list] : listValues
      }
    }));*/
    //console.dir('selection state: ', this.state.selections);    
    //build a datalist element with the values
    let newDataList = [];
    let bank = [];
    listValues.forEach(val => {
      //console.dir('val @ 152', val, typeof val);
      if(typeof(val) === 'string'){
        if(bank.indexOf(val) === -1){
          let formattedVal = val.replace(' ', '-');
          let newOption = (
            <option value={val} id={formattedVal} key={formattedVal} />
          );
          newDataList.push(newOption);
          bank.push(val); 
        }  
      }else{
        for(var x = 0; x < val.length; x++){
          //console.log('arr side, index to bank', bank.indexOf(val[x]), bank);
          if(bank.indexOf(val[x]) === -1){
            let formattedVal = val[x].replace(' ', '-');
            let newOption = (
              <option value={val[x]} id={formattedVal} key={formattedVal} />
            );
            newDataList.push(newOption);
            bank.push(val[x]);
          } 
        }
      }

    });
    //console.dir('newDataList: ', newDataList);
    //serve the datalist element
    return(
      <form id={formattedListName + '-form'} onSubmit={this.formClick}>
        <input list={formattedListName}  onChange={this.valInject} value={this.state.optionInject}/>
        <datalist id={formattedListName} >
          {newDataList}
        </datalist>
      </form>
    );
  }

  buildSelections = () => {
    let selectionKeys = Object.keys(this.state.selections);
    let elementCollector = [];
    selectionKeys.forEach(ki => {
      let optionButtons = [];


      //conditional sorts for name, brand, color, and ingredient
      if(ki == 'name' || ki == 'brand' || ki == 'color' || ki == 'ingredients'){
        //empty database breaks app when rendering these elements
        if(this.state.database[0] === "blank"){
          let loadButton = (
            <div className='loading'>Loading...</div>
          );
          optionButtons.push(loadButton);
        }else{
          let altButton = this.buildDataList(ki);
          optionButtons.push(altButton);
        }
        
      }else{
        this.state.selections[ki].forEach(option => {
          let newButton = (
              <div id={'opt-' + ki + '-' + option} key={'opt-' + ki + '-' + option} onClick={this.optionsClick} className='options-button' >
              {option}
              </div>
          );
            optionButtons.push(newButton);  
        });
      }
      
      
      let newElement = (
      <div id={'r-sel-' + ki} key={'sel-' + ki} onClick={this.selectionsClick} className='selections-button'>
          {ki}
          <div id={'sel-options-' + ki} id={'sel-options-' + ki} className='options-space'>
            {optionButtons}
          </div>
      </div>    
      );
      elementCollector.push(newElement);
    });
    let clearButton = (
    <div id='opt-clear' className='selections-button' onClick={this.clearSelections}>Clear Search Criteria</div>
    );
    elementCollector.push(clearButton);
    return elementCollector;
  }
  
  selectionsClick = () => {
    let buttonId = event.target.id;
    //cond. prevents misclicks from causing errors    
    if(buttonId.includes('r-sel')){
      let clickedButton = document.getElementById(buttonId);

      clickedButton.classList.toggle('sel-menu-active');    

      let stateId = buttonId.slice(6);
      let selOptSpace = document.getElementById('sel-options-' + stateId);

      selOptSpace.classList.toggle('opt-space-active');      
    }
  }
  //switches option button on/off, updates activeSelections with clicked button value
  updateActiveSelections = (newObj) => {

    let activeArray = this.state.activeSelections;
    console.dir('active sel. @ updateActive... : ', activeArray);
    /*catches the index of matches between activeSelections and button's selection value*/
    let isMatch = [];
    activeArray.forEach((x, i) => {
      console.log('@279 matches: ', x, newObj);
      if(JSON.stringify(x) === JSON.stringify(newObj)){
        isMatch.push(i);
      }
    });
    console.log('isMatch: ', isMatch);
    if(isMatch.length < 1){
      activeArray.push(newObj);
    }else{
      let cutPoint = isMatch;
      activeArray.splice(cutPoint, 1);
    }
    console.log('@290 active array: ', activeArray);
    this.setState({
      activeSelections: activeArray
    });

  }
  optionsClick = () => {
    let buttonId = event.target.id;
    let clickedButton = document.getElementById(buttonId);
    console.log('buttonId', buttonId);
    clickedButton.classList.toggle('opt-but-active');
    
    let tempArray = buttonId.split("-"),
        tempKeyVal = new Object({[tempArray[1]] : tempArray[2]});

    this.updateActiveSelections(tempKeyVal);

  }
  
  valInject = () => {
    this.setState({
      optionInject: event.target.value
    });
    //event.preventDefault();
  }
  
  formClick = () => {
    event.preventDefault();
    console.log('target id: ', event.target.id);
    let newKey = event.target.id.slice(0, -5);
    console.log('newKey: ', newKey)
    let newVal = this.state.optionInject;
    let formKeyVal = new Object({[newKey] : newVal});
    console.dir('formKeyVal @ formClick: ', formKeyVal);
    this.updateActiveSelections(formKeyVal);

    this.setState({
      optionInject: ''
    });
  }

  clearSelections = () => {
    this.setState({
      activeSelections: []
    });
    
    let activeButtons = document.getElementsByClassName('sel-but-active');
    let buttonKeys = Object.keys(activeButtons);
    buttonKeys.forEach(key => {
      activeButtons[key].classList.toggle('sel-but-active');
    });
  }
  
  componentDidMount(){
      this.getDatabase();
  }  

  render(){


const svgCup = (fillColor) => {
  
/*big ugly svg element below. ends @ line 552*/
//id for liquid g element is 'liquid-path'
//id for cup g element is 'cup-paths'
  return (<svg
    id='tea-cup'
    class='cup'
    viewBox='0 0 300 300'>
    <g 
     class='gen-path liquid-path'
     transform="translate(0.000000,325.000000) scale(0.100000,-0.100000)"
     fill={fillColor}
     stroke="none">
    <path
       d="M1852.844 2379.454 c 172,-27 335.6531,-91 335.6531,-128 0,-7 0.5029,-85.454 -13.4971,-192.454 -14,-107 -35,-264 -46,-349 -11,-85 -31,-231 -45,-325 -14,-93 -27,-197 -28,-230 -2,-33 -15,-150 -30,-260 C 1974,490 1964,465 1792,325 1661,218 1636,204 1489,154 l -144,-49 h -180 c -191,0 -250,10 -352,56 -104,48 -243,154 -243,185 0,7 -11,26 -25,42 -14,17 -32,50 -41,74 -21,60 -68,322 -115,641 -31,214 -141.84399,945.688 -169.84399,1115.688 27.15257,40.3299 50.56397,59.6564 102.84399,76.312 144,45 329,79 543,99 94,9 186,18 205,20 86,10 694.844,-19.546 782.844,-34.546 z" />
    </g>
    <g 
     class='gen-path cup-paths'
     transform="translate(0.000000,325.000000) scale(0.100000,-0.100000)"
     fill="black"
     stroke="none">
    <path d="M620 3180 c-452 -7 -522 -13 -555 -50 -17 -18 -17 -26 -2 -117 9 -54
    19 -120 22 -148 10 -79 61 -395 96 -595 5 -30 12 -71 15 -90 3 -19 16 -102 30
    -185 45 -267 64 -388 74 -480 5 -49 16 -126 24 -170 9 -44 17 -99 20 -123 3
    -23 7 -45 9 -50 3 -4 8 -41 11 -81 4 -41 9 -77 11 -80 1 -4 6 -40 9 -81 6 -84
    17 -149 45 -265 11 -44 25 -105 32 -135 18 -82 47 -171 66 -200 37 -56 132
    -144 196 -182 194 -113 499 -139 762 -63 178 51 308 128 398 235 107 128 128
    196 162 525 5 55 19 145 31 203 4 21 8 22 117 23 310 1 387 17 481 101 120
    105 189 257 272 603 35 144 45 373 20 479 -40 170 -127 276 -274 334 -99 39
    -144 49 -291 62 -63 5 -116 12 -119 15 -7 7 33 279 63 430 5 24 1 35 -18 53
    -22 21 -38 24 -188 32 -177 10 -825 10 -1519 0z m725 -25 c126 0 203 3 207 10
    5 6 8 5 8 -2 0 -10 39 -13 161 -13 125 0 159 3 153 13 -6 10 -4 10 7 0 14 -14
    43 -18 36 -5 -3 4 61 4 141 0 256 -12 283 -19 263 -71 -6 -14 -17 -70 -25
    -124 -8 -54 -23 -144 -32 -201 -22 -125 -19 -131 77 -138 134 -10 241 -25 283
    -39 233 -79 317 -198 333 -473 6 -108 -6 -216 -37 -337 -9 -38 -23 -95 -30
    -125 -44 -186 -107 -323 -190 -413 -105 -114 -143 -126 -419 -131 -125 -2
    -207 -8 -213 -14 -14 -14 -25 -83 -74 -457 -9 -73 -30 -147 -51 -188 -23 -44
    -152 -197 -167 -197 -6 0 -42 -20 -80 -45 -70 -45 -167 -82 -286 -110 -161
    -37 -424 -27 -538 20 -19 8 -43 15 -53 15 -18 0 -119 63 -173 107 -44 36 -103
    115 -124 164 -25 58 -88 350 -106 489 -8 61 -46 330 -50 355 -2 11 -13 85 -26
    165 -26 173 -74 480 -130 830 -23 140 -43 266 -45 280 -21 144 -27 181 -35
    220 -5 25 -11 65 -14 90 -10 89 -27 198 -36 231 -18 62 12 74 212 88 57 4 94
    2 91 -3 -4 -5 7 -6 23 -3 16 4 92 9 169 11 107 3 121 2 60 -4 -44 -4 33 -5
    170 -2 138 3 267 4 288 3 24 -1 37 3 37 11 0 8 3 9 8 3 4 -6 85 -10 207 -10z
    m288 8 c-7 -2 -19 -2 -25 0 -7 3 -2 5 12 5 14 0 19 -2 13 -5z m165 0 c-26 -2
    -71 -2 -100 0 -29 2 -8 3 47 3 55 0 79 -1 53 -3z m-1025 -10 c-7 -2 -21 -2
    -30 0 -10 3 -4 5 12 5 17 0 24 -2 18 -5z"/>
    <path d="M1998 3143 c12 -2 32 -2 45 0 12 2 2 4 -23 4 -25 0 -35 -2 -22 -4z"/>
    <path d="M1152 3134 c7 -6 279 -6 286 1 3 3 -61 5 -143 5 -82 0 -146 -2 -143
    -6z"/>
    <path d="M2208 3113 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
    <path d="M1288 3073 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
    <path d="M2230 3070 c36 -12 72 -12 65 0 -3 6 -25 10 -48 9 -36 -1 -38 -2 -17
    -9z"/>
    <path d="M105 3060 c-4 -7 3 -8 22 -4 38 9 42 14 10 14 -14 0 -29 -5 -32 -10z"/>
    <path d="M925 3060 c4 -6 -55 -11 -157 -13 -154 -2 -151 -3 54 -5 119 -1 219
    1 221 6 3 4 -19 6 -49 5 -30 -1 -54 2 -54 7 0 6 -5 10 -11 10 -5 0 -7 -4 -4
    -10z"/>
    <path d="M212 3054 c7 -6 288 -7 295 0 3 2 -64 5 -148 5 -84 1 -150 -1 -147
    -5z"/>
    <path d="M1065 3050 c3 -5 13 -10 21 -10 8 0 12 5 9 10 -3 6 -13 10 -21 10 -8
    0 -12 -4 -9 -10z"/>
    <path d="M1155 3050 l-50 -7 50 -1 c28 0 59 3 70 8 20 9 20 9 0 8 -11 -1 -42
    -4 -70 -8z"/>
    <path d="M1470 3048 c0 -10 9 -9 35 2 17 8 16 8 -7 7 -16 -1 -28 -5 -28 -9z"/>
    <path d="M1530 3053 c0 -5 69 -7 152 -5 279 4 306 8 76 10 -126 1 -228 -1
    -228 -5z"/>
    <path d="M2138 3053 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
    <path d="M158 3043 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
    <path d="M1293 3043 c26 -2 68 -2 95 0 26 2 4 3 -48 3 -52 0 -74 -1 -47 -3z"/>
    <path d="M2175 3026 c16 -11 21 -27 24 -74 2 -23 19 -3 23 27 2 17 0 27 -5 24
    -5 -3 -15 4 -23 16 -8 12 -20 21 -26 21 -7 0 -4 -6 7 -14z"/>
    <path d="M2136 2994 c-4 -20 -5 -38 -3 -40 3 -3 8 11 11 32 4 20 5 38 3 40 -3
    3 -8 -11 -11 -32z"/>
    <path d="M1041 3016 c7 -8 199 -9 206 -2 4 3 -42 6 -102 6 -60 0 -106 -2 -104
    -4z"/>
    <path d="M2238 2976 c-3 -14 -1 -31 3 -38 6 -8 9 1 9 25 0 42 -6 48 -12 13z"/>
    <path d="M2174 2929 c-4 -7 -3 -9 4 -5 5 3 13 0 15 -6 4 -9 6 -10 6 -1 1 17
    -16 25 -25 12z"/>
    <path d="M2086 2693 c-6 -14 -5 -15 5 -6 7 7 10 15 7 18 -3 3 -9 -2 -12 -12z"/>
    <path d="M2250 2599 c0 -9 -2 -24 -5 -31 -4 -9 2 -14 15 -15 16 -1 20 4 20 31
    0 22 -5 33 -15 33 -8 0 -15 -8 -15 -18z"/>
    <path d="M2305 2581 c-7 -12 32 -21 85 -20 l45 1 -49 8 c-26 5 -54 11 -62 14
    -7 3 -16 1 -19 -3z"/>
    <path d="M2120 2566 c0 -8 4 -17 9 -20 5 -4 7 3 4 14 -6 23 -13 26 -13 6z"/>
    <path d="M2241 2497 c-7 -23 -19 -91 -27 -152 -21 -155 -70 -525 -99 -750 -13
    -104 -27 -201 -30 -215 -13 -64 -16 -127 -6 -152 l11 -28 158 0 c87 0 185 5
    218 11 108 19 201 95 262 214 11 22 36 92 56 155 91 295 114 504 71 655 -20
    70 -86 169 -134 201 -45 29 -149 59 -238 69 -114 11 -214 25 -221 29 -4 2 -13
    -14 -21 -37z m199 -21 c238 -27 301 -60 367 -190 31 -62 37 -82 41 -164 12
    -234 -91 -636 -199 -773 -74 -94 -155 -118 -391 -119 -157 0 -158 0 -159 23
    -2 27 1 54 7 87 3 14 7 52 10 85 3 33 9 80 14 105 5 25 11 74 15 110 5 62 18
    162 50 390 8 58 19 143 26 190 15 118 39 262 45 272 3 4 15 6 27 3 12 -3 78
    -11 147 -19z"/>
    <path d="M2358 2533 c17 -2 47 -2 65 0 17 2 3 4 -33 4 -36 0 -50 -2 -32 -4z"/>
    <path d="M2513 2523 c9 -2 25 -2 35 0 9 3 1 5 -18 5 -19 0 -27 -2 -17 -5z"/>
    <path d="M2590 2510 c14 -4 34 -8 45 -8 16 0 15 2 -5 8 -14 4 -34 8 -45 8 -16
    0 -15 -2 5 -8z"/>
    <path d="M2706 2475 c97 -48 163 -120 206 -223 12 -31 17 -37 13 -17 -9 43
    -40 104 -74 146 -38 46 -129 108 -167 114 -22 4 -17 -1 22 -20z"/>
    <path d="M850 2442 c0 -5 7 -9 15 -9 8 0 12 4 9 9 -3 4 -9 8 -15 8 -5 0 -9 -4
    -9 -8z"/>
    <path d="M1061 2429 c13 -8 88 -14 78 -5 -2 2 -24 6 -48 9 -29 4 -40 2 -30 -4z"/>
    <path d="M1198 2428 c6 -6 18 -8 28 -6 14 3 12 5 -9 10 -19 3 -25 2 -19 -4z"/>
    <path d="M685 2420 c3 -5 8 -10 11 -10 2 0 4 5 4 10 0 6 -5 10 -11 10 -5 0 -7
    -4 -4 -10z"/>
    <path d="M1390 2420 c-23 -7 -23 -8 -3 -9 12 -1 25 4 28 9 3 6 5 10 3 9 -2 -1
    -14 -5 -28 -9z"/>
    <path d="M1478 2407 c-14 -19 -19 -20 -37 -10 -11 7 -22 9 -25 4 -7 -10 -54
    -2 -62 10 -3 5 -9 9 -15 9 -5 0 -1 -8 9 -18 13 -13 33 -17 82 -17 36 0 65 4
    65 10 0 6 4 16 8 23 14 21 -7 12 -25 -11z"/>
    <path d="M1740 2410 c0 -5 5 -10 11 -10 5 0 7 5 4 10 -3 6 -8 10 -11 10 -2 0
    -4 -4 -4 -10z"/>
    <path d="M480 2400 c0 -5 5 -10 11 -10 5 0 7 5 4 10 -3 6 -8 10 -11 10 -2 0
    -4 -4 -4 -10z"/>
    <path d="M1040 2401 c-41 -4 -107 -6 -147 -6 -39 0 -69 -3 -67 -7 3 -5 -10 -8
    -28 -8 -70 0 -106 -5 -102 -12 8 -13 -11 -9 -25 5 -9 7 -11 8 -7 0 4 -8 -9
    -10 -44 -9 -47 2 -49 1 -34 -13 12 -12 18 -13 21 -3 3 6 12 12 21 12 15 0 15
    -2 2 -11 -12 -8 -10 -9 8 -4 45 13 92 14 85 2 -5 -8 -2 -8 8 0 9 7 25 11 37 8
    12 -2 24 1 27 6 4 5 11 7 16 3 6 -3 19 2 29 11 12 11 20 13 25 6 3 -6 1 -11
    -4 -11 -6 0 -11 -5 -11 -11 0 -5 6 -7 12 -3 7 5 22 9 33 11 32 4 68 11 99 19
    18 4 27 3 23 -3 -3 -5 0 -10 8 -10 8 0 11 5 8 10 -3 6 -1 7 5 3 7 -4 12 -15
    12 -24 0 -11 3 -13 8 -6 8 12 14 13 105 15 34 1 67 4 72 7 13 9 85 11 80 2 -2
    -3 6 -7 17 -7 18 -2 19 0 5 15 -15 16 -80 23 -93 10 -3 -3 -20 -2 -39 2 -19 4
    -35 7 -37 5 -2 -1 -16 -5 -31 -9 -19 -4 -26 -3 -22 4 3 5 5 9 3 8 -2 -1 -37
    -4 -78 -7z m-140 -21 c0 -5 -5 -10 -11 -10 -5 0 -7 5 -4 10 3 6 8 10 11 10 2
    0 4 -4 4 -10z"/>
    <path d="M590 2390 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0
    -10 -4 -10 -10z"/>
    <path d="M1515 2392 c2 -3 -3 -11 -13 -19 -16 -13 -15 -13 3 -4 12 5 27 6 36
    1 20 -12 47 4 28 16 -15 9 -63 14 -54 6z"/>
    <path d="M1702 2386 c-21 -11 -21 -11 8 -28 22 -12 28 -13 23 -3 -5 15 13 14
    51 -1 14 -5 17 -3 14 7 -3 8 -11 13 -18 11 -7 -1 -22 4 -34 12 -17 11 -27 11
    -44 2z m28 -6 c0 -5 -8 -10 -17 -10 -15 0 -16 2 -3 10 19 12 20 12 20 0z"/>
    <path d="M1596 2378 c3 -5 10 -6 15 -3 13 9 11 12 -6 12 -8 0 -12 -4 -9 -9z"/>
    <path d="M1640 2380 c0 -5 4 -10 9 -10 6 0 13 5 16 10 3 6 -1 10 -9 10 -9 0
    -16 -4 -16 -10z"/>
    <path d="M2815 2360 c15 -19 40 -60 54 -90 24 -52 26 -64 25 -200 -1 -315 -91
    -668 -205 -807 -29 -35 -28 -35 8 3 101 108 185 388 213 714 17 191 -10 309
    -88 381 l-36 34 29 -35z"/>
    <path d="M1824 2361 c0 -11 5 -17 13 -14 10 4 11 9 2 19 -15 18 -15 18 -15 -5z"/>
    <path d="M1883 2345 c0 -8 4 -12 9 -9 5 3 6 10 3 15 -9 13 -12 11 -12 -6z"/>
    <path d="M506 2339 c5 -8 -24 -14 -53 -10 -6 1 -14 -3 -18 -9 -4 -7 -11 -8
    -18 -2 -8 6 -21 6 -37 -1 -14 -5 -36 -9 -50 -8 -20 2 -22 0 -10 -8 15 -10 14
    -12 -12 -15 -7 -1 -12 -7 -11 -14 2 -7 -2 -12 -7 -12 -6 0 -10 -5 -10 -12 0
    -6 10 -2 23 9 21 20 54 34 87 38 62 8 111 19 116 26 3 5 10 7 15 3 5 -3 6 -10
    3 -16 -4 -5 4 -4 17 3 13 7 27 12 32 11 4 -1 7 3 7 8 0 11 0 11 -47 15 -18 1
    -30 -1 -27 -6z m49 -9 c-3 -5 -11 -10 -16 -10 -6 0 -7 5 -4 10 3 6 11 10 16
    10 6 0 7 -4 4 -10z"/>
    <path d="M1940 2340 c8 -5 25 -10 37 -10 12 0 23 -5 25 -12 3 -7 14 -9 32 -4
    34 8 29 16 -16 22 -18 2 -46 6 -63 9 -22 4 -26 2 -15 -5z"/>
    <path d="M2090 2302 c0 -15 4 -20 16 -15 9 3 12 9 7 12 -4 3 -11 10 -15 15 -5
    5 -8 0 -8 -12z"/>
    <path d="M1350 2280 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0
    -10 -4 -10 -10z"/>
    <path d="M2160 2250 c-43 -27 -302 -100 -356 -100 -13 0 -24 -5 -24 -10 0 -6
    10 -8 23 -5 90 20 122 25 139 19 31 -9 88 5 88 22 0 9 7 14 18 12 14 -3 17
    -14 15 -78 l-1 -75 9 55 c5 30 11 69 14 86 4 22 12 34 28 37 21 6 21 6 3 -8
    -11 -8 -15 -15 -10 -15 13 0 79 58 73 64 -3 3 -11 1 -19 -4z"/>
    <path d="M249 2211 c13 -12 29 -21 37 -21 8 0 14 -7 14 -15 0 -8 5 -15 11 -15
    5 0 7 5 4 10 -3 6 -2 10 3 10 6 0 13 -7 16 -16 4 -12 14 -14 38 -9 22 4 28 3
    20 -3 -11 -7 -9 -10 7 -15 12 -3 19 -1 15 4 -3 5 0 9 5 9 6 0 11 -5 11 -11 0
    -7 12 -9 36 -4 27 5 34 3 28 -6 -5 -9 1 -10 20 -7 15 3 48 -1 73 -8 52 -16
    108 -17 138 -4 13 6 -1 7 -40 4 -42 -3 -54 -2 -40 5 17 8 16 10 -11 10 -76 2
    -259 47 -389 95 -17 7 -17 5 4 -13z"/>
    <path d="M2932 2170 c0 -14 2 -19 5 -12 2 6 2 18 0 25 -3 6 -5 1 -5 -13z"/>
    <path d="M1724 2139 c-44 -8 -471 -45 -601 -53 -45 -2 -84 -1 -88 2 -3 3 -15
    7 -27 9 -18 3 -19 1 -7 -13 12 -15 33 -16 189 -10 202 7 213 8 380 31 69 9
    140 18 159 20 32 4 49 11 40 18 -2 2 -22 0 -45 -4z"/>
    <path d="M285 1981 c2 -30 9 -59 14 -64 11 -11 4 49 -11 93 -5 17 -6 8 -3 -29z"/>
    <path d="M2042 1895 c0 -16 2 -22 5 -12 2 9 2 23 0 30 -3 6 -5 -1 -5 -18z"/>
    <path d="M2046 1408 c-12 -37 -13 -59 -5 -64 5 -3 9 5 10 18 0 13 2 31 4 41 4
    19 -4 23 -9 5z"/>
    <path d="M2030 1318 c0 -9 5 -20 10 -23 13 -8 13 5 0 25 -8 13 -10 13 -10 -2z"/>
    <path d="M2002 1280 c0 -14 2 -19 5 -12 2 6 2 18 0 25 -3 6 -5 1 -5 -13z"/>
    <path d="M2041 1264 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
    <path d="M2000 1240 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0
    -10 -4 -10 -10z"/>
    <path d="M2030 1211 c0 -5 5 -13 10 -16 6 -3 10 -2 10 4 0 5 -4 13 -10 16 -5
    3 -10 2 -10 -4z"/>
    <path d="M2620 1199 c-22 -18 -22 -19 -3 -10 12 6 25 16 28 21 9 15 3 12 -25
    -11z"/>
    <path d="M2067 1163 c-4 -20 -3 -41 2 -46 4 -4 11 9 14 30 4 20 3 41 -2 46 -4
    4 -11 -9 -14 -30z"/>
    <path d="M2031 1164 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/>
    <path d="M2421 1176 c2 -2 22 -6 44 -9 28 -5 34 -4 20 3 -19 8 -73 14 -64 6z"/>
    <path d="M2148 1163 c12 -2 30 -2 40 0 9 3 -1 5 -23 4 -22 0 -30 -2 -17 -4z"/>
    <path d="M2348 1163 c12 -2 32 -2 45 0 12 2 2 4 -23 4 -25 0 -35 -2 -22 -4z"/>
    <path d="M2148 1133 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
    <path d="M2258 1123 c18 -2 45 -2 60 0 15 2 0 4 -33 4 -33 0 -45 -2 -27 -4z"/>
    <path d="M1871 419 c-30 -33 -59 -59 -64 -59 -6 0 -18 -7 -27 -15 -9 -8 -57
    -36 -106 -61 -49 -25 -78 -42 -64 -39 14 4 42 16 63 27 49 24 55 19 18 -16
    -17 -16 -52 -33 -87 -43 -33 -8 -64 -19 -71 -25 -7 -5 -17 -7 -22 -4 -5 4 -13
    1 -16 -4 -6 -10 -47 -30 -70 -34 -5 -1 -14 -4 -20 -8 -12 -7 -116 -19 -198
    -23 -75 -3 -257 18 -281 32 -6 4 -26 8 -45 10 -19 2 -37 7 -40 11 -3 5 -23 15
    -43 21 -21 7 -79 41 -130 77 l-93 65 58 -56 c73 -69 192 -128 318 -156 112
    -25 290 -30 394 -10 108 21 303 98 354 140 24 20 69 55 100 78 70 52 108 90
    127 126 22 42 4 31 -55 -34z m-121 -114 c-7 -8 -17 -15 -23 -15 -6 0 -2 7 9
    15 25 19 30 19 14 0z"/>
    <path d="M530 421 c0 -18 89 -101 111 -104 8 -2 20 -6 27 -10 6 -5 12 -4 12 2
    0 6 -12 17 -27 25 -16 8 -39 24 -53 36 -14 12 -35 30 -47 41 -13 10 -23 15
    -23 10z"/>
    <path d="M1535 230 c-3 -5 1 -10 9 -10 9 0 16 5 16 10 0 6 -4 10 -9 10 -6 0
    -13 -4 -16 -10z"/>
    <path d="M1468 203 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
    <path d="M1428 193 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
    <path d="M1338 183 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
    <path d="M1280 148 c0 -4 4 -8 9 -8 6 0 12 4 15 8 3 5 -1 9 -9 9 -8 0 -15 -4
    -15 -9z"/>
    <path d="M1138 143 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
    <path d="M1228 143 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"/>
  </g>
  </svg>  
  );
}
    
    return(
      <div id='react-container'>
        <div id='menu-space'>
          {this.selectionMenu()}
        </div>
        <div id='filtered-matches'>
          {this.filteredMatches(svgCup)}
        </div>
        <div>
          {/*<svg href="https://raw.githubusercontent.com/WebDevAndy32/Filtering-Menu/main/svg%20full%20simple%20closed.svg">
          </svg>*/}
        </div>
      </div>  
    );
  }
}

ReactDOM.render(React.createElement(App), document.getElementById('main-container'));
