Monday, July 13, 2020
====================

## Video Resources (Kilo Platoon)
* [Week 9 Videos](https://www.youtube.com/playlist?list=PLu0CiQ7bzwESms-mvdO37u2hnduY5JbXv)

# Connecting React to Django

Now that we've learned how to make a Django API (we deployed it a little while ago) and learned how to create a React frontend, we are going to connect them together.  Today, we'll create a very simple app that will display our wines and give the ability to create a new wine.

Like always, let's create a new React app called Wine Frontend:

```sh
$ npx create-react-app wine-frontend
```

After `cd`-ing into the repo, let's open it up and get React Router set up to take care of routes for us. First, let's get the dependencies installed:

```sh
$ npm install react-router-dom --save
$ npm install react-bootstrap --save
$ npm install react-bootstrap-table --save
$ npm install
```

In `App.js`, let's add in the following:

```javascript
import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage.js'
import WinePage from './pages/WinePage.js'

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/wines/:wineID" component={WinePage} />
          </div>
        </BrowserRouter>
      </div>
    )
  }
}

export default App
```

Next, we'll create a folder called `pages` and in that folder, `HomePage.js` and `WinePage.js`. `HomePage.js` should read as follows:

```javascript
import React, { Component } from 'react'

class HomePage extends Component {
  render() {
    return (
      <div>
        <h1> Home Page </h1>
      </div>
    )
  }
}

export default HomePage
```

`WinePage.js` should read:

```javascript
import React, { Component } from 'react'

class WinePage extends Component {
  render() {
    return (
      <div>
        <h1> Wine Page </h1>
      </div>
    )
  }
}

export default WinePage
```

Let's ensure that we can hit those pages before we do anything:

```sh
npm start
```

Next, let's get an API set up in our React app to talk with our previously built Django Wine app - `src/api/WineAPI.js`:

```javascript
const fetchWineByID = (wineID) => {
  return fetch(`https://cors-anywhere.herokuapp.com/https://wineapi-cp.herokuapp.com/wines/${wineID}`)
    .then((response) => response.json())
}

const fetchWines = () => {
  return fetch(`https://cors-anywhere.herokuapp.com/https://wineapi-cp.herokuapp.com/wines`)
    .then((response) => response.json())
}

export default {
  fetchWineByID,
  fetchWines
}
```

The `cors-anywhere` link is required for us because we're making a request to our Heroku App via `localhost` and not on Heroku's domain. More reading can be found [here](https://medium.com/netscape/hacking-it-out-when-cors-wont-let-you-be-great-35f6206cc646).

Next, we need to hook up our `HomePage.js` to our API. This page will list out all of our wines with links to each individual wine. In that file, let's add the following:

```javascript
import React, { Component } from 'react'
import WineList from '../components/WineList/WineList.js'
import WineAPI from '../api/WineAPI.js'

class HomePage extends Component {
  state = {
    wines: []
  }

  componentDidMount(){
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
        <WineList wines={this.state.wines} />
      </div>
    )
  }
}

export default HomePage
```

You'll notice that I added a new component: `WineList`. Let's create that file and add the following code inside of it:

```javascript
import React, { Component } from 'react'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

class WineList extends Component {
  render() {
    return (
      <div>
        <BootstrapTable data={this.props.wines}>
          <TableHeaderColumn isKey dataField='id'> ID </TableHeaderColumn>
          <TableHeaderColumn dataField='wine_name'> Name </TableHeaderColumn>
          <TableHeaderColumn dataField='price'> Price </TableHeaderColumn>
          <TableHeaderColumn dataField='varietal'> Varietal </TableHeaderColumn>
          <TableHeaderColumn dataField='description'> Description </TableHeaderColumn>
        </BootstrapTable>
      </div>
    )
  }
}

export default WineList
```

If you visit [http://localhost:3000](http://localhost:3000), you'll see a list of all the wines. Success! Next, let's move onto seeing an individual wine. In `WinePage.js`, let's add the following code:

```javascript
import React, { Component } from 'react'
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

export default WinePage
```

Visit http://localhost:3000/wines/1 to ensure that this works.

Lastly, let's create a form to create a new wine. First in `App.js`, we need to create a new route:

```javascript
import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage.js'
import WinePage from './pages/WinePage.js'
import AddWinePage from './pages/AddWinePage.js'

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/add-wine" component={AddWinePage} />
            <Route exact path="/wines/:wineID" component={WinePage} />
          </div>
        </BrowserRouter>
      </div>
    )
  }
}

