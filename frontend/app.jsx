class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      
    }
    this.selectionMenu = this.selectionMenu.bind(this);
    this.filteredMatches = this.filteredMatches.bind(this);
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
  
  render(){
    
    return(
      <div id='react-container'>
        <div id='menu-space'>
          {this.selectionMenu()}
        </div>
        <div id='filtered-matches'>
          {this.filteredMatches()}
        </div>
      </div>  
    );
  }
}

ReactDOM.render(React.createElement(App), document.getElementById('main-container'));
