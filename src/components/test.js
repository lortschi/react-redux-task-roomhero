import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import Zulieferer from './Zulieferer';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();
const store = mockStore({});
import '../enzyme.setup';

describe('<Zulieferer />', () => {
  	it('should render', () => {
		expect(
			shallow(
				<Provider store={store}>
					<Zulieferer />
				</Provider>
			).exists(<h1>Test page</h1>)
		).toBeDefined();
  	});
});