export default App
```

From there, let's add the method to talk to our API in `WineAPI.js`:

```javascript
const fetchWines = () => {
  return fetch(`https://cors-anywhere.herokuapp.com/https://wineapi-cp.herokuapp.com/wines`)
    .then((response) => response.json())
}

const fetchWineByID = (wineID) => {
  return fetch(`https://cors-anywhere.herokuapp.com/https://wineapi-cp.herokuapp.com/wines/${wineID}`)
    .then((response) => response.json())
}

const addWine = (wineObject) => {
  return fetch('https://cors-anywhere.herokuapp.com/https://wineapi-cp.herokuapp.com/wines/new', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(wineObject)
  })
}

export default {
  fetchWineByID,
  fetchWines,
  addWine
}
```

Let's create a `AddWinePage.js` like we declared in `App.js`:

```javascript
import React, { Component } from 'react'
import { Form, Button } from 'react-bootstrap'
import WineAPI from '../api/WineAPI.js'
import { Redirect } from 'react-router'

class AddWinePage extends Component {
  state = {
    redirect: false
  }

  handleSubmit(event){
    event.preventDefault()
    const wineObject = {
      wine_name: event.target.elements[0].value,
      price: event.target.elements[2].value,
      varietal: event.target.elements[1].value,
      description: event.target.elements[3].value
    }
    WineAPI.addWine(wineObject)
      .then((response) => { this.setState({ redirect: true }) })
  }

  render() {
    const { redirect } = this.state
    if (redirect) {
      return <Redirect to = "/" />
    }

    return (
      <div>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Form.Group controlId="wine_name">
            <Form.Label>Wine Name</Form.Label>
            <Form.Control/>
          </Form.Group>

          <Form.Group controlId="varietal">
            <Form.Label>Wine Varietal</Form.Label>
            <Form.Control/>
          </Form.Group>

          <Form.Group controlId="price">
            <Form.Label>Wine Price</Form.Label>
            <Form.Control/>
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label>Wine Description</Form.Label>
            <Form.Control/>
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    )
  }
}

export default AddWinePage
```

Try adding a new wine and see that everything works! It's terribly ugly, but we have officially set up our Django API and connected it to a brand new React application. Let's get deployment to Heroku working. There are less steps involved than yesterday with Django, but deploying can still be tricky so get some practice! [Here is a link to a finished repo](https://github.com/limaplatoon/wine-frontend)

Are you able to make requests online? Perhaps not. Let's find out why!

#### Experiencing Errors?
1. If your React app is successfully deployed but you're receiving an application error `at=error code=H10 desc="App crashed" method=GET path="/"` read [here](https://dev.to/lawrence_eagles/causes-of-heroku-h10-app-crashed-error-and-how-to-solve-them-3jnl/comments) on possible solutions.
2. If you're unable to add a new wine. Look in your `add_wine` method in your django's `view.py` file. When you're sending the new wine request from React to the Django backend it's sending a JSON object in the body of the request. Python is unable to parse through a JSON object on it's own. You need to convert the JSON wine object to a python object. Consider using the built-in `json` python module to convert JSON to a python object. [json documentation](https://docs.python.org/3/library/json.html) & [resources](https://www.w3schools.com/python/python_json.asp).


## Allow Django to receive CORS requests
Due to web security, Django doesn't allow requests from CORS like we have in our API. We're going to change a few settings using [Django CORS Headers](https://github.com/ottoyiu/django-cors-headers/) so that it does. In your Django app from a while back, follow these steps:
1. Install Django CORS Headers
    ```sh
    $ cd whatever_path_to_your_app
    $ source venv/bin/activate
    $ pip install django-cors-headers
    $ pip freeze > requirements.txt
    ```
2. Add it to your installed apps
    ```python
    MIDDLEWARE = [
        # make sure these two lines come first
        'corsheaders.middleware.CorsMiddleware',
        'django.middleware.common.CommonMiddleware',
        ...
    ]
    ```
3. Add your website to the whitelist so that only CORS requests from your website are allowed in `settings.py`:
    ```
    CORS_ORIGIN_WHITELIST = ('your-full-site-no-https-//.herokuapp.com')
    ```

Commit these changes and push to Heroku master to see your app work! 

Here's an updated repo of the [Django Wine Backend](https://github.com/limaplatoon/wine-django-backend/).

---


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
