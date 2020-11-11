// import './App.css';
import Articles, { modes } from './collections/articles/Articles';
import Article from './collections/articles/Article';

import {
    Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import history from './history';

const App = () => {
    return (
        <Router history={history}>
            <div>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/articles">Articles</Link>
                    </li>
                </ul>

                <Switch>
                    <Route exact path="/">
                        <h1>Home</h1>
                    </Route>
                    <Route path="/articles/:id/edit">
                        <Articles mode={modes.edit} />
                    </Route>
                    <Route path="/articles/:id">
                        <Article />
                    </Route>
                    <Route path="/articles">
                        <Articles mode={modes.list} />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}

export default App;
