import React, {Component} from 'react'
import WineList from '../components/WineList/WineList.js'
import WineAPI from '../api/WineAPI.js'

class HomePage extends Component {
  state = {
    wines: []
  }

  componentDidMount() {
    WineAPI.fetchWines()
      .then((apiResponseJSON) => {
          this.setState({
            wines: apiResponseJSON.wines
          })
        }
      )
  }

  render() {
    return (
      <div>
        <h1> All Wines </h1>
        <WineList wines={this.state.wines}/>
      </div>
    )
  }
}

export default HomePage