import React, {PropTypes } from 'react'
import { View, Text, ListView, Image } from 'react-native'
import { connect } from 'react-redux'

// For empty lists
import AlertMessage from '../Components/AlertMessage'

// Styles
import styles from './Styles/ListviewGridExampleStyles'

import MovieActions from '../Redux/MoviesRedux';

class ListviewGridExample extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func,
    getMoviesPopular: PropTypes.func
  }

  constructor (props) {
    super(props)
    /* ***********************************************************
    * STEP 1
    * This is an array of objects with the properties you desire
    * Usually this should come from Redux mapStateToProps
    *************************************************************/

     //memanggil props type getMoviesPopular yang sudah kita deklarasikan diatas
   this.props.getMoviesPopular();

   //set nilai awal, json object disesuaikan dengan json data yang didapat
    const dataObjects = [
      { title: 'Wiro Sableng', vote_average: '999' }
    ];

    /* ***********************************************************
    * STEP 2
    * Teach datasource how to detect if rows are different
    * Make this function fast!  Perhaps something like:
    *   (r1, r2) => r1.id !== r2.id}
    *************************************************************/
    const rowHasChanged = (r1, r2) => r1 !== r2

    // DataSource configured
    const ds = new ListView.DataSource({rowHasChanged})

    // Datasource is always in state
    this.state = {
      dataSource: ds.cloneWithRows(dataObjects)
    }
  }

  /* ***********************************************************
  * STEP 3
  * `renderRow` function -How each cell/row should be rendered
  * It's our best practice to place a single component here:
  *
  * e.g.
    return <MyCustomCell title={rowData.title} description={rowData.description} />
  *************************************************************/
  renderRow (rowData) {
    return (
      <View style={styles.row}>
        <Image source={{ uri: 'https://image.tmdb.org/t/p/w320/' + rowData.poster_path }} style={styles.image_poster} />
        <Text style={styles.boldLabel}>{rowData.title}</Text>
        <Text style={styles.label}>{rowData.vote_average}</Text>
      </View>
    )
  }

  /* ***********************************************************
  * STEP 4
  * If your datasource is driven by Redux, you'll need to
  * reset it when new data arrives.
  * DO NOT! place `cloneWithRows` inside of render, since render
  * is called very often, and should remain fast!  Just replace
  * state's datasource on newProps.
  *
  * e.g.
    componentWillReceiveProps (newProps) {
      if (newProps.someData) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(newProps.someData)
        })
      }
    }
  *************************************************************/

    componentWillReceiveProps (newProps) {
      this.forceUpdate();
      if (newProps.movies.error === null && newProps.movies.data !== null) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(newProps.movies.data.results)
        });
      } else {
        console.log('>> error');
      } 
    }
  // Used for friendly AlertMessage
  // returns true if the dataSource is empty
  noRowData () {
    return this.state.dataSource.getRowCount() === 0
  }

  render () {
    return (
      <View style={styles.container}>
        <AlertMessage title='Nothing to See Here, Move Along' show={this.noRowData()} />
        <ListView
          contentContainerStyle={styles.listContent}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          pageSize={15}
        />
      </View>
    )
  }
}

//mapping nilai state yang didapat kedalam props
const mapStateToProps = (state) => {
  return {
    // ...redux state to props here
    movies: state.movies   
  }
}

//dispatch ke action moviesRequest 
const mapDispatchToProps = (dispatch) => {
  return {
     getMoviesPopular: () => dispatch(MovieActions.moviesRequest())
  };
};

//konek ke redux store
export default connect(mapStateToProps, mapDispatchToProps)(ListviewGridExample)
