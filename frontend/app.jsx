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
                   tastesLike: ['Sweet', 'Citrusy', 'Smokey', 'Bitter', 'Aromatic', 'Funky', 'Spicy', 'Floral', 'Smooth', 'Fruity', 'Neutral'], 
                   ingredients: ['blank']
                  },
      activeSelections: []
    }
    this.selectionMenu = this.selectionMenu.bind(this);
    this.filteredMatches = this.filteredMatches.bind(this);
    this.getDatabase = this.getDatabase.bind(this);
    this.buildSelections = this.buildSelections.bind(this);
    this.selectionsClick = this.selectionsClick.bind(this);
    this.optionsClick = this.optionsClick.bind(this);
  }
  
  selectionMenu = () => {
    return this.buildSelections();
  }
  //onclick for selection buttons should update filteredMatches, but how      
  filteredMatches = () => {
    //selected buttons define search criteria <== done in optionsClick
    
    let returnedMatches = () => {
      let filterMatchBank = [];
      //look at each tea(item), see if it matches any of activeSelections, push to filterMatchBank if true
      this.state.database.forEach((item, index) => {
        let shouldPush = false;
        for(var x = 0; x < this.state.activeSelections.length; x++){
          const keyVal = Object.keys(this.state.activeSelections[x]);
          //console.log('keyVal: ', keyVal);
          //console.log('criteria keyVal: ', this.state.activeSelections[x][keyVal]);
          //console.log('tea keyval: ', item[keyVal]);
          if(this.state.activeSelections[x][keyVal] == item[keyVal]){
            shouldPush = true;
          }
        }
        //console.log('item + shouldPush:', item + ' + ' + shouldPush);
        if(shouldPush == true){
          filterMatchBank.push(item);
        }
      });
      return filterMatchBank;
    }
    //use search criteria to match tea objects
    if(this.state.activeSelections.length > 0){
      let results = returnedMatches();
      console.log('results:', results);
    }else{
//initial or nothing selected should show all available teas 
      console.log('all matches!');
    }
    
    //display matching teas on screen    
    return (
     "I am filteredMatched"
    );
  }
  
  getDatabase = () => {
    fetch("https://raw.githubusercontent.com/WebDevAndy32/Filtering-Menu/main/backend/database.json")
    .then(result => {
          return result.json();
          })
    .then(jString => {
      this.setState({
        database: jString.teas
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  
  buildSelections = () => {
   let selectionKeys = Object.keys(this.state.selections);
   let elementCollector = [];
   selectionKeys.forEach(ki => {
     let optionButtons = [];

     this.state.selections[ki].forEach(option => {
       let newButton = (
          <div id={'opt-' + ki + '-' + option} key={'opt-' + ki + '-' + option} onClick={this.optionsClick} className='selections-button' >
           {option}
          </div>
       );
        optionButtons.push(newButton);  
     });
     
     let newElement = (
     <div id={'sel-' + ki} key={'sel-' + ki} onClick={this.selectionsClick} className='selections-button'>
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
    let clickedButton = document.getElementById(buttonId);
    
    clickedButton.classList.toggle('sel-but-active');    
    
    let stateId = buttonId.slice(4);
    let selOptSpace = document.getElementById('sel-options-' + stateId);
    
    //cond. prevents misclicks from causing errors
    if(selOptSpace !== null){
      selOptSpace.classList.toggle('opt-space-active');
    }
  }
  
  optionsClick = () => {
    let buttonId = event.target.id;
    let clickedButton = document.getElementById(buttonId);
    
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
    this.buildSelections();
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
