class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      database: ["blank"],
      selections: {name: 'blank',
                   brand: 'blank', 
                   color: 'blank', 
                   caffeine: ['high', 'medium', 'low', 'none'], 
                   type: ['black', 'green', 'white', 'herbal'], 
                   tastesLike: ['sweet', 'citrusy', 'smokey', 'bitter', 'aromatic', 'funky', 'spicy', 'floral', 'smooth', 'fruity', 'neutral'], 
                   ingredients: 'blank'
                  }
    }
    this.selectionMenu = this.selectionMenu.bind(this);
    this.filteredMatches = this.filteredMatches.bind(this);
    this.getDatabase = this.getDatabase.bind(this);
    this.buildSelections = this.buildSelections.bind(this);
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
     let newElement = (
     <div id={'sel-' + ki} key={'sel-' + ki} className='selections-button'>
         {ki}
     </div>    
     );
     elementCollector.push(newElement);
   });
    return elementCollector;
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
