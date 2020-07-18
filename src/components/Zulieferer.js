import React, { Component } from 'react';
import ZuliefererForm from './ZuliefererForm';
import AnpsrechpartnerForm from './AnsprechpartnerForm';
import styles from '../styles/main.scss';

/**
 * @class Zulieferer is the parent component container
 */
class Zulieferer extends Component {
  
	render() {
		return (
			<div className={styles.formsWrapper}>
				<ZuliefererForm/>
				<AnpsrechpartnerForm />
			</div>
		)
	}
}

export default Zulieferer;