class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      database: ["blank"],
      selections: {name: ['blank'],
                   brand: ['blank'], 
                   color: ['blank'], 
                   caffeine: ['high', 'medium', 'low', 'none'], 
                   type: ['black', 'green', 'white', 'herbal'], 
                   tastesLike: ['sweet', 'citrusy', 'smokey', 'bitter', 'aromatic', 'funky', 'spicy', 'floral', 'smooth', 'fruity', 'neutral'], 
                   ingredients: ['blank']
                  }
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
    //selected buttons define search criteria
    
    //use search criteria to match tea objects
    
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
    let stateValues = this.state.stateId;
    
    selOptSpace.classList.toggle('opt-space-active');
    
  }
  
  optionsClick = () => {
    let buttonId = event.target.id;
    let clickedButton = document.getElementById(buttonId);
    
    clickedButton.classList.toggle('sel-but-active'); 
  }
  
  componentDidMount(){
    this.getDatabase();
    this.buildSelections();
  }  

  render(){

    return(
      <div id='react-container'>
        <div id='menu-space'>
          {this.selectionMenu()}
        </div>
        <div id='filtered-matches'>
          {this.filteredMatches()}
          <br/>
        </div>
      </div>  
    );
  }
}

ReactDOM.render(React.createElement(App), document.getElementById('main-container'));
