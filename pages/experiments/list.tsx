import ExperimentData from "../data"
import Link from 'next/link'


function ExperimentList(){
    debugger;
    return (
        <>
            <div className="main-container">
                <div className="heading">
                    <h1 className="heading__title">Current Experiments</h1>
                </div>
                <div className="cards">
                    {
                        ExperimentData.map((value, index) => (
                            <Link href={`/experiments/${value.experiment.id}`} key = {index}>
                                <div className="card card-1">
                                    <div className="card__icon"><i className="fas fa-bolt"></i></div>
                                    <p className="card__exit"><i className="fas fa-times"></i></p>
                                    <h2 className="card__title">{value.experiment.name}</h2>
                                </div>
                            </Link>
                        ))
                    }
                        
                </div> 
            </div>
        </>
    )
}

export default ExperimentList;