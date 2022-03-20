import Link from 'next/link'
import axios from 'axios'
import { useEffect, useState} from 'react'
import {z, object, string, TypeOf, array, boolean} from "zod";

const questionAnswer = object({
    question: string({
        required_error: "question is required"
    }),
    type: z.enum(["Single", "Multi", "Optional"]),
    options: string().array().optional(),
})

const createExperimentSchema =  object({
        _id: string(),
        name: string({
             required_error: "name is required"
        }),
        isActive: boolean({
            required_error: "isActive is required",
            invalid_type_error: "isActive must be a boolean",
        }),
        questions: array(questionAnswer)
    }).array()

export type CreateExperimentInput = TypeOf< typeof createExperimentSchema>;
function ExperimentList(){
    const [experimentData, setExperimentData] = useState<CreateExperimentInput>([]);
    useEffect(() => {  
        getExperiment();
    }, [])

    const getExperiment = async () => {
        try{
            const experiments = await axios.get('http://localhost:3365/api/getExperiments')
            setExperimentData(experiments?.data);
            console.log(experiments);
        }
        catch(err){
            console.log(err)
        }
    }
    return (
        <>
            <div className="main-container">
                <div className="heading">
                    <h1 className="heading__title">Current Experiments</h1>
                </div>
                <div className="cards">
                    {
                        experimentData?.map((value, index) => (
                            <Link href={`/experiments/${value?._id}`} key = {index}>
                                <div className="card card-1">
                                    <div className="card__icon"><i className="fas fa-bolt"></i></div>
                                    <p className="card__exit"><i className="fas fa-times"></i></p>
                                    <h2 className="card__title">{value.name}</h2>
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