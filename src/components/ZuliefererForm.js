import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createPost } from '../actions/postActions';
import { withStyles } from '@material-ui/core/styles';
import { ObjectID } from 'bson';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SweetAlert from 'sweetalert2-react';
import style from '../styles/main.scss';

/**
 * Style properties to override Material UI components
 */
const styles = theme => ({
  	buttonStyle: {
		marginTop: 30,
		borderRadius: 0,
		fontSize: 12,
		color: '#fff',
		background: '#ef7303',
		boxShadow: 'none',
		[theme.breakpoints.down('sm')]: {
			position: 'absolute',
			width: 210,
			bottom: -350,
			margin: '30px 1px 15px'
		}
	},
	textFieldStyle: {
			marginBottom: 10
	},
	textAreaStyle: {
			marginTop: 20
	}
});

/**
 * @class ZuliefererForm is the form component for the supplier contact 
 */
class ZuliefererForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
		_id: new ObjectID(),
		createdAt: new Date().toISOString(),
		modifiedAt: new Date().toISOString(),
		name: '',
		website: '',
		internalComments: '',
		deliveryTime: '',
		post: [],
		showAlert: false,
		showText: ''
    }
    // element refs
    this.nameFieldRef = React.createRef();
    this.websiteFieldRef = React.createRef();
    this.deliveryTimeFieldRef = React.createRef();
  }

  componentWillReceiveProps = () => {
    // empty all form entries if the Zulieferer tab is switched
    this.setState({
		name: '',
		website: '',
		internalComments: '',
		deliveryTime: ''
    })
  }

  /**
   * Handles form submit
   * 
   * @param {HTMLElement} event of the button clicked element
   * 
   * @returns {undefined}
   */
  handleSubmit = (event) => {
    event.preventDefault();
    const contacts = this.props.theme.ansprechpartner;
    const { _id, createdAt, modifiedAt, name, website, internalComments, deliveryTime } = this.state;
    const post = { _id, createdAt, modifiedAt, name, website, internalComments, deliveryTime, contacts };

    if (!this.validateAnsprechpartner()) {
		this.setState({ showAlert: true, showText: 'Bitte füllen Sie erst das Ansprechpartner Formular aus. Nach dem ausfüllen bitte vergessen Sie nicht zu speichern.'});
		return;
    }

    if (!this.validateFields()) {
		this.releaseErrorState();
		return;
    }

    // submit data to action handler
    this.props.createPost(post);
    this.state.post.push(post);
  }

  /**
   * Validate the Ansprechpartner form is filled before Zulieferer
   * 
   * @returns {boolean} for filled out inupt entry
   */
  validateAnsprechpartner = () => {
    if (this.props.theme.ansprechpartner === undefined) {
      	return false;
    }
    return true;
  }

  /**
   * Validates the textFields and triggers SweetAlert2
   * 
   * @return {boolean} if it throws error by validation
   */
  validateFields = () => {
    // validate name textField
    if (this.state.name === '') {
		this.nameFieldRef.current.style.border = '1px solid #FC0E03';
		this.setState({ showAlert: true, showText: 'Bitte geben Sie einen Namen an.'});
		return false;
    // validate website textField
    } else if (!/(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!]))?/.test(this.websiteFieldRef.current.value)) {
		this.websiteFieldRef.current.style.border = '1px solid #FC0E03';
		this.setState({ showAlert: true, showText: 'Bitte geben Sie eine valide URL an.'});
		return false;
    // validate lieferzeit textField
    } else if (!(this.deliveryTimeFieldRef.current.value > 0)) {
		this.deliveryTimeFieldRef.current.style.border = '1px solid #FC0E03';
		this.setState({ showAlert: true, showText: 'Bitte geben Sie eine Nummer an, die höher als 0 ist.'});
		return false;
    } else {
      	return true;
    }
  }

  /**
   * Release the error linted textField rows 
   */
  releaseErrorState = () => {
    setTimeout(() => {
		this.nameFieldRef.current.style.border = '1px solid #FFF';
		this.websiteFieldRef.current.style.border = '1px solid #FFF';
		this.deliveryTimeFieldRef.current.style.border = '1px solid #FFF';
    }, 5000);
  }

  render() {
    const { classes, theme } = this.props;
    const { name, website, internalComments, deliveryTime, post } = this.state;
    let states = { name, website, internalComments, deliveryTime, post };

    // determines the current clicked zulieferer tab and map supplier object
    if (post.length > 0) {
		post.map((prop, index) => {
			if (parseInt(theme.currentZulieferer) === index) {
				return states = prop;
			}
		});
    }
  
    return (
      <>
        <SweetAlert
			show={this.state.showAlert}
			title="Achtung"
			text={this.state.showText}
			onConfirm={() => this.setState({ showAlert: false })}
        />
        {!theme.addZulieferer && <h3>Bitte legen Sie den ersten Zulieferer an.</h3>}
        <div className={theme.addZulieferer ? style.zuliefererWrapperVisible : style.zuliefererWrapper}>
			<p>ZULIEFERER / ZULIEFERER HINZUFÜGEN</p>
			<h3>ZULIEFERER HINZUFÜGEN</h3>
			<form onSubmit={this.handleSubmit} noValidate autoComplete="off">
				<div className={style.zuliefererTextFieldWrapper}>
				<TextField
					required
					label="Name"
					name="name"
					value={name || states.name}
					inputRef={this.nameFieldRef}
					onChange={e => {
					this.setState({ name: e.target.value })
					}}
					className={classes.textFieldStyle}
				/>
				<TextField
					label="Website"
					name="website"
					value={website || states.website}
					inputRef={this.websiteFieldRef}
					onChange={e => {
					this.setState({ website: e.target.value })
					}}
					className={classes.textFieldStyle}
				/>
				<TextField
					label="Kommentar"
					name="internalComments"
					multiline
					variant="outlined"
					rows={4}
					value={internalComments || states.internalComments}
					onChange={e => {
					this.setState({ internalComments: e.target.value })
					}}
					className={classes.textAreaStyle}
				/>
				<TextField
					label="Lieferzeit"
					name="deliveryTime"
					value={deliveryTime || states.deliveryTime}
					inputRef={this.deliveryTimeFieldRef}
					onChange={e => {
					this.setState({ deliveryTime: e.target.value })
					}}
					className={classes.textFieldStyle}
				/>
				</div>
				<Button 
					type="submit" 
					variant="contained" 
					className={classes.buttonStyle}>
					HINZUFÜGEN
				</Button>
			</form>
        </div>
      </>
    )
  }
}

const mapStateToProps = state => ({
  	post: state.posts.item
});

ZuliefererForm.propTypes = {
	createPost: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired
}

const mapDispatchToProps = {
  	createPost
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(ZuliefererForm));