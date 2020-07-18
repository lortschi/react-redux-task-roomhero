import React, {Component, useState} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { createPost } from '../actions/postActions';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AddIcon from '@material-ui/icons/Add';
import style from '../styles/main.scss';

const drawerWidth = 240;

/**
 * Style properties to override Material UI components
 * 
 * @param {Object} theme Material UI theme
 */
const styles = theme => ({
	root: {
		display: 'flex',
		position: 'relative',
		width: '100%',
		flexGrow: 1,
		zIndex: 1
	},
	flex: {
		flex: 1
	},
	menuButton: {
		marginLeft: -12,
		marginRight: 20
	},
	navIconHide: {
		[theme.breakpoints.up('md')]: {
			display: 'none'
		}
	},
	appBar: {
		borderBottom: '1px solid #cccccc',
		[theme.breakpoints.up('md')]: {
			position: 'absolute',
			width: '100%'
		}
	},
	toolbar: theme.mixins.toolbar,
	drawerContainer: {
		height: '100%' 
	},
	drawerPaper: {
		width: drawerWidth,
		zIndex: '0',
		background: '#cccccc'
	},
	logo: {
		width: 300
	},
	drawerList: {
		display: 'flex',
		alignItems: 'center',
		padding: '20px 0 15px 30px',
		cursor: 'pointer',
		'&:hover': {
			background: '#757575'
		}
	},
	largeIcon: {
		width: 40,
		height: 40,
		paddingRight: 5,
		marginLeft: -8,
		color: '#ef7303'
  	}
});

/**
 * @class Navbar is the Material UI navigation component
 */
class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
		mobileOpen: false,
		addZulieferer: false,
		countZulieferer: 1,
		zuliefererElement: [],
		currentZulieferer: 0,
		name: '',
		website: '',
		internalComments: '',
		deliveryTime: '',
		contacts: [],
		toggleTabChange: true
    };
  }

  /**
   * Handles the navbar side drawer visibility and toggle
   */
  handleDrawerToggle = () => {
    	this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  /**
   * Navbar side drawer population with new supplier tabs
   */
  addZulieferer = () => {
	this.setState({ addZulieferer: true, countZulieferer: this.state.countZulieferer + 1 });
	this.state.zuliefererElement.push((<List key={this.state.zuliefererElement.length} className={this.props.classes.drawerList}>Zulieferer</List>));
    
    // trigger setZulieferer function from second drawer tab
    if (this.state.countZulieferer >= 2) {
		const elementKey = this.state.currentZulieferer + 1;
		this.setZulieferer(elementKey, 1);
    }
  }

  /**
   * Bindes the clicked supplier tab index to the theme property as currentZulieferer.
   * At creation of the List element the setZulieferer function triggers once to set the index to the first new drawer tab. 
   * 
   * @param {HTMLElement} elementKey the clicked list element key
   * @param {number} toggle the entry of the function
   * 
   * @returns {undefined}
   * 
   */
  setZulieferer = (elementKey, toggle) => {
    // sets the index automatically after "+Zulieferer hinzufügen" was clicked and so the focus onto the new drawer tab
    if (!this.state.toggleTabChange && !toggle) {
      	return;
    }
    this.setState({currentZulieferer: elementKey, toggleTabChange: false});
    const { name, website, internalComments, deliveryTime, contacts } = this.state;
    const post = { name, website, internalComments, deliveryTime, contacts };
    // after data is stored force rerender to empty all forms
    this.props.createPost(post);
  }

  render() {
    const { addZulieferer, currentZulieferer } = this.state;
    const {classes, theme} = this.props;

    // paint the navbar like Roomhero CI
    theme.palette.primary = {
		contrastText: "#000",
		dark: "#000",
		light: "#fff",
		main: "#fff"
    }

    // set properties to theme
    theme.addZulieferer = addZulieferer;
    theme.currentZulieferer = currentZulieferer;

    /**
     * Navbar side drawer 
     */
    const drawer = (
      <div className={classes.drawerContainer}>
        <div className={classes.toolbar} />
        <Divider />
        <List className={classes.drawerList}>Zulieferer</List>
        <Divider />
        <List className={classes.drawerList} onClick={() => this.addZulieferer()}><AddIcon className={classes.largeIcon} />Zulieferer hinzufügen</List>
        <Divider />
        {this.state.zuliefererElement.map((element, index) => (
          <span key={index} onChange={this.setZulieferer(element.key)} onClick={() => this.setZulieferer(element.key, 1)}>{element}<span className={style.zuliefererCounter}>{index + 1}</span>{<Divider />}</span>
        ))}
      </div>
    );

    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar} position="static" elevation={0}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.navIconHide}
            >
              <MenuIcon />
            </IconButton>
            <Typography className={classes.flex} variant="title" color="inherit" noWrap>
              <img src="public/images/logo.png" alt="logo" className={classes.logo} />
            </Typography>
            <div>
              <IconButton>
                <AccountCircle/>
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <Hidden mdUp>
        <Drawer
			variant="temporary"
			anchor={theme.direction === 'rtl' ? 'right' : 'left'}
			open={this.state.mobileOpen}
			onClose={this.handleDrawerToggle}
			classes={{
				paper: classes.drawerPaper,
			}}
			ModalProps={{
				keepMounted: true
			}}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
			variant="permanent"
			open
			classes={{
				paper: classes.drawerPaper,
			}}
        >
          {drawer}
        </Drawer>
      </Hidden>
    </div>
    )
  }
}

const mapStateToProps = state => ({
  	post: state.posts.item
});

const mapDispatchToProps = {
  	createPost
};

Navbar.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
	createPost: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Navbar));
