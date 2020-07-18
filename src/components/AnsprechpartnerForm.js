import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createPost } from '../actions/postActions';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import SweetAlert from 'sweetalert2-react';
import style from '../styles/main.scss';

/**
 * Style properties to override Material UI components
 * 
 * @param {Object} theme Material UI theme
 */
const styles = theme => ({
    buttonStyle: {
        width: '35%',
        marginTop: 30,
        borderRadius: 0,
        fontSize: 12,
        color: '#fff',
        background: '#ef7303',
        boxShadow: 'none',
        [theme.breakpoints.down('sm')]: {
            width: '50%',
            marginTop: 10
        }
    },
    buttonWrapperStyle: {
        display: 'flex',
        justifyContent: 'space-evenly',
        paddingBottom: 20,
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            padding: '0 0 60px 10px'
        }
    },
    textFieldStyle: {
        width: 215,
        margin: '0 20px 0 10px',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            margin: 0
        }
    },
    cancelButtonStyle: {
        height: 35,
        width: '35%',
        borderRadius: 0,
        marginTop: 30,
        border: '1px solid #000',
        fontSize: 12,
        background: 'none',
        boxShadow: 'none',
        [theme.breakpoints.down('sm')]: {
            width: '50%'
        }
    },
    radioFieldset: {
        margin: '10px 0 0 10px',
        [theme.breakpoints.down('sm')]: {
            margin: '10px 0 0'
        }
    },
    radioGroup: {
        flexDirection: 'row'
    }
});

/**
 * @class AnsprechpartnerForm is the form component for the direct contact person 
 */
class AnsprechpartnerForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            select: 'f',
            firstName: '',
            lastName: '',
            position: '',
            spokenLanguage: '',
            phone: '',
            email: '',
            showAlert: false,
            showText: '',
            post: [],
        }
        this.emailFieldRef = React.createRef();
    }

    componentWillReceiveProps = () => {
        // empty all form entries if the Zulieferer tab is switched
        this.setState({
            select: 'f',
            firstName: '',
            lastName: '',
            position: '',
            spokenLanguage: '',
            phone: '',
            email: ''
        })
    }

    /**
     * Handles form submit
     * 
     * @param {HTMLElement} event of the button clicked element
     */
    handleSubmit = (event) => {
        event.preventDefault();
        if (!this.validateFields()) {
            this.releaseErrorState();
            return;
        }

        const { select, firstName, lastName, position, spokenLanguage, phone, email } = this.state;
        const post = { select, firstName, lastName, position, spokenLanguage, phone, email };

        this.props.theme.ansprechpartner = post;
        this.state.post.push(post);
    }

    /**
     * Validates the email textField and triggers SweetAlert2
     * 
     * @return {boolean} if it throws error by validation
     */
    validateFields = () => {
        if (!/(.+)@(.+){2,}\.(.+){2,}/.test(this.emailFieldRef.current.value)) {
            this.emailFieldRef.current.style.border = '1px solid #FC0E03';
            this.setState({ showAlert: true, showText: 'Bitte geben Sie eine valide E-Mail Adresse an.'});
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
            this.emailFieldRef.current.style.border = '1px solid #FFF';
        }, 5000);
    }

    render() {
        const { classes, theme } = this.props;
        const { select, firstName, lastName, position, spokenLanguage, phone, email, post } = this.state;
        let states = { select, firstName, lastName, position, spokenLanguage, phone, email };

        // determines the current clicked zulieferer tab and map contacts object
        if (post !== undefined && post.length > 0) {
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
                <div className={theme.addZulieferer ? style.ansprechpartnerWrapperVisible : style.ansprechpartnerWrapper}>
                    <h4>ANSPRECHPARTNER</h4>
                    <form onSubmit={this.handleSubmit} noValidate autoComplete="off">
                        <div className={style.ansprechpartnerTextFieldWrapper}>
                        <div className={style.ansprechpartnerTextFieldRow}>
                                <FormControl className={classes.radioFieldset} component="fieldset">
                                    <FormLabel component="legend">Anrede</FormLabel>
                                    <RadioGroup className={classes.radioGroup} aria-label="gender" name="salutation" value={select} onChange={e => {
                                            this.setState({ select: e.target.value })
                                        }}>
                                        <FormControlLabel value={'f' || ''} control={<Radio color="default" />} label="Frau" />
                                        <FormControlLabel value={'m' || ''} control={<Radio color="default" />} label="Herr" />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                            <div className={style.ansprechpartnerTextFieldRow}>
                                <TextField
                                    required
                                    label="Vorname"
                                    name="firstName"
                                    value={firstName || states.firstName}
                                    onChange={e => {
                                        this.setState({ firstName: e.target.value })
                                    }}
                                    className={classes.textFieldStyle}
                                />
                                <TextField
                                    required
                                    label="Nachname"
                                    name="lastName"
                                    value={lastName || states.lastName}
                                    onChange={e => {
                                        this.setState({ lastName: e.target.value })
                                    }}
                                    className={classes.textFieldStyle}
                                />
                            </div>
                            <div className={style.ansprechpartnerTextFieldRow}>
                                <TextField
                                    label="Position"
                                    name="position"
                                    value={position || states.position}
                                    onChange={e => {
                                        this.setState({ position: e.target.value })
                                    }}
                                    className={classes.textFieldStyle}
                                />
                                <TextField
                                    label="Sprache"
                                    name="spokenLanguage"
                                    value={spokenLanguage || states.spokenLanguage}
                                    onChange={e => {
                                        this.setState({ spokenLanguage: e.target.value })
                                    }}
                                    className={classes.textFieldStyle}
                                />
                            </div>
                            <div className={style.ansprechpartnerTextFieldRow}>
                                <TextField
                                    required
                                    label="Telefon"
                                    name="phone"
                                    value={phone || states.phone}
                                    onChange={e => {
                                        this.setState({ phone: e.target.value })
                                    }}
                                    className={classes.textFieldStyle}
                                />
                                <TextField
                                    required
                                    label="E-Mail"
                                    name="email"
                                    value={email || states.email}
                                    inputRef={this.emailFieldRef}
                                    onChange={e => {
                                        this.setState({ email: e.target.value })
                                    }}
                                    className={classes.textFieldStyle}
                                />
                            </div>
                        </div>
                        <div className={classes.buttonWrapperStyle}>
                            <Button 
                                variant="contained" 
                                className={classes.buttonStyle, classes.cancelButtonStyle}>
                                ABBRECHEN
                            </Button>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                className={classes.buttonStyle}>
                                SPEICHERN
                            </Button>
                        </div>
                    </form>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => ({
    post: state.posts.item
});

AnsprechpartnerForm.propTypes = {
    createPost: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired
}

const mapDispatchToProps = {
    createPost
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(AnsprechpartnerForm));