class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      database: ["blank"]
    }
    this.selectionMenu = this.selectionMenu.bind(this);
    this.filteredMatches = this.filteredMatches.bind(this);
    this.getDatabase = this.getDatabase.bind(this);
  }
  
  selectionMenu = () => {
    
    
    return(
     "I am selectionMenu"
    );
  }
        
  filteredMatches = () => {
    
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
  componentDidMount(){
    this.getDatabase();

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
