import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from '../src/store';
import Zulieferer from './components/Zulieferer';
import Navbar from './components/Navbar';
import './styles/main.scss';

export default class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<Navbar />
				<Zulieferer />
			</Provider>
		)
	}
}
