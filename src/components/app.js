import { h } from 'preact';
import { Router } from 'preact-router';

import Header from './header';

// Code-splitting is automated for `routes` directory
import Home from '../routes/home';
// import Profile from '../routes/profile';

import "tailwindcss/tailwind.css"
import {DbServiceContext} from "../contexts/db";
import DbService from '../contexts/db';

const dbService = new DbService();

const App = () => (
	<DbServiceContext.Provider value={dbService}>
		<div id="app">
			<Header/>
			<div className="p-header h-full">
				<Router>
					<Home path="/"/>
					{/*<Profile path="/profile/" user="me" />*/}
					{/*<Profile path="/profile/:user" />*/}
				</Router>
			</div>
		</div>
	</DbServiceContext.Provider>
)

export default App;
