import ReactDOM from 'react-dom';
import React from 'react'
import Rx from 'rx'

const ImageCol = React.createClass({
    componentDidUpdate() {
	$('.materialboxed').materialbox();
    },
    render() {
	return ( <div className={"col s" + this.props.width}>
		 <div className="row">
		 {( _ => {
		     return this.props.images.map(d => {
			 return ( <div className="col s12" key={d}>
				  <div className="card">
				  <div className="card-image">
				  <img src={d} className="materialboxed"></img>
				  </div>
				  <div className="card-content">
				  </div>
				  </div>
				  </div>
				);
		     });
		 })()}
		 </div>
		 </div>
	)
    }
});

const Main = React.createClass({
    getInitialState() {
	return { images: []}
    },
    componentWillMount() {
	Rx.Observable.fromPromise(new Promise( (resolve, reject) => {
	    let ajax = new XMLHttpRequest();
	    ajax.open("GET", "http://localhost:3000/images?start=0&end=10", true);
	    ajax.onreadystatechange = _ => {
		if(ajax.readyState == 4) {
		    if(ajax.status == 200) {

			resolve(JSON.parse(ajax.responseText));
		    }
		    else
			reject(ajax.statusText);
		}
	    };
	    ajax.send();
	    
	}))
	    .selectMany(data => {
		return Rx.Observable.fromArray(data).map(d => "http://localhost:3000/image/" + d.path);
	    })
	    .toArray()
	    .subscribe(data => {
		this.setState({images: data})
	    });
    },
    render() {
	return (<div className="container">
		{( _ => {
		    if(this.state.images) {
			let image0 = [], image1 = [], image2 = [], image3;
			let over = Rx.Observable.fromArray(this.state.images);
			over.filter( (_, index) => index % 4 == 0).toArray().subscribe(data => image0 = data);
			over.filter( (_, index) => index % 4 == 1).toArray().subscribe(data => image1 = data);
			over.filter( (_, index) => index % 4 == 2).toArray().subscribe(data => image2 = data);
			over.filter( (_, index) => index % 4 == 3).toArray().subscribe(data => image3 = data);
			
			return (<div className="row">
				<ImageCol images={image0} width={3} key="imageCol0"/>
				<ImageCol images={image1} width={3} key="imageCol1"/>
				<ImageCol images={image2} width={3} key="imageCol2"/>
				<ImageCol images={image3} width={3} key="imageCol3"/>
				</div>)
	
		    }
		})()
		}
		</div>
	       );
    }
});


document.addEventListener('DOMContentLoaded', _ => {
    console.log("Document ready");
    ReactDOM.render(<Main />, document.querySelector('#content'));

});
