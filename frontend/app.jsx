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
      activeSelections: []
    }
    this.selectionMenu = this.selectionMenu.bind(this);
    this.filteredMatches = this.filteredMatches.bind(this);
    this.getDatabase = this.getDatabase.bind(this);
    this.formatIngredients = this.formatIngredients.bind(this);
    this.buildSelections = this.buildSelections.bind(this);
    this.selectionsClick = this.selectionsClick.bind(this);
    this.optionsClick = this.optionsClick.bind(this);
    this.buildDataList = this.buildDataList.bind(this);
  }
  
  selectionMenu = () => {
    return this.buildSelections();
  }

  filteredMatches = () => {
    //selected buttons define search criteria <== done in optionsClick
    
    let returnedMatches = () => {
      let filterMatchBank = [];
      //look at each tea(item), see if it matches any of activeSelections, push to filterMatchBank if true
      this.state.database.forEach((item, index) => {
        let shouldPush = false;
        for(var x = 0; x < this.state.activeSelections.length; x++){
          const keyVal = Object.keys(this.state.activeSelections[x]);

          if(typeof item[keyVal] == 'string'){
            if(this.state.activeSelections[x][keyVal] == item[keyVal]){
                shouldPush = true;
              }            
          }else{
            //this cond. handles array values like in tastesLike, then tests activeselection vs. all array items
            //console.log('item key value: ', item[keyVal]);
            for(var y = 0; y < item[keyVal].length; y++){
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
    
    //display matching teas on screen
    let filteredMatches = [];
    
    results.forEach(elem => {
      let elemToRender = (
          <div id={elem['tea-name']} key={elem['tea-name']} className='filtered-item'>
              <ul>
                  <li id={elem['tea-name'] + '-li-1'} key={elem['tea-name'] + '-li-1'}>
                      {elem['tea-name']}
                  </li>
                  <li id={elem['tea-brand'] + '-li-2'} key={elem['tea-brand'] + '-li-2'}>
                      {elem['tea-brand']}
                  </li>
              </ul>
              <span style={{background: elem['tea-color']}}></span>
          </div>
      );
      filteredMatches.push(elemToRender);
    });
    
    return filteredMatches;
  }

  formatIngredients = (dBase) => {
    let tempDatabase = dBase;
    tempDatabase.forEach(tea => {
      let newArray = tea.ingredients.split(', ');
      tea.ingredients = newArray;
    });
    console.log(tempDatabase);

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
    console.dir('listValues', listValues);

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
          console.log('arr side, index to bank', bank.indexOf(val[x]), bank);
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
      <form>
        <input list={formattedListName} />
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
              <div id={'opt-' + ki + '-' + option} key={'opt-' + ki + '-' + option} onClick={this.optionsClick} className='selections-button' >
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
    return elementCollector;
  }
  
  selectionsClick = () => {
    let buttonId = event.target.id;
    //cond. prevents misclicks from causing errors    
    if(buttonId.includes('r-sel')){
      let clickedButton = document.getElementById(buttonId);

      clickedButton.classList.toggle('sel-but-active');    

      let stateId = buttonId.slice(6);
      let selOptSpace = document.getElementById('sel-options-' + stateId);

      selOptSpace.classList.toggle('opt-space-active');      
    }
  }
  //switches option button on/off, updates activeSelections with clicked button value
  optionsClick = () => {
    let buttonId = event.target.id;
    let clickedButton = document.getElementById(buttonId);
    //console.log('buttonId', buttonId);
    clickedButton.classList.toggle('sel-but-active');
    
    let tempArray = buttonId.split("-"),
        tempKeyVal = new Object({[tempArray[1]] : tempArray[2]});

    let activeArray = this.state.activeSelections;
    /*catches the index of matches between activeSelections and button's selection value*/
    let isMatch = [];
    activeArray.forEach((x, i) => {
      if(JSON.stringify(x) === JSON.stringify(tempKeyVal)){
        isMatch.push(i);
      }
    });
    //console.log('isMatch: ', isMatch);
    if(isMatch.length < 1){
      activeArray.push(tempKeyVal);
    }else{
      let cutPoint = activeArray[isMatch];
      activeArray.splice(cutPoint, 1);
    }
    this.setState({
      activeSelections: activeArray
    });
    //console.log("state:", this.state.activeSelections);
  }
  
  componentDidMount(){
      this.getDatabase();
  }  

  render(){

    return(
      <div id='react-container'>
        <div id='filtered-matches'>
          {this.filteredMatches()}
        </div>
        <div id='menu-space'>
          {this.selectionMenu()}
          <br/>
        </div>
      </div>  
    );
  }
}

ReactDOM.render(React.createElement(App), document.getElementById('main-container'));
