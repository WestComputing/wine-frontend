import React, {Component} from 'react'
import WineAPI from '../api/WineAPI.js'

class WinePage extends Component {
  state = {
    wine: {}
  }

  componentDidMount() {
    const id = this.props.match.params.wineID
    WineAPI.fetchWineByID(id)
      .then((wine) => this.setState({
        wine: wine
      }))
  }

  render() {
    const wine = this.state.wine
    return (
      <div>
        <h2> Name </h2>
        <p> {wine['wine_name']}</p>
        <h2> Price </h2>
        <p> {wine['price']}</p>
        <h2> Varietal </h2>
        <p> {wine['varietal']}</p>
        <h2> Description </h2>
        <p> {wine['description']}</p>
      </div>
    )
  }
}

export default WinePage;